/* ==========================================================================
   K.K. Knitwear Club - catalogue page (products.html)
   --------------------------------------------------------------------------
   Search, filters, sorting and the product grid.

   Within one filter group the options are OR'd together.
   Across groups they are AND'd. That is what buyers expect:
   "GSM 101-150 OR 151-200"  AND  "Application = Sportswear".

   Filter state is mirrored into the address bar so a filtered view can be
   bookmarked or sent to a colleague.
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs, qsa = UI.qsa;

    /* ---------- filter definitions --------------------------------------- */

    var FACETS = [
        {
            id: "category", label: "Category", open: true,
            get: function (p) { return p.categories; },
            /* Short names here: the full ones wrap to two lines in a 240px
               sidebar and strand the count on the first line. The full name
               still appears as the page heading when the category is the
               only filter selected. */
            options: CATEGORIES.map(function (c) {
                return { value: c.key, label: c.short || c.name };
            })
        },
        {
            id: "app", label: "Application", open: true,
            get: function (p) { return p.d.applications; }
        },
        {
            id: "gsm", label: "GSM", open: true,
            get: function (p) { return p.d.gsmBands; },
            order: GSM_BANDS.map(function (b) { return b.label; })
        },
        {
            id: "width", label: "Width",
            get: function (p) { return p.d.widthBands; },
            order: WIDTH_BANDS.map(function (b) { return b.label; })
        },
        {
            id: "knit", label: "Construction",
            get: function (p) { return p.d.construction; }
        },
        {
            id: "pattern", label: "Pattern",
            get: function (p) { return p.d.pattern; }
        },
        {
            id: "comp", label: "Composition",
            get: function (p) { return p.d.composition ? [p.d.composition] : []; }
        },
        {
            id: "finish", label: "Finishing",
            get: function (p) { return p.d.finish; }
        },
        {
            id: "unit", label: "Priced per",
            get: function (p) { return p.priceUnit ? [p.priceUnit] : []; }
        }
    ];

    /* Build the option list for any facet that did not declare one. */
    FACETS.forEach(function (f) {
        if (f.options) { return; }
        var seen = {}, vals = [];
        PRODUCTS.forEach(function (p) {
            (f.get(p) || []).forEach(function (v) {
                if (!seen[v]) { seen[v] = true; vals.push(v); }
            });
        });
        if (f.order) {
            vals.sort(function (a, b) { return f.order.indexOf(a) - f.order.indexOf(b); });
        } else {
            vals.sort();
        }
        f.options = vals.map(function (v) { return { value: v, label: v }; });
    });

    function facetById(id) {
        for (var i = 0; i < FACETS.length; i++) {
            if (FACETS[i].id === id) { return FACETS[i]; }
        }
        return null;
    }

    function labelFor(facet, value) {
        for (var i = 0; i < facet.options.length; i++) {
            if (facet.options[i].value === value) { return facet.options[i].label; }
        }
        return value;
    }

    /* ---------- state ---------------------------------------------------- */

    var SORTS = [
        { value: "default",   label: "Category" },
        { value: "name",      label: "Name (A - Z)" },
        { value: "gsm-asc",   label: "GSM (low to high)" },
        { value: "gsm-desc",  label: "GSM (high to low)" },
        { value: "price-asc", label: "Price (low to high)" },
        { value: "price-desc",label: "Price (high to low)" }
    ];

    var state = { q: "", sort: "default", sel: {} };

    function readUrl() {
        state.q = UI.param("q") || "";
        state.sort = UI.param("sort") || "default";
        FACETS.forEach(function (f) {
            var raw = UI.param(f.id);
            state.sel[f.id] = raw ? raw.split(",").filter(Boolean) : [];
        });
    }

    function writeUrl() {
        var parts = [];
        if (state.q) { parts.push("q=" + encodeURIComponent(state.q)); }
        FACETS.forEach(function (f) {
            var v = state.sel[f.id];
            if (v && v.length) { parts.push(f.id + "=" + encodeURIComponent(v.join(","))); }
        });
        if (state.sort !== "default") { parts.push("sort=" + state.sort); }

        var url = window.location.pathname + (parts.length ? "?" + parts.join("&") : "");
        try { window.history.replaceState(null, "", url); } catch (e) { /* file:// */ }
    }

    function activeCount() {
        var n = 0;
        FACETS.forEach(function (f) { n += (state.sel[f.id] || []).length; });
        return n;
    }

    /* ---------- matching ------------------------------------------------- */

    function matchesSearch(p) {
        if (!state.q) { return true; }
        var tokens = state.q.toLowerCase().split(/\s+/).filter(Boolean);
        for (var i = 0; i < tokens.length; i++) {
            if (p.d.search.indexOf(tokens[i]) === -1) { return false; }
        }
        return true;
    }

    /* skipId lets us count how many results an option would give while
       ignoring the group that option belongs to. */
    function matchesFilters(p, skipId) {
        for (var i = 0; i < FACETS.length; i++) {
            var f = FACETS[i];
            if (f.id === skipId) { continue; }
            var chosen = state.sel[f.id] || [];
            if (!chosen.length) { continue; }

            var have = f.get(p) || [];
            var hit = false;
            for (var j = 0; j < chosen.length; j++) {
                if (have.indexOf(chosen[j]) !== -1) { hit = true; break; }
            }
            if (!hit) { return false; }
        }
        return true;
    }

    function results() {
        return PRODUCTS.filter(function (p) {
            return matchesSearch(p) && matchesFilters(p, null);
        });
    }

    /* How many products each option would return, given the other groups. */
    function optionCounts(facet) {
        var pool = PRODUCTS.filter(function (p) {
            return matchesSearch(p) && matchesFilters(p, facet.id);
        });
        var counts = {};
        pool.forEach(function (p) {
            (facet.get(p) || []).forEach(function (v) {
                counts[v] = (counts[v] || 0) + 1;
            });
        });
        return counts;
    }

    /* ---------- sorting -------------------------------------------------- */

    function gsmKey(p) { return p.d.gsm ? (p.d.gsm.min + p.d.gsm.max) / 2 : null; }

    function sortList(list) {
        var s = state.sort;

        function byName(a, b) { return a.name.localeCompare(b.name); }

        /* Products with no published value always sort last, never first. */
        function numeric(get, dir) {
            return function (a, b) {
                var x = get(a), y = get(b);
                if (x === null && y === null) { return byName(a, b); }
                if (x === null) { return 1; }
                if (y === null) { return -1; }
                return x === y ? byName(a, b) : (dir === "asc" ? x - y : y - x);
            };
        }

        if (s === "name")       { return list.sort(byName); }
        if (s === "gsm-asc")    { return list.sort(numeric(gsmKey, "asc")); }
        if (s === "gsm-desc")   { return list.sort(numeric(gsmKey, "desc")); }
        if (s === "price-asc")  { return list.sort(numeric(function (p) { return p.priceValue; }, "asc")); }
        if (s === "price-desc") { return list.sort(numeric(function (p) { return p.priceValue; }, "desc")); }

        /* Default: grouped by the category order in products.js, then name. */
        return list.sort(function (a, b) {
            var ai = CATEGORIES.length, bi = CATEGORIES.length;
            CATEGORIES.forEach(function (c, i) {
                if (a.categories.indexOf(c.key) !== -1 && i < ai) { ai = i; }
                if (b.categories.indexOf(c.key) !== -1 && i < bi) { bi = i; }
            });
            return ai === bi ? byName(a, b) : ai - bi;
        });
    }

    /* ---------- rendering ------------------------------------------------ */

    function renderFilters() {
        var host = qs("#filters-body");

        host.innerHTML = FACETS.map(function (f) {
            var counts = optionCounts(f);
            var chosen = state.sel[f.id] || [];

            var opts = f.options.map(function (o) {
                var n = counts[o.value] || 0;
                var on = chosen.indexOf(o.value) !== -1;
                if (!n && !on) { return ""; }          /* hide options that lead nowhere */
                return '' +
                '<label class="fopt' + (n ? "" : " is-empty") + '">' +
                    '<input type="checkbox" data-facet="' + esc(f.id) + '" ' +
                        'value="' + esc(o.value) + '"' + (on ? " checked" : "") + ">" +
                    "<span>" + esc(o.label) + "</span>" +
                    '<span class="n">' + n + "</span>" +
                "</label>";
            }).join("");

            if (!opts) { return ""; }

            var open = f.open || chosen.length ? " open" : "";
            var badge = chosen.length ? " (" + chosen.length + ")" : "";

            return '' +
            "<details class=\"fgroup\"" + open + ">" +
                "<summary>" + esc(f.label) + badge + "</summary>" +
                '<div class="fopts">' + opts + "</div>" +
            "</details>";
        }).join("");
    }

    function renderPills() {
        var host = qs("#active-filters");
        var bits = [];

        FACETS.forEach(function (f) {
            (state.sel[f.id] || []).forEach(function (v) {
                bits.push('<span class="pill">' + esc(labelFor(f, v)) +
                    '<button type="button" data-drop-facet="' + esc(f.id) + '" ' +
                    'data-drop-value="' + esc(v) + '" aria-label="Remove filter ' +
                    esc(labelFor(f, v)) + '">&times;</button></span>');
            });
        });

        if (state.q) {
            bits.push('<span class="pill">Search: &ldquo;' + esc(state.q) + '&rdquo;' +
                '<button type="button" data-drop-search aria-label="Clear search">&times;</button></span>');
        }

        if (bits.length > 1) {
            bits.push('<button class="btn btn--quiet btn--sm" type="button" data-clear-all>Clear all</button>');
        }

        host.innerHTML = bits.join("");
        host.classList.toggle("hidden", !bits.length);
    }

    function renderGrid() {
        var list = sortList(results());
        var grid = qs("#product-grid");
        var count = qs("#result-count");

        count.innerHTML = list.length === PRODUCTS.length
            ? "Showing all <strong>" + list.length + "</strong> fabrics"
            : "<strong>" + list.length + "</strong> of " + PRODUCTS.length + " fabrics";

        if (!list.length) {
            grid.className = "";
            grid.innerHTML = '' +
            '<div class="empty">' +
                "<h3>No fabrics match those filters</h3>" +
                "<p>Try removing a filter, widening the GSM range, or searching for a " +
                    "fabric name such as <em>bon patti</em>, <em>rim zim</em> or <em>matty</em>.</p>" +
                '<button class="btn btn--outline" type="button" data-clear-all>Clear all filters</button>' +
            "</div>";
            return;
        }

        grid.className = "grid-products";
        grid.innerHTML = list.map(UI.card).join("");
        UI.syncStates();

        /* Photographs fade in as they decode, but the cards themselves are
           never scroll-revealed here: this grid re-renders on every keystroke
           and every filter change, and animating it would flicker. A working
           tool should feel instant. */
        if (window.MOTION) { window.MOTION.images(grid); }
    }

    /* When exactly one category is selected the page behaves like a proper
       category page: its own heading, blurb and breadcrumb. */
    function renderHead() {
        var chosen = state.sel.category || [];
        var cat = chosen.length === 1 ? categoryByKey(chosen[0]) : null;

        var title = qs("#cat-title");
        var desc  = qs("#cat-desc");

        if (cat) {
            title.textContent = cat.name;
            desc.textContent = cat.blurb;
            document.title = cat.name + " - K.K. Knitwear Club, Ludhiana";
        } else {
            title.textContent = "Our Fabrics";
            desc.textContent = "Every quality we manufacture, with the GSM, width, " +
                "composition, price and minimum order as published by the mill.";
            document.title = "Fabric Catalogue - K.K. Knitwear Club, Ludhiana";
        }

        var trail = [
            { label: "Home", href: "index.html" },
            { label: "Products", href: cat ? "products.html" : null }
        ];
        if (cat) { trail.push({ label: cat.name }); }
        qs("#cat-crumbs").innerHTML = UI.crumbs(trail);
    }

    function renderAll() {
        renderHead();
        renderFilters();
        renderPills();
        renderGrid();
        writeUrl();

        var n = activeCount();
        var badge = qs("#filter-count");
        if (badge) {
            badge.textContent = n ? "(" + n + ")" : "";
        }
    }

    /* ---------- wiring --------------------------------------------------- */

    function init() {
        readUrl();

        /* Sort dropdown */
        var sortSel = qs("#sort-select");
        sortSel.innerHTML = SORTS.map(function (s) {
            return '<option value="' + s.value + '"' +
                   (s.value === state.sort ? " selected" : "") + ">" + esc(s.label) + "</option>";
        }).join("");
        sortSel.addEventListener("change", function () {
            state.sort = sortSel.value;
            renderGrid();
            writeUrl();
        });

        /* Search box, debounced so typing stays smooth */
        var input = qs("#search-input");
        var wrap = qs("#searchbar");
        input.value = state.q;
        wrap.classList.toggle("has-value", !!state.q);

        var timer = null;
        input.addEventListener("input", function () {
            wrap.classList.toggle("has-value", !!input.value);
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                state.q = input.value.trim();
                renderAll();
            }, 180);
        });
        qs("#search-clear").addEventListener("click", function () {
            input.value = "";
            state.q = "";
            wrap.classList.remove("has-value");
            renderAll();
            input.focus();
        });

        /* Filter checkboxes */
        qs("#filters-body").addEventListener("change", function (e) {
            var box = e.target;
            if (!box.matches || !box.matches("[data-facet]")) { return; }

            var id = box.getAttribute("data-facet");
            var v = box.value;
            var chosen = state.sel[id] || (state.sel[id] = []);
            var at = chosen.indexOf(v);

            if (box.checked && at === -1) { chosen.push(v); }
            if (!box.checked && at !== -1) { chosen.splice(at, 1); }

            renderAll();
        });

        /* Removing filters from the pills row and the empty state */
        document.addEventListener("click", function (e) {
            var drop = e.target.closest && e.target.closest("[data-drop-facet]");
            if (drop) {
                var id = drop.getAttribute("data-drop-facet");
                var v = drop.getAttribute("data-drop-value");
                state.sel[id] = (state.sel[id] || []).filter(function (x) { return x !== v; });
                renderAll();
                return;
            }
            if (e.target.closest && e.target.closest("[data-drop-search]")) {
                state.q = "";
                qs("#search-input").value = "";
                qs("#searchbar").classList.remove("has-value");
                renderAll();
                return;
            }
            if (e.target.closest && e.target.closest("[data-clear-all]")) {
                state.q = "";
                state.sel = {};
                FACETS.forEach(function (f) { state.sel[f.id] = []; });
                qs("#search-input").value = "";
                qs("#searchbar").classList.remove("has-value");
                renderAll();
            }
        });

        /* Mobile filter drawer */
        var panel = qs("#filters");
        qs("#filters-open").addEventListener("click", function () {
            panel.classList.add("is-open");
            document.body.style.overflow = "hidden";
        });
        qsa("[data-filters-close]").forEach(function (b) {
            b.addEventListener("click", function () {
                panel.classList.remove("is-open");
                document.body.style.overflow = "";
            });
        });

        renderAll();
    }

    document.addEventListener("DOMContentLoaded", function () {
        UI.init("products");
        init();
    });
}());
