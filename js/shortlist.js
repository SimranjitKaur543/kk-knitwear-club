/* ==========================================================================
   K.K. Knitwear Club - shortlist page (shortlist.html)
   --------------------------------------------------------------------------
   The saved fabrics, with one button that turns the whole list into a
   single enquiry. That is the point of the shortlist:
       Browse -> Shortlist -> Compare -> Enquire
   ========================================================================== */

(function () {

    var esc = UI.esc, qs = UI.qs;

    function empty() {
        qs("#sl-root").innerHTML = '' +
        '<div class="empty">' +
            "<h3>Your shortlist is empty</h3>" +
            "<p>Tap the &#9825; on any fabric to save it here. Your shortlist stays " +
                "in this browser, so you can come back to it later and send the whole " +
                "list as one enquiry.</p>" +
            '<a class="btn btn--primary" href="products.html">Browse fabrics</a>' +
        "</div>";
    }

    function row(p) {
        var bits = [];
        if (p.d.gsmLabel)   { bits.push(p.d.gsmLabel); }
        if (p.d.widthLabel) { bits.push(p.d.widthLabel + " wide"); }
        if (p.d.composition){ bits.push(p.d.composition); }

        var inCompare = STORE.compare.has(p.id);

        return '' +
        '<article class="sl-item" data-id="' + esc(p.id) + '">' +
            '<a href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' +
                '<img src="' + esc(p.d.image) + '" alt="" loading="lazy">' +
            "</a>" +
            "<div>" +
                '<p class="tiny" style="color:var(--muted-2)">' + esc(UI.catShort(p)) + "</p>" +
                '<h3 class="nm"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' +
                    esc(p.name) + "</a></h3>" +
                '<p class="small" style="color:var(--muted)">' + esc(bits.join(" · ")) + "</p>" +
                '<p class="small mt4"><strong>' + esc(p.d.priceLabel) + "</strong>" +
                    (p.moq ? '<span style="color:var(--muted-2)"> &middot; MOQ ' +
                             esc(p.moq) + "</span>" : "") + "</p>" +
            "</div>" +
            '<div class="sl-actions">' +
                '<button class="btn btn--primary btn--sm" type="button" data-act="enquire" ' +
                    'data-id="' + esc(p.id) + '">Enquire</button>' +
                '<button class="btn btn--outline btn--sm" type="button" data-act="compare" ' +
                    'data-id="' + esc(p.id) + '" aria-pressed="' + (inCompare ? "true" : "false") + '">' +
                    (inCompare ? "In Compare ✓" : "Compare") + "</button>" +
                '<button class="btn btn--outline btn--sm" type="button" data-sl-remove="' +
                    esc(p.id) + '">Remove</button>' +
            "</div>" +
        "</article>";
    }

    /* The list re-renders on every add or remove. Only the first render is
       revealed - replaying the animation each time an item is deleted would
       be distracting rather than smooth. */
    var firstRender = true;

    function afterRender() {
        if (!window.MOTION) { return; }
        if (firstRender) {
            window.MOTION.scan(document);
            firstRender = false;
        } else {
            window.MOTION.images(qs("#sl-root"));
        }
    }

    function render() {
        var list = STORE.shortlist.products();
        if (!list.length) { empty(); afterRender(); return; }

        var canCompare = Math.min(list.length, STORE.MAX_COMPARE);

        qs("#sl-root").innerHTML = '' +
        '<div class="sl-bar">' +
            "<div><strong>" + list.length + "</strong> fabric" +
                (list.length === 1 ? "" : "s") + " saved</div>" +
            "<div style=\"display:flex;gap:12px;flex-wrap:wrap\">" +
                '<button class="btn btn--outline btn--sm" type="button" data-sl-compare>' +
                    "Compare first " + canCompare + "</button>" +
                '<button class="btn btn--outline btn--sm" type="button" data-sl-clear>' +
                    "Clear shortlist</button>" +
                '<button class="btn btn--primary btn--sm" type="button" ' +
                    'data-act="enquire-shortlist">Enquire About All ' + list.length + "</button>" +
            "</div>" +
        "</div>" +
        '<div class="sl-list">' + list.map(row).join("") + "</div>";

        UI.syncStates();
        afterRender();
    }

    document.addEventListener("DOMContentLoaded", function () {
        UI.init("products");
        render();

        document.addEventListener("click", function (e) {
            var rm = e.target.closest && e.target.closest("[data-sl-remove]");
            if (rm) {
                STORE.shortlist.remove(rm.getAttribute("data-sl-remove"));
                UI.toast("Removed from shortlist");
                return;
            }
            if (e.target.closest && e.target.closest("[data-sl-clear]")) {
                STORE.shortlist.clear();
                UI.toast("Shortlist cleared");
                return;
            }
            if (e.target.closest && e.target.closest("[data-sl-compare]")) {
                var ids = STORE.shortlist.all().slice(0, STORE.MAX_COMPARE);
                STORE.compare.clear();
                ids.forEach(function (id) { STORE.compare.add(id); });
                window.location.href = "compare.html";
            }
        });

        STORE.onChange(render);
    });
}());
