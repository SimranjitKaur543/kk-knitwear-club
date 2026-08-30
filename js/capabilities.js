/* ==========================================================================
   K.K. Knitwear Club - capabilities page
   --------------------------------------------------------------------------
   Every figure on this page is COMPUTED FROM js/products.js at load time.
   Nothing is written by hand and nothing is asserted that the mill has not
   published.

   That constraint is why the page is called "Capabilities" and not
   "Services": the source site publishes no service offerings - no dyeing,
   job work, printing, private label or OEM - so none are claimed here.
   What it does publish, scattered across fifty product listings, is what it
   can make and how it trades. This page aggregates exactly that.

   Because the numbers are derived, they stay correct when products.js
   changes. Add a fabric and the ranges update themselves.
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs;

    /* ---------------------------------------------------------------------
       AWAITING INFORMATION FROM THE MILL

       These are the things a fabric buyer normally asks that the source
       site does not publish anywhere. They are rendered as clearly marked
       placeholders rather than being quietly omitted, so the page doubles
       as a checklist of what still has to be collected.

       TO FILL ONE IN: replace `null` with the real text.
       TO REMOVE ONE:  delete its entry from this array.
       When every entry has text, the "awaiting information" styling and
       notice disappear on their own.
       --------------------------------------------------------------------- */
    var PENDING = [
        {
            title: "Production capacity",
            asks: "Number of knitting machines, machine types and gauges, and typical monthly output in kg or metres.",
            answer: null
        },
        {
            title: "Lead times",
            asks: "Turnaround for a stock-lot order, for a made-to-order run, and for a sample.",
            answer: null
        },
        {
            title: "Dyeing and processing",
            asks: "Whether dyeing, finishing and processing are done in-house or outsourced, and which finishes can be applied to order.",
            answer: null
        },
        {
            title: "Quality assurance",
            asks: "Inspection stages, any GSM or shrinkage testing carried out, and how shade matching is handled across lots.",
            answer: null
        },
        {
            title: "Private label and OEM",
            asks: "Whether fabric can be supplied under a buyer's own brand, and any minimum attached to that.",
            answer: null
        },
        {
            title: "Export",
            asks: "Whether the mill exports directly, which markets, and the documentation it can provide.",
            answer: null
        }
    ];

    /* ---------- derive everything from the catalogue --------------------- */

    function stats() {
        var withGsm   = PRODUCTS.filter(function (p) { return p.d.gsm; });
        var withWidth = PRODUCTS.filter(function (p) { return p.d.width; });

        return {
            products:      PRODUCTS.length,
            categories:    CATEGORIES.length,
            gsmMin:        Math.min.apply(null, withGsm.map(function (p) { return p.d.gsm.min; })),
            gsmMax:        Math.max.apply(null, withGsm.map(function (p) { return p.d.gsm.max; })),
            gsmCount:      withGsm.length,
            widthMin:      Math.min.apply(null, withWidth.map(function (p) { return p.d.width.min; })),
            widthMax:      Math.max.apply(null, withWidth.map(function (p) { return p.d.width.max; })),
            widthCount:    withWidth.length,
            constructions: collectFacet("construction"),
            applications:  collectFacet("applications"),
            priceKg:       PRODUCTS.filter(function (p) { return p.priceUnit === "Kg"; }).length,
            priceMeter:    PRODUCTS.filter(function (p) { return p.priceUnit === "Meter"; }).length
        };
    }

    /* Products whose PUBLISHED specs say a value is made to order. The
       matched text is quoted verbatim as the evidence. */
    var CUSTOM_RE = /custom|on order|on demand|all colour|all colours|all gsm|customised/i;

    function madeToOrder() {
        var out = [];
        PRODUCTS.forEach(function (p) {
            var hits = [];
            for (var k in p.specs) {
                if (Object.prototype.hasOwnProperty.call(p.specs, k) &&
                    CUSTOM_RE.test(p.specs[k])) {
                    hits.push({ key: k, value: p.specs[k] });
                }
            }
            if (hits.length) { out.push({ product: p, hits: hits }); }
        });
        return out;
    }

    function sampleOrders() {
        var yes = [], no = [];
        PRODUCTS.forEach(function (p) {
            if (/^yes$/i.test(p.d.sampleOrders || "")) { yes.push(p); }
            else if (/^no$/i.test(p.d.sampleOrders || "")) { no.push(p); }
        });
        return { yes: yes, no: no, unstated: PRODUCTS.length - yes.length - no.length };
    }

    /* Distinct published values for a set of spec keys, with counts. */
    function distinct(keys) {
        var map = {};
        PRODUCTS.forEach(function (p) {
            keys.forEach(function (k) {
                var v = p.specs[k];
                if (v) { map[v] = (map[v] || 0) + 1; }
            });
        });
        return Object.keys(map).sort(function (a, b) { return map[b] - map[a]; })
                     .map(function (v) { return { value: v, count: map[v] }; });
    }

    function moqBands() {
        var map = {};
        PRODUCTS.forEach(function (p) { if (p.moq) { map[p.moq] = (map[p.moq] || 0) + 1; } });
        return Object.keys(map)
            .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
            .map(function (v) { return { value: v, count: map[v] }; });
    }

    /* ---------- render --------------------------------------------------- */

    function render() {
        var s = stats();
        var custom = madeToOrder();
        var samples = sampleOrders();
        var packing = distinct(["Packaging Type", "Pack Type"]);
        var moqs = moqBands();

        /* Headline range figures */
        qs("#cap-stats").innerHTML = [
            ["GSM " + s.gsmMin + "–" + s.gsmMax, "published across " + s.gsmCount + " fabrics"],
            [s.widthMin + "–" + s.widthMax + " in", "widths published across " + s.widthCount + " fabrics"],
            [s.constructions.length + " knits", "distinct constructions"],
            [s.applications.length + " end uses", "applications covered"]
        ].map(function (r) {
            return '<div class="stat"><div class="v">' + esc(r[0]) +
                   '</div><div class="k">' + esc(r[1]) + "</div></div>";
        }).join("");

        /* Constructions, each linking into the filtered catalogue */
        qs("#cap-knits").innerHTML = s.constructions.map(function (c) {
            var n = PRODUCTS.filter(function (p) {
                return p.d.construction.indexOf(c) !== -1;
            }).length;
            return '<a class="cap-chip" href="products.html?knit=' + encodeURIComponent(c) + '">' +
                   esc(c) + '<span>' + n + "</span></a>";
        }).join("");

        /* Applications, likewise */
        qs("#cap-apps").innerHTML = s.applications.map(function (a) {
            var n = PRODUCTS.filter(function (p) {
                return p.d.applications.indexOf(a) !== -1;
            }).length;
            return '<a class="cap-chip" href="products.html?app=' + encodeURIComponent(a) + '">' +
                   esc(a) + '<span>' + n + "</span></a>";
        }).join("");

        /* Made to order - the published wording is the evidence */
        qs("#cap-custom-intro").textContent =
            custom.length + " of our " + s.products + " fabrics carry a specification the mill " +
            "publishes as made to order. The exact published wording is shown against each.";

        qs("#cap-custom").innerHTML =
            '<div class="table-scroll"><table class="spec-table spec-table--bordered"><tbody>' +
            custom.map(function (c) {
                return "<tr><th><a href=\"product.html?id=" + encodeURIComponent(c.product.id) +
                       '">' + esc(c.product.name) + "</a></th><td>" +
                       c.hits.map(function (h) {
                           return "<strong>" + esc(h.key) + ":</strong> " + esc(h.value);
                       }).join("<br>") + "</td></tr>";
            }).join("") + "</tbody></table></div>";

        /* Samples - stated honestly, including how much is unstated */
        qs("#cap-samples").innerHTML =
            "<p>Sample availability is published on <strong>" +
            (samples.yes.length + samples.no.length) + " of " + s.products +
            "</strong> fabrics: <strong>" + samples.yes.length +
            "</strong> confirmed available, <strong>" + samples.no.length +
            "</strong> confirmed not. It is not stated for the remaining <strong>" +
            samples.unstated + "</strong> — ask when you enquire.</p>" +
            (samples.yes.length
                ? '<ul class="tag-row mt4">' + samples.yes.map(function (p) {
                      return '<li><a class="cap-chip" href="product.html?id=' +
                             encodeURIComponent(p.id) + '">' + esc(p.name) + "</a></li>";
                  }).join("") + "</ul>"
                : "");

        /* Ordering: MOQ and pricing basis */
        qs("#cap-ordering").innerHTML =
            '<div class="table-scroll"><table class="spec-table spec-table--bordered"><tbody>' +
            "<tr><th>Minimum order quantities</th><td>" +
                moqs.map(function (m) {
                    return esc(m.value) + " <span class=\"cap-n\">(" + m.count + " fabric" +
                           (m.count === 1 ? "" : "s") + ")</span>";
                }).join("<br>") + "</td></tr>" +
            "<tr><th>Priced by weight</th><td>" + s.priceKg + " fabrics, per Kg</td></tr>" +
            "<tr><th>Priced by length</th><td>" + s.priceMeter + " fabrics, per Meter</td></tr>" +
            "<tr><th>Packaging</th><td>" +
                packing.map(function (p) { return esc(p.value); }).join(", ") + "</td></tr>" +
            COMPANY.trade.map(function (t) {
                return "<tr><th>" + esc(t[0]) + "</th><td>" + esc(t[1]) + "</td></tr>";
            }).join("") +
            "</tbody></table></div>";

        renderPending();
    }

    /* Anything the mill has not published yet, shown as an explicit gap
       rather than silently left out. */
    function renderPending() {
        var unanswered = PENDING.filter(function (x) { return !x.answer; });

        if (!PENDING.length) {
            qs("#cap-pending-section").classList.add("hidden");
            return;
        }

        qs("#cap-pending-note").innerHTML = unanswered.length
            ? "<strong>" + unanswered.length + " of these " + PENDING.length +
              " are still to be confirmed with the mill.</strong> They are shown " +
              "rather than omitted so nothing here is guessed, and so it is clear " +
              "what remains to be collected."
            : "All confirmed with the mill.";
        qs("#cap-pending-note").className = unanswered.length ? "note" : "note note--ok";

        qs("#cap-pending").innerHTML = PENDING.map(function (x) {
            if (x.answer) {
                return '<div class="cap-block">' +
                           "<h3>" + esc(x.title) + "</h3>" +
                           "<p>" + esc(x.answer) + "</p>" +
                       "</div>";
            }
            return '<div class="cap-block cap-block--pending">' +
                       '<div class="cap-flag">Awaiting information</div>' +
                       "<h3>" + esc(x.title) + "</h3>" +
                       '<p class="cap-ask">' + esc(x.asks) + "</p>" +
                   "</div>";
        }).join("");
    }

    document.addEventListener("DOMContentLoaded", function () {
        UI.init("capabilities");
        render();
        if (window.MOTION) { window.MOTION.scan(document); }
    });
}());
