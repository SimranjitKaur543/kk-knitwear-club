/* ==========================================================================
   K.K. Knitwear Club - about & contact pages
   --------------------------------------------------------------------------
   Both pages print company details straight from COMPANY in products.js, so
   an address or GST change is a one-line edit in one file.
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs;

    function table(rows) {
        return '' +
        '<div class="table-scroll">' +
            '<table class="spec-table spec-table--bordered"><tbody>' +
            rows.map(function (r) {
                return "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>";
            }).join("") +
            "</tbody></table>" +
        "</div>";
    }

    function contactBlock() {
        return '' +
        '<div class="contact-list">' +
            '<div class="row"><div class="k">Contact person</div>' +
                '<div class="v">' + esc(COMPANY.owner) + " (" + esc(COMPANY.ownerTitle) + ")</div></div>" +
            '<div class="row"><div class="k">Phone</div>' +
                '<div class="v"><a href="tel:' + esc(COMPANY.phone) + '">' +
                esc(COMPANY.phone) + "</a></div></div>" +
            '<div class="row"><div class="k">Factory &amp; office</div>' +
                '<div class="v">' + COMPANY.addressLines.map(esc).join("<br>") + "</div></div>" +
            '<div class="row"><div class="k">GST number</div>' +
                '<div class="v num">' + esc(COMPANY.factsheet[7][1]) + "</div></div>" +
        "</div>";
    }

    function initAbout() {
        UI.init("about");

        qs("#about-crumbs").innerHTML = UI.crumbs([
            { label: "Home", href: "index.html" },
            { label: "About Us" }
        ]);

        qs("#about-text").innerHTML = COMPANY.about.map(function (p) {
            return "<p>" + esc(p) + "</p>";
        }).join("");

        qs("#about-factsheet").innerHTML = table(COMPANY.factsheet);
        qs("#about-trade").innerHTML = table(COMPANY.trade);

        /* What the range actually covers, generated from the catalogue */
        qs("#about-range").innerHTML = CATEGORIES.map(function (c) {
            var n = PRODUCTS.filter(function (p) {
                return p.categories.indexOf(c.key) !== -1;
            }).length;
            return '<li><a href="products.html?category=' + encodeURIComponent(c.key) + '">' +
                   esc(c.name) + "</a> <span style=\"color:var(--muted-2)\">&middot; " +
                   n + "</span></li>";
        }).join("");

        qs("#about-contact").innerHTML = contactBlock();
        renderReviews();
    }

    /* Buyer reviews, verbatim from the manufacturer's testimonial page.
       The overall figure is quoted from that page rather than averaged
       from the eight entries - see the note in products.js. */
    function renderReviews() {
        var T = window.TESTIMONIALS;
        if (!T || !T.reviews.length) { return; }

        qs("#reviews-intro").innerHTML =
            "Rated <strong>" + esc(T.overall) + " out of " + esc(T.outOf) +
            "</strong> from " + T.count + " buyer reviews, as published on our " +
            "listing. The most recent are shown below.";

        qs("#reviews-list").className = "reviews-grid mt5";
        qs("#reviews-list").innerHTML = T.reviews.map(function (r) {
            var stars = "";
            for (var i = 1; i <= 5; i++) {
                stars += '<span class="' + (i <= r.stars ? "on" : "off") +
                         '" aria-hidden="true">&#9733;</span>';
            }
            return '' +
            '<article class="review">' +
                '<div class="review-top">' +
                    '<span class="stars" role="img" aria-label="' + r.stars +
                        ' out of 5 stars">' + stars + "</span>" +
                    '<span class="review-date">' + esc(r.date) + "</span>" +
                "</div>" +
                (r.text ? '<p class="review-text">&ldquo;' + esc(r.text) + "&rdquo;</p>" : "") +
                '<p class="review-who">' +
                    "<strong>" + esc(r.name) + "</strong>" +
                    '<span class="review-meta">' + esc(r.place) +
                        " &middot; " + esc(r.product) + "</span>" +
                "</p>" +
            "</article>";
        }).join("");
    }

    function initContact() {
        UI.init("contact");

        qs("#contact-crumbs").innerHTML = UI.crumbs([
            { label: "Home", href: "index.html" },
            { label: "Contact Us" }
        ]);

        qs("#contact-details").innerHTML = contactBlock();

        /* The embed needs a network connection. The address and the direct
           Google Maps link below it always work, so the card is still useful
           if the iframe is blocked or offline. */
        qs("#contact-map").innerHTML =
            '<iframe title="Map to K.K. Knitwear Club, Ludhiana" loading="lazy" ' +
            'referrerpolicy="no-referrer-when-downgrade" ' +
            'src="https://maps.google.com/maps?q=' +
            encodeURIComponent(COMPANY.mapQuery) + '&output=embed"></iframe>';

        qs("#contact-address").innerHTML = COMPANY.addressLines.map(esc).join("<br>");
        qs("#contact-directions").href =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(COMPANY.mapQuery);
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (document.body.getAttribute("data-page") === "about")   { initAbout(); }
        if (document.body.getAttribute("data-page") === "contact") { initContact(); }

        /* The factsheet tables and contact blocks were injected after
           UI.init ran, so tag them for reveal now. */
        if (window.MOTION) { window.MOTION.scan(document); }
    });
}());
