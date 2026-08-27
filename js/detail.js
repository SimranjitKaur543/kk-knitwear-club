/* ==========================================================================
   K.K. Knitwear Club - product detail page (product.html?id=...)
   --------------------------------------------------------------------------
   There is ONE product page. The fabric is chosen by the address, e.g.
       product.html?id=sap-matty-fabric
   Adding a fabric to js/products.js gives it a page automatically.

   The "Full Specifications" table prints product.specs exactly as the
   manufacturer published it. The Quick Specifications strip above it shows
   the same information in a scannable form.
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs;

    function notFound() {
        qs("#pd-root").innerHTML = '' +
        '<div class="empty">' +
            "<h3>That fabric could not be found</h3>" +
            "<p>It may have been renamed or removed from the range.</p>" +
            '<a class="btn btn--primary" href="products.html">Browse all fabrics</a>' +
        "</div>";
    }

    /* ---------- gallery -------------------------------------------------- */

    function gallery(p) {
        var imgs = p.d.images;

        var thumbs = imgs.length < 2 ? "" :
            '<div class="gallery-thumbs">' + imgs.map(function (src, i) {
                return '<button type="button" data-img="' + esc(src) + '"' +
                       (i === 0 ? ' class="is-on"' : "") +
                       ' aria-label="View image ' + (i + 1) + '">' +
                       '<img src="' + esc(src) + '" alt=""></button>';
            }).join("") + "</div>";

        return '' +
        '<div class="gallery">' +
            '<div class="gallery-main">' +
                '<img id="pd-main-img" src="' + esc(imgs[0]) + '" alt="' + esc(p.name) + '">' +
            "</div>" +
            thumbs +
        "</div>";
    }

    /* ---------- quick specifications ------------------------------------- */

    function quickSpecs(p) {
        var rows = [];

        if (p.d.gsmLabel)   { rows.push(["GSM", p.d.gsmLabel.replace(/ GSM$/, "")]); }
        if (p.d.widthLabel) { rows.push(["Width", p.d.widthLabel]); }
        if (p.d.composition){ rows.push(["Composition", p.d.composition]); }
        if (p.d.construction.length) { rows.push(["Construction", p.d.construction.join(", ")]); }
        if (p.d.pattern.length)      { rows.push(["Pattern", p.d.pattern.join(", ")]); }
        if (p.d.finish.length)       { rows.push(["Finishing", p.d.finish.join(", ")]); }

        var colour = p.specs["Color"] || p.specs["Fabric Color"];
        if (colour && rows.length < 8) { rows.push(["Colour", colour]); }

        if (!rows.length) { return ""; }

        return '<div class="quickspecs">' + rows.map(function (r) {
            return "<div><span class=\"k\">" + esc(r[0]) + '</span><span class="v">' +
                   esc(r[1]) + "</span></div>";
        }).join("") + "</div>";
    }

    /* ---------- best suited for ------------------------------------------ */

    function suitedFor(p) {
        if (!p.d.applications.length) { return ""; }
        return '' +
        '<section class="suited">' +
            "<h2>Best Suited For</h2>" +
            "<ul>" + p.d.applications.map(function (a) {
                return "<li>" + esc(a) + "</li>";
            }).join("") + "</ul>" +
        "</section>";
    }

    /* ---------- the verbatim specification table ------------------------- */

    function fullSpecs(p) {
        var rows = [];
        for (var k in p.specs) {
            if (Object.prototype.hasOwnProperty.call(p.specs, k)) {
                rows.push("<tr><th>" + esc(k) + "</th><td>" + esc(p.specs[k]) + "</td></tr>");
            }
        }
        return '' +
        '<div class="table-scroll">' +
            '<table class="spec-table spec-table--bordered">' +
                "<caption class=\"sr-only\">Full published specifications for " + esc(p.name) + "</caption>" +
                "<tbody>" + rows.join("") + "</tbody>" +
            "</table>" +
        "</div>" +
        '<p class="tiny mt4" style="color:var(--muted-2)">Specifications as published by the ' +
            "manufacturer. Confirm exact values with the mill before placing a bulk order.</p>";
    }

    /* ---------- ordering block ------------------------------------------- */

    function ordering(p) {
        var rows = [];
        if (p.moq) { rows.push(["Minimum order quantity", p.moq]); }
        rows.push(["Price basis", p.priceValue === null
            ? "On request" : "₹" + p.priceValue + " per " + p.priceUnit]);
        if (p.d.sampleOrders) { rows.push(["Sample orders", p.d.sampleOrders]); }
        if (p.specs["Packaging Type"]) { rows.push(["Packaging", p.specs["Packaging Type"]]); }
        if (p.specs["Pack Type"]) { rows.push(["Packaging", p.specs["Pack Type"]]); }
        if (p.specs["Country of Origin"]) { rows.push(["Country of origin", p.specs["Country of Origin"]]); }

        COMPANY.trade.forEach(function (t) { rows.push([t[0], t[1]]); });

        return '' +
        '<div class="table-scroll">' +
            '<table class="spec-table spec-table--bordered"><tbody>' +
            rows.map(function (r) {
                return "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>";
            }).join("") +
            "</tbody></table>" +
        "</div>";
    }

    /* ---------- related -------------------------------------------------- */

    function related(p) {
        var out = [];
        PRODUCTS.forEach(function (o) {
            if (o.id === p.id || out.length >= 4) { return; }
            for (var i = 0; i < p.categories.length; i++) {
                if (o.categories.indexOf(p.categories[i]) !== -1) { out.push(o); return; }
            }
        });
        if (!out.length) { return ""; }

        return '' +
        '<section class="section section--tight">' +
            '<div class="wrap">' +
                '<div class="section-head"><div>' +
                    "<h2>Similar Fabrics</h2>" +
                    "<p>Other fabrics in the same category.</p>" +
                "</div></div>" +
                '<div class="grid-products">' + out.map(UI.card).join("") + "</div>" +
            "</div>" +
        "</section>";
    }

    /* ---------- page ----------------------------------------------------- */

    function render(p) {
        var cat = categoryByKey(p.categories[0]);

        document.title = p.name + " - K.K. Knitwear Club, Ludhiana";
        var meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute("content",
                p.name + " manufactured by K.K. Knitwear Club, Ludhiana. " +
                (p.d.gsmLabel ? p.d.gsmLabel + ". " : "") +
                (p.d.widthLabel ? "Width " + p.d.widthLabel + ". " : "") +
                p.d.priceLabel + ".");
        }

        qs("#pd-crumbs").innerHTML = UI.crumbs([
            { label: "Home", href: "index.html" },
            { label: "Products", href: "products.html" },
            { label: cat ? cat.name : "Fabric",
              href: "products.html?category=" + encodeURIComponent(p.categories[0]) },
            { label: p.name }
        ]);

        var catChips = UI.catNames(p).map(function (n, i) {
            return '<a class="chip chip--accent" href="products.html?category=' +
                   encodeURIComponent(p.categories[i]) + '">' + esc(n) + "</a>";
        }).join("");

        var priceBlock = p.priceValue === null
            ? '<div class="block"><span class="k">Price</span><span class="v">On request</span></div>'
            : '<div class="block"><span class="k">Price</span><span class="v">₹' +
              p.priceValue + " <small>per " + esc(p.priceUnit) + "</small></span></div>";

        var moqBlock = p.moq
            ? '<div class="block"><span class="k">Minimum order</span><span class="v">' +
              esc(p.moq) + "</span></div>"
            : "";

        var descAcc = p.description ? '' +
            '<details class="acc" open>' +
                "<summary>About This Fabric</summary>" +
                '<div class="acc-body"><p>' + esc(p.description) + "</p></div>" +
            "</details>" : "";

        qs("#pd-root").innerHTML = '' +
        '<div class="pd">' +
            gallery(p) +
            "<div>" +
                '<div class="pd-head">' +
                    '<p class="eyebrow">' + esc(p.source) + "</p>" +
                    "<h1>" + esc(p.name) + "</h1>" +
                    '<div class="pd-cats">' + catChips + "</div>" +
                "</div>" +

                '<div class="pd-price">' + priceBlock + moqBlock + "</div>" +

                '<div class="pd-actions">' +
                    '<button class="btn btn--primary" type="button" data-act="enquire" ' +
                        'data-id="' + esc(p.id) + '">Enquire About This Product</button>' +
                    '<button class="btn btn--outline" type="button" data-act="shortlist" ' +
                        'data-id="' + esc(p.id) + '" aria-pressed="false">Shortlist</button>' +
                    '<button class="btn btn--outline" type="button" data-act="compare" ' +
                        'data-id="' + esc(p.id) + '" aria-pressed="false">Compare</button>' +
                "</div>" +

                quickSpecs(p) +
                suitedFor(p) +

                descAcc +
                '<details class="acc" open>' +
                    "<summary>Full Specifications</summary>" +
                    '<div class="acc-body">' + fullSpecs(p) + "</div>" +
                "</details>" +
                '<details class="acc">' +
                    "<summary>Ordering &amp; Dispatch</summary>" +
                    '<div class="acc-body">' + ordering(p) + "</div>" +
                "</details>" +
                '<details class="acc">' +
                    "<summary>Manufacturer</summary>" +
                    '<div class="acc-body">' +
                        "<p><strong>K.K. Knitwear Club</strong><br>" +
                        COMPANY.addressLines.map(esc).join("<br>") + "</p>" +
                        '<p class="mt4">GST ' + esc(COMPANY.factsheet[7][1]) +
                        " &middot; Established " + esc(COMPANY.established) +
                        " &middot; Proprietor " + esc(COMPANY.owner) + "</p>" +
                        '<p class="mt4"><a href="tel:' + esc(COMPANY.phone) + '">' +
                        esc(COMPANY.phone) + "</a></p>" +
                    "</div>" +
                "</details>" +
            "</div>" +
        "</div>";

        qs("#pd-related").innerHTML = related(p);

        /* Gallery thumbnails */
        var main = qs("#pd-main-img");
        UI.qsa(".gallery-thumbs button").forEach(function (b) {
            b.addEventListener("click", function () {
                main.src = b.getAttribute("data-img");
                UI.qsa(".gallery-thumbs button").forEach(function (o) {
                    o.classList.remove("is-on");
                });
                b.classList.add("is-on");
            });
        });

        /* Update the two outline buttons to read as toggles */
        function labelToggles() {
            var sl = qs('.pd-actions [data-act="shortlist"]');
            var cp = qs('.pd-actions [data-act="compare"]');
            if (sl) { sl.textContent = STORE.shortlist.has(p.id) ? "Shortlisted ✓" : "Shortlist"; }
            if (cp) { cp.textContent = STORE.compare.has(p.id) ? "In Compare ✓" : "Compare"; }
        }
        STORE.onChange(labelToggles);
        labelToggles();

        UI.syncStates();
    }

    document.addEventListener("DOMContentLoaded", function () {
        UI.init("products");
        var p = productById(UI.param("id") || "");
        if (p) { render(p); } else { notFound(); }

        if (window.MOTION) { window.MOTION.scan(document); }
    });
}());
