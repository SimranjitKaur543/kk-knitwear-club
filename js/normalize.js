/* ==========================================================================
   K.K. Knitwear Club - spec normalizer
   --------------------------------------------------------------------------
   The manufacturer publishes the same idea under many different spec keys
   ("GSM", "Fabric GSM", "Products GSM") and in many different formats
   ("150", "120 to 250 GSM", "211-240 GSM", "on order").

   This file reads those published values and derives clean, comparable
   values that search, filters and the comparison table can use.

   IMPORTANT
   - Nothing here changes what the product page displays. Product pages
     always show product.specs exactly as the manufacturer wrote it.
   - When a value cannot be parsed (e.g. GSM "custom"), the derived value is
     simply left empty. It is never guessed. The product just does not appear
     under that filter.
   ========================================================================== */

var IMAGE_PATH = "images/products/";

/* Spec keys that mean the same thing, grouped together. -------------------- */

var KEY_GROUPS = {
    gsm:      ["GSM", "Fabric GSM", "Products GSM"],
    width:    ["Width", "Fabric Width", "Width(In Inches)"],
    material: ["Material", "Fabric", "Fabric Material", "Fabrics Material",
               "Fabric Type", "Composition", "Fabric Content", "Type"],
    pattern:  ["Pattern", "Pattern Type", "Prints/Pattern", "Design/Pattern",
               "Pattern / Design", "Weave", "Weave Type", "Surface Type",
               "Fabric Structure"],
    color:    ["Color", "Fabric Color"],
    usage:    ["Usage", "Usage/Application", "Usage/ Application", "Fabric Usage",
               "Usage And Application", "Use", "Application",
               "Use in home furnishing product"],
    finish:   ["Finish", "Wash Care"],
    sample:   ["Do You Fulfill Sample Orders", "Do You Provide Sample Orders"]
};

/* Collect every published value belonging to one group. */
function valuesFor(specs, group) {
    var keys = KEY_GROUPS[group] || [];
    var out = [];
    for (var i = 0; i < keys.length; i++) {
        var v = specs[keys[i]];
        if (v) { out.push(String(v)); }
    }
    return out;
}

/* ---- GSM ----------------------------------------------------------------
   Handles "150", "130 GSM", "190GSM", "100-150", "211-240 GSM",
   "120 to 250 GSM", "100 to 180 All GSM AVAILABLE".
   Returns null for "custom" / "on order".                                   */

function parseGsm(specs) {
    var text = valuesFor(specs, "gsm").join(" ");
    if (!text) { return null; }

    var found = text.match(/\d+/g);
    if (!found) { return null; }

    var nums = [];
    for (var i = 0; i < found.length; i++) {
        var n = parseInt(found[i], 10);
        // Plausible fabric weights only - keeps stray numbers out.
        if (n >= 50 && n <= 400) { nums.push(n); }
    }
    if (!nums.length) { return null; }

    nums.sort(function (a, b) { return a - b; });
    return { min: nums[0], max: nums[nums.length - 1] };
}

/* ---- Width in inches ----------------------------------------------------
   Handles "42 inches", "36 Inches/90 cm", "44-45", "40-42", "42",
   "160 cm" (converted), "42 inch".
   Returns null for "on order", "on demand", "custom", and for "37 mm"
   (millimetres are not a usable fabric width - the published value is
   kept on the product page, it is just not used for filtering).            */

