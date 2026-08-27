/* ==========================================================================
   K.K. Knitwear Club - side-by-side comparison (compare.html)
   --------------------------------------------------------------------------
   Up to four fabrics, one column each.

   Rows are ordered so the decision-useful values come first (price, MOQ,
   GSM, width, composition), followed by every specification either fabric
   publishes. A row is skipped when none of the compared fabrics publish it.

   Rows where the values differ get a quiet highlight - that difference is
   the whole reason a buyer opened this page.
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs;

    /* Derived rows shown first. Each returns a display string or "". */
    var LEAD_ROWS = [
        ["Price", function (p) {
            return p.priceValue === null ? "On request"
                 : "₹" + p.priceValue + " / " + p.priceUnit;
        }],
        ["Minimum order",   function (p) { return p.moq || ""; }],
        ["Category",        function (p) { return UI.catNames(p).join(", "); }],
        ["GSM",             function (p) { return p.d.gsmLabel || ""; }],
        ["Width",           function (p) { return p.d.widthLabel || ""; }],
        ["Composition",     function (p) { return p.d.composition || ""; }],
        ["Construction",    function (p) { return p.d.construction.join(", "); }],
        ["Pattern",         function (p) { return p.d.pattern.join(", "); }],
        ["Finishing",       function (p) { return p.d.finish.join(", "); }],
        ["Best suited for", function (p) { return p.d.applications.join(", "); }],
        ["Sample orders",   function (p) { return p.d.sampleOrders || ""; }]
    ];

    /* Published spec keys already covered by the derived rows above. */
    var COVERED = {
        "Minimum Order Quantity": 1, "GSM": 1, "Fabric GSM": 1, "Products GSM": 1,
        "Width": 1, "Fabric Width": 1, "Width(In Inches)": 1,
        "Do You Fulfill Sample Orders": 1, "Do You Provide Sample Orders": 1
    };

    function specRowKeys(list) {
        var seen = {}, keys = [];
        list.forEach(function (p) {
            for (var k in p.specs) {
                if (Object.prototype.hasOwnProperty.call(p.specs, k) &&
                    !COVERED[k] && !seen[k]) {
                    seen[k] = true;
                    keys.push(k);
                }
            }
        });
        return keys;
    }

    function empty() {
        qs("#cmp-root").innerHTML = '' +
        '<div class="empty">' +
            "<h3>Nothing selected to compare yet</h3>" +
            "<p>Pick up to " + STORE.MAX_COMPARE + " fabrics using the " +
                "&#8646; button on any product card, then come back here to see " +
                "their specifications side by side.</p>" +
            '<a class="btn btn--primary" href="products.html">Browse fabrics</a>' +
        "</div>";
    }

    /* Re-rendered whenever a fabric is removed, so only the first pass is
       revealed. Later passes just fade in any new photographs. */
    var firstRender = true;

    function afterRender() {
        if (!window.MOTION) { return; }
        if (firstRender) {
            window.MOTION.scan(document);
            firstRender = false;
        } else {
            window.MOTION.images(qs("#cmp-root"));
        }
    }

    function render() {
        var list = STORE.compare.products();
        if (!list.length) { empty(); afterRender(); return; }

        /* Column headers */
        var heads = list.map(function (p) {
            return '<th class="cmp-col" scope="col">' +
                '<div class="cmp-prod">' +
                    '<a href="product.html?id=' + encodeURIComponent(p.id) + '">' +
                        '<img src="' + esc(p.d.image) + '" alt="' + esc(p.name) + '">' +
                    "</a>" +
                    '<a class="nm" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
                        esc(p.name) + "</a>" +
                    '<button class="rm" type="button" data-cmp-remove="' + esc(p.id) + '">' +
                        "Remove</button>" +
                "</div>" +
            "</th>";
        }).join("");

        /* Build every row, dropping the ones nobody publishes */
        function buildRow(label, get) {
            var vals = list.map(get);
            var any = vals.some(function (v) { return v !== ""; });
            if (!any) { return ""; }

            var differs = list.length > 1 && vals.some(function (v) { return v !== vals[0]; });

            var cells = vals.map(function (v) {
                return "<td" + (differs ? ' class="differs"' : "") + ">" +
                       (v === "" ? '<span class="dash">&mdash;</span>' : esc(v)) +
                       "</td>";
            }).join("");

            return '<tr><th class="rowhead" scope="row">' + esc(label) + "</th>" + cells + "</tr>";
        }

        var rows = LEAD_ROWS.map(function (r) { return buildRow(r[0], r[1]); }).join("");

        rows += specRowKeys(list).map(function (k) {
            return buildRow(k, function (p) { return p.specs[k] || ""; });
        }).join("");

        var legend = list.length > 1
            ? '<p class="cmp-legend"><i aria-hidden="true"></i> Highlighted rows are where ' +
              "these fabrics differ.</p>"
            : "";

        var unitWarning = "";
        var units = {};
        list.forEach(function (p) { if (p.priceUnit) { units[p.priceUnit] = 1; } });
        if (Object.keys(units).length > 1) {
            unitWarning = '<div class="note mb5"><strong>Different price units.</strong> ' +
                "Some of these fabrics are priced per Kg and others per Meter, so the " +
                "prices above are not directly comparable.</div>";
        }

        qs("#cmp-root").innerHTML = '' +
        '<div class="sl-bar">' +
            "<div><strong>" + list.length + " of " + STORE.MAX_COMPARE +
                "</strong> fabrics selected</div>" +
            "<div style=\"display:flex;gap:12px;flex-wrap:wrap\">" +
                '<a class="btn btn--outline btn--sm" href="products.html">Add more</a>' +
                '<button class="btn btn--outline btn--sm" type="button" data-cmp-clear>' +
                    "Clear all</button>" +
                '<button class="btn btn--primary btn--sm" type="button" ' +
                    'data-act="enquire-compare">Enquire About These</button>' +
            "</div>" +
        "</div>" +
        unitWarning +
        legend +
        '<div class="cmp-scroll">' +
            '<table class="cmp">' +
                "<thead><tr><th class=\"rowhead\"><span class=\"sr-only\">Specification" +
                    "</span></th>" + heads + "</tr></thead>" +
                "<tbody>" + rows + "</tbody>" +
            "</table>" +
        "</div>";

        afterRender();
    }

    document.addEventListener("DOMContentLoaded", function () {
        UI.init("products");
        render();

        document.addEventListener("click", function (e) {
            var rm = e.target.closest && e.target.closest("[data-cmp-remove]");
            if (rm) {
                STORE.compare.remove(rm.getAttribute("data-cmp-remove"));
                UI.toast("Removed from compare");
                return;
            }
            if (e.target.closest && e.target.closest("[data-cmp-clear]")) {
                STORE.compare.clear();
                UI.toast("Compare list cleared");
            }
        });

        STORE.onChange(render);
    });
}());
