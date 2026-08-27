/* ==========================================================================
   K.K. Knitwear Club - home page (index.html)
   --------------------------------------------------------------------------
   The home page is an entry point, not a brochure. Its job is to get a
   buyer into the catalogue quickly: what we make, which category they
   need, and a handful of representative fabrics.
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs;

    /* A spread across categories rather than a "bestsellers" list -
       this is a manufacturer, not a shop. */
    var FEATURED = [
        "sap-matty-fabric",
        "polo-matty-fabric",
        "rim-zim-doted-knitted-fabrics",
        "150-gsm-bon-patti",
        "honeycomb-knitted-fabrics",
        "lining-fabric-for-baby-blankets",
        "surplus-polyester-fabric",
        "nirmal-jali-fabric"
    ];

    var HERO_IMAGES = [
        "sap-matty-fabric-1.jpg",
        "rim-zim-doted-knitted-fabrics-1.jpg",
        "polo-matty-fabric-1.jpg"
    ];

    function priceRange() {
        var vals = PRODUCTS.map(function (p) { return p.priceValue; })
                           .filter(function (v) { return v !== null; });
        return Math.min.apply(null, vals);
    }

    function renderHero() {
        qs("#hero-collage").innerHTML = HERO_IMAGES.map(function (f, i) {
            return '<img src="' + IMAGE_PATH + esc(f) + '" alt="" ' +
                   (i ? 'loading="lazy" ' : "") + "decoding=\"async\">";
        }).join("");
    }

    function renderStats() {
        var stats = [
            [PRODUCTS.length + "+", "Fabric qualities in the range"],
            ["1990", "Manufacturing in Ludhiana since"],
            ["100 Kg", "Typical minimum order"],
            ["₹" + priceRange() + "+", "Per Kg, mill-direct"]
        ];
        qs("#home-stats").innerHTML = stats.map(function (s) {
            return '<div class="stat"><div class="v">' + esc(s[0]) +
                   '</div><div class="k">' + esc(s[1]) + "</div></div>";
        }).join("");
    }

    function renderCategories() {
        qs("#home-cats").innerHTML = CATEGORIES.map(function (c) {
            var n = PRODUCTS.filter(function (p) {
                return p.categories.indexOf(c.key) !== -1;
            }).length;
            return '' +
            '<a class="cat-tile" href="products.html?category=' + encodeURIComponent(c.key) + '">' +
                '<span class="n">' + esc(c.name) + "</span>" +
                '<span class="b">' + esc(c.blurb) + "</span>" +
                '<span class="c">' + n + " fabric" + (n === 1 ? "" : "s") +
                    ' <span class="arw" aria-hidden="true">&rarr;</span></span>' +
            "</a>";
        }).join("");
    }

    function renderFeatured() {
        var list = FEATURED.map(productById).filter(Boolean);
        qs("#home-featured").innerHTML = list.map(UI.card).join("");
        UI.syncStates();
    }

    document.addEventListener("DOMContentLoaded", function () {
        UI.init("home");
        renderHero();
        renderStats();
        renderCategories();
        renderFeatured();

        /* Everything above was injected after UI.init ran, so tag it now. */
        if (window.MOTION) { window.MOTION.scan(document); }
    });
}());