function parseWidth(specs) {
    var vals = valuesFor(specs, "width");

    for (var i = 0; i < vals.length; i++) {
        var v = vals[i];

        if (/mm/i.test(v)) { continue; }

        // "42 inches", "44-45 inches", "36 Inches/90 cm"
        var inch = v.match(/(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*(?:inch|inches|in\b)/i);
        if (inch) {
            var lo = parseFloat(inch[1]);
            var hi = inch[2] ? parseFloat(inch[2]) : lo;
            return { min: lo, max: hi };
        }

        // "160 cm"
        var cm = v.match(/(\d+(?:\.\d+)?)\s*cm/i);
        if (cm) {
            var asIn = Math.round(parseFloat(cm[1]) / 2.54);
            return { min: asIn, max: asIn };
        }

        // Bare "42" or "40-42"
        var bare = v.match(/^\s*(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*$/);
        if (bare) {
            var b1 = parseFloat(bare[1]);
            var b2 = bare[2] ? parseFloat(bare[2]) : b1;
            if (b1 >= 20 && b1 <= 120) { return { min: b1, max: b2 }; }
        }
    }
    return null;
}

/* ---- Applications -------------------------------------------------------
   The manufacturer writes usage freely ("Sports Pazzama or Shirts",
   "Use IN TRACK SUITS SHORTS PAZZAMA"). We match their own words against a
   fixed list so buyers get one consistent filter.                          */

/* `prose` is the same label written so it can sit inside a sentence -
   "Used for t-shirts and polo shirts", not "Used for T-Shirts & Polo". */
var APPLICATION_RULES = [
    { label: "Sportswear",                 prose: "sportswear",
      re: /sport/i },
    { label: "T-Shirts & Polo",            prose: "t-shirts and polo shirts",
      re: /t[\s.-]?shirt|tshirt|polo/i },
    { label: "Lowers & Track Suits",       prose: "lowers and track suits",
      re: /lower|track\s?suit|tracksuit|trackpant|pazzama|pyjama|short/i },
    { label: "Shirts & Trousers",          prose: "shirts and trousers",
      re: /shirt|trouser|\bcoats?\b/i, ignoreTshirt: true },
    { label: "Burkha",                     prose: "burkha",
      re: /burkha|burka|bhurka/i },
    { label: "Lining",                     prose: "lining",
      re: /lining|astar/i },
    { label: "Blankets, Sweaters & Jackets", prose: "blankets, sweaters and jackets",
      re: /blanket|sweater|jacket|hoddie|hoodie/i },
    { label: "Home Furnishing",            prose: "home furnishing",
      re: /pillow|home\s?f[ua]rnishing|cushion|cartan/i },
    { label: "Tent, Table & Chair Covers", prose: "tent, table and chair covers",
      re: /tent|chair\s?cover|table/i },
    { label: "Curtains",                   prose: "curtains",
      re: /curtain/i },
    { label: "Bags",                       prose: "bags",
      re: /\bbag/i },
    { label: "Uniforms",                   prose: "uniforms",
      re: /uniform/i },
    { label: "Nightwear",                  prose: "nightwear",
      re: /night\s?suit|nightwear/i },
    { label: "Ethnic Wear & Dresses",      prose: "ethnic wear and dresses",
      re: /ethnic|dress\s?material|dresses/i },
    { label: "Industrial",                 prose: "industrial use",
      re: /industrial/i },
    { label: "Garments",                   prose: "garments",
      re: /garment|apparel|clothing/i }
];

function applicationProse(label) {
    for (var i = 0; i < APPLICATION_RULES.length; i++) {
        if (APPLICATION_RULES[i].label === label) {
            return APPLICATION_RULES[i].prose;
        }
    }
    return label.toLowerCase();
}

function parseApplications(product) {
    var hay = valuesFor(product.specs, "usage").join(" ") + " " +
              product.name + " " + (product.description || "");

    // "T-shirt" contains "shirt", and "Night Suits" contains "suits".
    // Rules flagged ignoreTshirt are tested against a copy with the
    // t-shirt wording removed, so a t-shirt fabric is not also tagged
    // as a shirting fabric.
    var hayNoTshirt = hay.replace(/t[\s.\-]?shirts?/ig, " ");

    var out = [];
    for (var i = 0; i < APPLICATION_RULES.length; i++) {
        var rule = APPLICATION_RULES[i];
        var target = rule.ignoreTshirt ? hayNoTshirt : hay;
        if (rule.re.test(target) && out.indexOf(rule.label) === -1) {
            out.push(rule.label);
        }
    }
    return out;
}

/* ---- Construction ------------------------------------------------------- */

var CONSTRUCTION_RULES = [
    { label: "Dot Knit",   re: /dot|polka|discat|grindal|rim\s?zim|rimzim|waffle/i },
    { label: "Matty",      re: /matty/i },
    { label: "Nirmal Knit",re: /nirmal/i },
    { label: "Rice Knit",  re: /rice\s?knit/i },
    { label: "Honeycomb",  re: /honeycomb/i },
    { label: "Interlock",  re: /interlock/i },
    { label: "Terry",      re: /terry/i },
    { label: "Foma",       re: /foma/i },
    { label: "Mesh / Jali",re: /mesh|jali/i },
    { label: "Micro",      re: /micro/i },
    { label: "Bon Patti",  re: /bon\s?patti/i },
    { label: "Plain Knit", re: /plain\s?knit/i }
];

function parseConstruction(product) {
    var hay = product.name + " " +
              valuesFor(product.specs, "material").join(" ") + " " +
              valuesFor(product.specs, "pattern").join(" ") + " " +
              (product.specs["Knit Type"] || "") + " " +
              (product.specs["Mesh Type"] || "");
    var out = [];
    for (var i = 0; i < CONSTRUCTION_RULES.length; i++) {
        if (CONSTRUCTION_RULES[i].re.test(hay) && out.indexOf(CONSTRUCTION_RULES[i].label) === -1) {
            out.push(CONSTRUCTION_RULES[i].label);
        }
    }
    return out;
}

/* ---- Pattern ------------------------------------------------------------ */

var PATTERN_RULES = [
    { label: "Dotted",  re: /dot|polka/i },
    { label: "Striped", re: /strip/i },
    { label: "Check",   re: /check/i },
    { label: "Printed", re: /print(?!s\/)/i },
    { label: "Plain / Solid", re: /plain|solid/i }
];

function parsePattern(product) {
    var hay = valuesFor(product.specs, "pattern").join(" ");
    var out = [];
    for (var i = 0; i < PATTERN_RULES.length; i++) {
        if (PATTERN_RULES[i].re.test(hay) && out.indexOf(PATTERN_RULES[i].label) === -1) {
            out.push(PATTERN_RULES[i].label);
        }
    }
    return out;
}

/* ---- Finishing ---------------------------------------------------------- */

var FINISH_RULES = [
    { label: "Dri-Fit",      re: /dri.?fit/i },
    { label: "Easy Care",    re: /easy\s?care/i },
    { label: "Soft Finish",  re: /soft/i },
    { label: "Machine Wash", re: /machine\s?wash/i }
];

function parseFinish(product) {
    var hay = valuesFor(product.specs, "finish").join(" ") + " " +
              valuesFor(product.specs, "material").join(" ");
    var out = [];
    for (var i = 0; i < FINISH_RULES.length; i++) {
        if (FINISH_RULES[i].re.test(hay) && out.indexOf(FINISH_RULES[i].label) === -1) {
            out.push(FINISH_RULES[i].label);
        }
    }
    return out;
}

/* ---- Composition -------------------------------------------------------- */

function parseComposition(specs) {
    var text = valuesFor(specs, "material").join(" ");
    if (/poly.?cotton|\bpc\b/i.test(text)) { return "Poly-Cotton"; }
    if (/100\s*%\s*polyester/i.test(text)) { return "100% Polyester"; }
    if (/polyester|polyster/i.test(text))  { return "Polyester"; }
    return null;
}

/* ---- Bands used by the filter panel ------------------------------------- */

var GSM_BANDS = [
    { label: "Up to 100 GSM", min: 0,   max: 100 },
    { label: "101 - 150 GSM", min: 101, max: 150 },
    { label: "151 - 200 GSM", min: 151, max: 200 },
    { label: "Above 200 GSM", min: 201, max: 9999 }
];

var WIDTH_BANDS = [
    { label: "Up to 36 in",  min: 0,  max: 36 },
    { label: "37 - 44 in",   min: 37, max: 44 },
    { label: "45 - 60 in",   min: 45, max: 60 },
    { label: "Above 60 in",  min: 61, max: 999 }
];

/* A product matches a band if its published range overlaps the band. */
function bandsFor(range, bands) {
    if (!range) { return []; }
    var out = [];
    for (var i = 0; i < bands.length; i++) {
        if (range.min <= bands[i].max && range.max >= bands[i].min) {
            out.push(bands[i].label);
        }
    }
    return out;
}

/* ---- Short labels shown on cards and in Quick Specs --------------------- */

function gsmLabel(product) {
    var raw = valuesFor(product.specs, "gsm");
    if (!raw.length) { return null; }
    var g = product.d.gsm;
    if (!g) { return raw[0]; }                        // e.g. "custom", "on order"
    return g.min === g.max ? g.min + " GSM" : g.min + "-" + g.max + " GSM";
}

function widthLabel(product) {
    var raw = valuesFor(product.specs, "width");
    if (!raw.length) { return null; }
    var w = product.d.width;
    if (!w) { return raw[0]; }                        // e.g. "on order", "37 mm"
    return w.min === w.max ? w.min + " in" : w.min + "-" + w.max + " in";
}

function priceLabel(product) {
    if (product.priceValue === null) { return "Price on request"; }
    return "₹" + product.priceValue + " / " + product.priceUnit;
}

/* ---- Short description -------------------------------------------------
   Only four of the fifty products publish a description of their own. For
   the rest this composes one sentence out of values the mill has already
   published - GSM, construction, composition, width, finish, application.

   Nothing here is invented. It is a restatement, in prose, of numbers that
   appear verbatim in the specification table lower down the same page. A
   product whose page already carries real copy uses that instead, and any
   product with fewer than two usable facts gets nothing rather than a
   padded sentence.                                                        */

/* Two items joined with "and" - unless one of them already contains an
   "and", in which case a comma keeps the sentence readable.
   "sportswear, t-shirts and polo shirts", not
   "sportswear and t-shirts and polo shirts". */
function joinTwo(items) {
    if (items.length < 2) { return items[0] || ""; }
    var glue = /\band\b/.test(items[0]) || /\band\b/.test(items[1]) ? ", " : " and ";
    return items[0] + glue + items[1];
}

function buildSummary(p) {
    var facts = 0;
    var s = "A";

    if (p.d.gsm && p.d.gsmLabel) {          // skips "custom" / "on order"
        s += " " + p.d.gsmLabel.replace(/ GSM$/, "") + " GSM";
        facts++;
    }

    /* "Mesh / Jali" reads badly mid-sentence - take the first term only. */
    if (p.d.construction.length) {
        s += " " + p.d.construction[0].split(" / ")[0].toLowerCase();
        facts++;
    } else if (p.d.pattern.length) {
        /* No construction published: the weave/print is the next best
           descriptor, and keeps "A fabric in polyester" from happening. */
        s += " " + p.d.pattern[0].split(" / ")[0].toLowerCase();
        facts++;
    }

    s += " fabric";

    if (p.d.composition) {
        s += " in " + (p.d.composition === "Poly-Cotton"
            ? "poly-cotton" : p.d.composition.toLowerCase());
        facts++;
    }

    if (p.d.width && p.d.widthLabel) {
        s += ", " + p.d.widthLabel.replace(/ in$/, " inches") + " wide";
        facts++;
    }

    if (p.d.finish.length) {
        /* Machine wash is care instruction, not a finish. And "Soft Finish"
           already ends in the word - do not write "a soft finish finish". */
        var fin = p.d.finish.filter(function (f) { return f !== "Machine Wash"; });
        if (fin.length) {
            var name = fin[0].replace(/\s*finish$/i, "").toLowerCase();
            s += ", with " + (/^[aeiou]/i.test(name) ? "an " : "a ") +
                 name + " finish";
            facts++;
        }
    }

    s += ".";

    /* Application is published data too, so it counts toward the threshold.
       Without it, three products with only a composition would get nothing. */
    var apps = p.d.applications
        .filter(function (a) { return a !== "Garments"; })
        .slice(0, 2)
        .map(applicationProse);

    if (!apps.length && p.d.applications.length) { apps = ["garments"]; }
    if (apps.length) { facts++; }

    if (facts < 2) { return null; }

    if (apps.length) { s += " Used for " + joinTwo(apps) + "."; }

    return s;
}

/* ==========================================================================
   Build the derived data once, at load time.
   ========================================================================== */

function enrichProducts(list) {
    for (var i = 0; i < list.length; i++) {
        var p = list[i];

        p.d = {
            gsm:   parseGsm(p.specs),
            width: parseWidth(p.specs)
        };

        p.d.applications  = parseApplications(p);
        p.d.construction  = parseConstruction(p);
        p.d.pattern       = parsePattern(p);
        p.d.finish        = parseFinish(p);
        p.d.composition   = parseComposition(p.specs);
        p.d.gsmBands      = bandsFor(p.d.gsm, GSM_BANDS);
        p.d.widthBands    = bandsFor(p.d.width, WIDTH_BANDS);
        p.d.sampleOrders  = valuesFor(p.specs, "sample")[0] || null;

        p.d.gsmLabel   = gsmLabel(p);
        p.d.widthLabel = widthLabel(p);
        p.d.priceLabel = priceLabel(p);

        /* Real published copy always wins over the composed sentence. */
        p.d.summary = p.description || buildSummary(p);
        p.d.summaryIsDerived = !p.description && !!p.d.summary;
        p.d.image      = IMAGE_PATH + p.images[0];
        p.d.images     = p.images.map(function (f) { return IMAGE_PATH + f; });

        // Everything a search query can match against.
        var bag = [p.name, p.source, p.description || ""];
        for (var k in p.specs) {
            if (Object.prototype.hasOwnProperty.call(p.specs, k)) {
                bag.push(k, p.specs[k]);
            }
        }
        bag = bag.concat(p.d.applications, p.d.construction, p.d.pattern, p.d.finish);
        for (var c = 0; c < p.categories.length; c++) {
            var cat = categoryByKey(p.categories[c]);
            if (cat) { bag.push(cat.name); }
        }
        p.d.search = bag.join(" ").toLowerCase();
    }
    return list;
}

function categoryByKey(key) {
    for (var i = 0; i < CATEGORIES.length; i++) {
        if (CATEGORIES[i].key === key) { return CATEGORIES[i]; }
    }
    return null;
}

function productById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
        if (PRODUCTS[i].id === id) { return PRODUCTS[i]; }
    }
    return null;
}

/* Collect the distinct values actually present, so filters never show an
   option that would return zero products. */
function collectFacet(field) {
    var seen = {};
    var out = [];
    for (var i = 0; i < PRODUCTS.length; i++) {
        var vals = PRODUCTS[i].d[field];
        if (!vals) { continue; }
        if (typeof vals === "string") { vals = [vals]; }
        for (var j = 0; j < vals.length; j++) {
            if (!seen[vals[j]]) { seen[vals[j]] = true; out.push(vals[j]); }
        }
    }
    return out;
}

enrichProducts(PRODUCTS);
