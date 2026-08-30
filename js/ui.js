/* ==========================================================================
   K.K. Knitwear Club - shared UI
   --------------------------------------------------------------------------
   Header, footer, breadcrumbs, product cards, the compare tray, toasts and
   the enquiry form. Every page loads this file and calls UI.init().

   The enquiry form is front-end only: it validates the input, composes the
   message, and then hands it to WhatsApp or the buyer's email client.
   Nothing is stored or posted to a server.
   ========================================================================== */

var UI = (function () {

    /* ---------- helpers -------------------------------------------------- */

    function esc(v) {
        return String(v === null || v === undefined ? "" : v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function el(html) {
        var d = document.createElement("div");
        d.innerHTML = html.trim();
        return d.firstChild;
    }

    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }

    function param(name) {
        var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
        return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
    }

    /* Category names for a product, e.g. "Sportswear & Activewear Fabrics" */
    function catNames(p) {
        var out = [];
        for (var i = 0; i < p.categories.length; i++) {
            var c = categoryByKey(p.categories[i]);
            if (c) { out.push(c.name); }
        }
        return out;
    }

    /* A short category label that fits on one line of a card */
    function catShort(p) {
        var c = categoryByKey(p.categories[0]);
        if (c) { return c.short || c.name.replace(/ Fabrics?$/, ""); }
        return "Fabric";
    }

    /* ---------- header --------------------------------------------------- */

    var NAV = [
        { key: "home",         label: "Home",         href: "index.html" },
        { key: "products",     label: "Products",     href: "products.html" },
        { key: "capabilities", label: "Capabilities", href: "capabilities.html" },
        { key: "about",        label: "About Us",     href: "about.html" },
        { key: "contact",      label: "Contact",      href: "contact.html" }
    ];

    function headerHtml(active) {
        var links = NAV.map(function (n) {
            var cur = n.key === active ? ' aria-current="page"' : "";
            return '<li><a href="' + n.href + '"' + cur + '>' + esc(n.label) + "</a></li>";
        }).join("");

        return '' +
        '<div class="header-inner">' +
            '<a class="brand" href="index.html">' +
                '<span class="brand-mark" aria-hidden="true">KK</span>' +
                '<span class="brand-text">' +
                    '<span class="brand-name">K.K. Knitwear Club</span>' +
                    '<span class="brand-sub">Ludhiana &middot; Since 1990</span>' +
                '</span>' +
            '</a>' +
            '<nav class="nav" id="site-nav" aria-label="Main"><ul>' + links + '</ul></nav>' +
            '<div class="header-tools">' +
                '<a class="tool-pill" href="shortlist.html" data-pill="shortlist">' +
                    '<span aria-hidden="true">&#9825;</span><span>Shortlist</span>' +
                    '<span class="count" data-count="shortlist">0</span>' +
                '</a>' +
                '<a class="tool-pill" href="compare.html" data-pill="compare">' +
                    '<span aria-hidden="true">&#8646;</span><span>Compare</span>' +
                    '<span class="count" data-count="compare">0</span>' +
                '</a>' +
            '</div>' +
            '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
                '<span></span><span class="sr-only">Menu</span>' +
            '</button>' +
        '</div>';
    }

    /* ---------- footer --------------------------------------------------- */

    function footerHtml() {
        var cats = CATEGORIES.slice(0, 5).map(function (c) {
            return '<li><a href="products.html?category=' + encodeURIComponent(c.key) + '">' +
                   esc(c.name) + "</a></li>";
        }).join("");

        return '' +
        '<div class="wrap">' +
            '<div class="footer-grid">' +
                '<div class="footer-about">' +
                    '<h4>K.K. Knitwear Club</h4>' +
                    '<p>' + esc(COMPANY.about[0]) + "</p>" +
                    '<p class="tiny mt4">GST ' + esc(COMPANY.factsheet[7][1]) + "</p>" +
                '</div>' +
                '<div>' +
                    "<h4>Fabric Range</h4>" +
                    "<ul>" + cats +
                        '<li><a href="products.html">All products</a></li>' +
                    "</ul>" +
                '</div>' +
                '<div>' +
                    "<h4>Company</h4>" +
                    "<ul>" +
                        '<li><a href="about.html">About us</a></li>' +
                        '<li><a href="capabilities.html">Capabilities</a></li>' +
                        '<li><a href="products.html">Our products</a></li>' +
                        '<li><a href="shortlist.html">My shortlist</a></li>' +
                        '<li><a href="compare.html">Compare fabrics</a></li>' +
                        '<li><a href="contact.html">Contact us</a></li>' +
                    "</ul>" +
                '</div>' +
                '<div>' +
                    "<h4>Reach Us</h4>" +
                    "<ul>" +
                        "<li>" + COMPANY.addressLines.map(esc).join("<br>") + "</li>" +
                        '<li><a href="tel:' + esc(COMPANY.phone) + '">' + esc(COMPANY.phone) + "</a></li>" +
                    "</ul>" +
                '</div>' +
            '</div>' +
            '<div class="footer-bottom">' +
                "<span>&copy; " + new Date().getFullYear() + " K.K. Knitwear Club, Ludhiana. " +
                    "Proprietor: " + esc(COMPANY.owner) + ".</span>" +
                "<span>Demo website &middot; enquiries are not stored or delivered</span>" +
            '</div>' +
        '</div>';
    }

    /* ---------- product card --------------------------------------------- */

    /* Up to three specs a buyer scans first. */
    function cardSpecs(p) {
        var out = [];
        if (p.d.gsmLabel)   { out.push({ k: "GSM", v: p.d.gsmLabel.replace(/ GSM$/, "") }); }
        if (p.d.widthLabel) { out.push({ k: "Width", v: p.d.widthLabel }); }
        if (out.length < 3 && p.d.construction.length) {
            out.push({ k: "Knit", v: p.d.construction[0] });
        }
        if (out.length < 3 && p.d.composition) {
            out.push({ k: "Fabric", v: p.d.composition });
        }
        return out.slice(0, 3);
    }

    /* Nothing is drawn on top of the photograph - no badge, no gradient.
       The category sits above the name instead, where it reads better and
       leaves the fabric itself uncovered. */
    function card(p) {
        var href = "product.html?id=" + encodeURIComponent(p.id);

        var specs = cardSpecs(p).map(function (s) {
            return "<li><span class=\"k\">" + esc(s.k) + '</span><span class="v">' +
                   esc(s.v) + "</span></li>";
        }).join("");

        var price = p.priceValue === null
            ? '<div><span class="amount">On request</span></div>'
            : '<div><span class="amount">&#8377;' + p.priceValue + '</span>' +
              '<span class="unit"> / ' + esc(p.priceUnit) + "</span></div>";

        var moq = p.moq ? '<div class="moq">MOQ<br>' + esc(p.moq) + "</div>" : "";

        return '' +
        '<article class="card" data-id="' + esc(p.id) + '">' +
            '<a class="card-media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
                '<img src="' + esc(p.d.image) + '" alt="' + esc(p.name) + '" ' +
                    'loading="lazy" decoding="async">' +
            "</a>" +
            '<div class="card-body">' +
                '<div class="card-top">' +
                    '<p class="card-cat">' + esc(catShort(p)) + "</p>" +
                    (/^yes$/i.test(p.d.sampleOrders || "")
                        ? '<span class="card-badge" title="This listing states sample orders are fulfilled">Sample</span>'
                        : "") +
                "</div>" +
                '<h3 class="card-name"><a href="' + href + '">' + esc(p.name) + "</a></h3>" +
                '<div class="card-foot">' +
                    (specs ? '<ul class="card-specs">' + specs + "</ul>" : "") +
                    '<div class="card-price">' + price + moq + "</div>" +
                    '<div class="card-actions">' +
                        '<a class="btn btn--outline btn--sm" href="' + href + '">View Details</a>' +
                        '<button class="icon-btn" type="button" data-act="shortlist" ' +
                            'data-id="' + esc(p.id) + '" aria-pressed="false" ' +
                            'title="Save to shortlist">&#9825;</button>' +
                        '<button class="icon-btn" type="button" data-act="compare" ' +
                            'data-id="' + esc(p.id) + '" aria-pressed="false" ' +
                            'title="Add to compare">&#8646;</button>' +
                    "</div>" +
                "</div>" +
            "</div>" +
        "</article>";
    }

    /* ---------- breadcrumbs ---------------------------------------------- */

    function crumbs(items) {
        var html = items.map(function (it, i) {
            var last = i === items.length - 1;
            var node = last || !it.href
                ? '<span' + (last ? ' aria-current="page"' : "") + ">" + esc(it.label) + "</span>"
                : '<a href="' + esc(it.href) + '">' + esc(it.label) + "</a>";
            return (i ? '<span class="sep" aria-hidden="true">/</span>' : "") + node;
        }).join("");
        return '<nav class="crumbs" aria-label="Breadcrumb">' + html + "</nav>";
    }

    /* ---------- toast ---------------------------------------------------- */

    function toast(msg) {
        var host = qs(".toast-host");
        if (!host) {
            host = el('<div class="toast-host" aria-live="polite"></div>');
            document.body.appendChild(host);
        }
        var t = el('<div class="toast">' + esc(msg) + "</div>");
        host.appendChild(t);
        window.setTimeout(function () {
            if (t.parentNode) { t.parentNode.removeChild(t); }
        }, 2600);
    }

    /* ---------- shortlist / compare buttons ------------------------------ */

    /* Reflects current storage state onto every toggle button on the page. */
    function syncStates() {
        qsa("[data-count]").forEach(function (n) {
            var which = n.getAttribute("data-count");
            var c = STORE[which].count();
            n.textContent = c;
            var pill = n.closest ? n.closest("[data-pill]") : null;
            if (pill) { pill.classList.toggle("is-active", c > 0); }
        });

        qsa('[data-act="shortlist"], [data-act="compare"]').forEach(function (b) {
            var which = b.getAttribute("data-act");
            var on = STORE[which].has(b.getAttribute("data-id"));
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
            /* Only the small icon toggles on cards swap their glyph. Buttons
               that carry a text label (the product page) keep their label,
               which detail.js maintains. */
            if (which === "shortlist") {
                if (b.classList.contains("icon-btn")) {
                    b.innerHTML = on ? "&#9829;" : "&#9825;";
                }
                b.title = on ? "Remove from shortlist" : "Save to shortlist";
            } else {
                b.title = on ? "Remove from compare" : "Add to compare";
            }
        });

        renderTray();
    }

    /* One delegated click handler for the whole page. */
    function bindActions() {
        document.addEventListener("click", function (e) {
            var btn = e.target.closest && e.target.closest("[data-act]");
            if (!btn) { return; }

            var act = btn.getAttribute("data-act");
            var id  = btn.getAttribute("data-id");

            if (act === "shortlist") {
                e.preventDefault();
                var r = STORE.shortlist.toggle(id);
                toast(r === "added" ? "Saved to shortlist" : "Removed from shortlist");

            } else if (act === "compare") {
                e.preventDefault();
                if (!STORE.compare.has(id) && STORE.compare.isFull()) {
                    toast("Compare holds up to " + STORE.MAX_COMPARE + " fabrics");
                    return;
                }
                var c = STORE.compare.toggle(id);
                toast(c === "added" ? "Added to compare" : "Removed from compare");

            } else if (act === "enquire") {
                e.preventDefault();
                var p = productById(id);
                if (p) { openEnquiry([p]); }

            } else if (act === "enquire-shortlist") {
                e.preventDefault();
                var list = STORE.shortlist.products();
                if (!list.length) { toast("Your shortlist is empty"); return; }
                openEnquiry(list);

            } else if (act === "enquire-compare") {
                e.preventDefault();
                var cl = STORE.compare.products();
                if (!cl.length) { toast("Nothing selected to compare"); return; }
                openEnquiry(cl);

            } else if (act === "enquire-general") {
                e.preventDefault();
                openEnquiry([]);
            }
        });
    }

    /* ---------- compare tray -------------------------------------------- */

    function renderTray() {
        var tray = qs("#compare-tray");
        if (!tray) { return; }

        var list = STORE.compare.products();
        if (!list.length) {
            tray.classList.remove("is-open");
            tray.innerHTML = "";
            return;
        }

        var items = list.map(function (p) {
            return '<span class="tray-item">' + esc(p.name) +
                   '<button type="button" data-tray-remove="' + esc(p.id) + '"' +
                   ' aria-label="Remove ' + esc(p.name) + '">&times;</button></span>';
        }).join("");

        tray.innerHTML =
            '<div class="compare-tray-inner">' +
                '<span class="tray-label">Comparing ' + list.length + " of " +
                    STORE.MAX_COMPARE + "</span>" +
                '<span class="tray-items">' + items + "</span>" +
                '<button class="btn btn--quiet btn--sm" type="button" data-tray-clear>Clear</button>' +
                '<a class="btn btn--primary btn--sm" href="compare.html">Compare now</a>' +
            "</div>";
        tray.classList.add("is-open");
    }

    function bindTray() {
        document.addEventListener("click", function (e) {
            var rm = e.target.closest && e.target.closest("[data-tray-remove]");
            if (rm) {
                STORE.compare.remove(rm.getAttribute("data-tray-remove"));
                return;
            }
            if (e.target.closest && e.target.closest("[data-tray-clear]")) {
                STORE.compare.clear();
                toast("Compare list cleared");
            }
        });
    }

    /* ---------- enquiry form -------------------------------------------- */

    var UNITS = ["Kg", "Meters", "Rolls", "Pieces"];

    function subjectHtml(products) {
        if (!products.length) { return ""; }

        if (products.length === 1) {
            var p = products[0];
            var bits = [];
            if (p.d.gsmLabel)   { bits.push(p.d.gsmLabel); }
            if (p.d.widthLabel) { bits.push(p.d.widthLabel + " wide"); }
            bits.push(p.d.priceLabel);
            return '' +
            '<div class="enq-subject">' +
                '<img src="' + esc(p.d.image) + '" alt="">' +
                "<div>" +
                    '<span class="k">Enquiring about</span>' +
                    '<span class="v">' + esc(p.name) + "</span>" +
                    '<span class="meta">' + esc(bits.join(" · ")) + "</span>" +
                "</div>" +
            "</div>";
        }

        var rows = products.map(function (p) {
            return "<li>" + esc(p.name) + "<span>" + esc(p.d.priceLabel) + "</span></li>";
        }).join("");

        return '' +
        '<div class="enq-subject-list">' +
            '<span class="k">Enquiring about ' + products.length + " fabrics</span>" +
            "<ol>" + rows + "</ol>" +
        "</div>";
    }

    function formHtml(products) {
        var apps = collectFacet("applications").sort();
        var appOpts = apps.map(function (a) {
            return '<option value="' + esc(a) + '">' + esc(a) + "</option>";
        }).join("");

        var unitOpts = UNITS.map(function (u) {
            return '<option value="' + esc(u) + '">' + esc(u) + "</option>";
        }).join("");

        return '' +
        '<form id="enq-form" novalidate>' +
            subjectHtml(products) +

            '<div class="field-row">' +
                '<div class="field" data-for="name">' +
                    '<label for="enq-name">Your name <span class="req">*</span></label>' +
                    '<input class="input" id="enq-name" name="name" type="text" autocomplete="name">' +
                    '<span class="field-error">Please enter your name.</span>' +
                "</div>" +
                '<div class="field" data-for="company">' +
                    '<label for="enq-company">Company</label>' +
                    '<input class="input" id="enq-company" name="company" type="text" autocomplete="organization">' +
                "</div>" +
            "</div>" +

            '<div class="field-row">' +
                '<div class="field" data-for="phone">' +
                    '<label for="enq-phone">Phone <span class="req">*</span></label>' +
                    '<input class="input" id="enq-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel">' +
                    '<span class="field-error">Please enter a phone number we can reach you on.</span>' +
                "</div>" +
                '<div class="field" data-for="email">' +
                    '<label for="enq-email">Email</label>' +
                    '<input class="input" id="enq-email" name="email" type="email" autocomplete="email">' +
                    '<span class="field-error">That email address does not look right.</span>' +
                "</div>" +
            "</div>" +

            '<div class="field" data-for="qty">' +
                '<label for="enq-qty">Quantity required</label>' +
                '<div class="qty-row">' +
                    '<input class="input" id="enq-qty" name="qty" type="text" inputmode="numeric" placeholder="e.g. 500">' +
                    '<select class="select" name="unit" aria-label="Unit">' + unitOpts + "</select>" +
                "</div>" +
                '<span class="hint">Minimum order quantities are shown on each product page.</span>' +
            "</div>" +

            '<div class="field-row">' +
                '<div class="field" data-for="application">' +
                    '<label for="enq-app">Application</label>' +
                    '<select class="select" id="enq-app" name="application">' +
                        '<option value="">Select an application</option>' + appOpts +
                        '<option value="Other">Other</option>' +
                    "</select>" +
                "</div>" +
                '<div class="field" data-for="variant">' +
                    '<label for="enq-variant">Colour / variant</label>' +
                    '<input class="input" id="enq-variant" name="variant" type="text" placeholder="e.g. Black base, white dots">' +
                "</div>" +
            "</div>" +

            '<div class="field" data-for="message">' +
                '<label for="enq-msg">Message</label>' +
                '<textarea class="textarea" id="enq-msg" name="message" ' +
                    'placeholder="Tell us the specifications, usage and delivery timeline you need."></textarea>' +
                '<span class="hint">' + esc(COMPANY.enquiryHint) + "</span>" +
            "</div>" +

            '<button class="btn btn--primary btn--block" type="submit">Prepare Enquiry</button>' +
        "</form>";
    }

    /* Builds the plain-text enquiry message. */
    function composeMessage(data, products) {
        var L = [];
        L.push("ENQUIRY - K.K. Knitwear Club");
        L.push("");

        if (products.length === 1) {
            var p = products[0];
            L.push("Product: " + p.name);
            L.push("Price: " + p.d.priceLabel + (p.moq ? "   MOQ: " + p.moq : ""));
            if (p.d.gsmLabel)   { L.push("GSM: " + p.d.gsmLabel); }
            if (p.d.widthLabel) { L.push("Width: " + p.d.widthLabel); }
        } else if (products.length > 1) {
            L.push("Products (" + products.length + "):");
            products.forEach(function (p, i) {
                L.push("  " + (i + 1) + ". " + p.name + " - " + p.d.priceLabel +
                       (p.moq ? " (MOQ " + p.moq + ")" : ""));
            });
        } else {
            L.push("General enquiry");
        }

        L.push("");
        L.push("Name: " + data.name);
        if (data.company) { L.push("Company: " + data.company); }
        L.push("Phone: " + data.phone);
        if (data.email) { L.push("Email: " + data.email); }

        if (data.qty || data.application || data.variant) { L.push(""); }
        if (data.qty)         { L.push("Quantity: " + data.qty + " " + data.unit); }
        if (data.application) { L.push("Application: " + data.application); }
        if (data.variant)     { L.push("Colour / variant: " + data.variant); }

        if (data.message) {
            L.push("");
            L.push("Message:");
            L.push(data.message);
        }
        return L.join("\n");
    }

    function validate(form) {
        var ok = true;

        function mark(key, bad) {
            var f = qs('[data-for="' + key + '"]', form);
            if (f) { f.classList.toggle("has-error", bad); }
            if (bad) { ok = false; }
        }

        var name  = form.name.value.trim();
        var phone = form.phone.value.trim();
        var email = form.email.value.trim();

        mark("name", name.length < 2);

        var digits = phone.replace(/\D/g, "");
        mark("phone", digits.length < 7 || digits.length > 15);

        mark("email", email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email));

        return ok;
    }

    function readForm(form) {
        return {
            name:        form.name.value.trim(),
            company:     form.company.value.trim(),
            phone:       form.phone.value.trim(),
            email:       form.email.value.trim(),
            qty:         form.qty.value.trim(),
            unit:        form.unit.value,
            application: form.application.value,
            variant:     form.variant.value.trim(),
            message:     form.message.value.trim()
        };
    }

    function donePanel(msg, products) {
        var subject = products.length === 1
            ? "Enquiry: " + products[0].name
            : (products.length > 1 ? "Enquiry: " + products.length + " fabrics"
                                   : "Enquiry from website");

        var wa = "https://wa.me/" + COMPANY.whatsapp + "?text=" + encodeURIComponent(msg);
        var mail = "mailto:" + COMPANY.email +
                   "?subject=" + encodeURIComponent(subject) +
                   "&body=" + encodeURIComponent(msg);

        return '' +
        '<div class="enq-done">' +
            '<div class="tick" aria-hidden="true">&#10003;</div>' +
            "<h3>Your enquiry is ready</h3>" +
            "<p>Send it through whichever channel suits you.</p>" +
            '<pre class="enq-preview" id="enq-preview">' + esc(msg) + "</pre>" +
            '<div class="enq-handoff">' +
                '<a class="btn btn--primary" href="' + esc(wa) + '" target="_blank" rel="noopener">' +
                    "Send on WhatsApp</a>" +
                '<a class="btn btn--outline" href="' + esc(mail) + '">Send by Email</a>' +
            "</div>" +
            '<button class="btn btn--quiet" type="button" id="enq-copy">Copy message</button>' +
            '<div class="note mt5 tiny">' +
                "<strong>Demo site.</strong> This form does not submit to a server and nothing " +
                "is stored. The buttons above simply open WhatsApp or your email client with " +
                "the message already written." +
            "</div>" +
        "</div>";
    }

    var modalHost = null;
    var lastFocus = null;

    function openEnquiry(products) {
        products = products || [];
        lastFocus = document.activeElement;

        if (!modalHost) {
            modalHost = el('' +
                '<div class="modal" id="enq-modal" role="dialog" aria-modal="true" ' +
                     'aria-labelledby="enq-title">' +
                    '<div class="modal-backdrop" data-enq-close></div>' +
                    '<div class="modal-panel">' +
                        '<div class="modal-head">' +
                            "<div>" +
                                '<h2 id="enq-title">Enquire About This Product</h2>' +
                                "<p>We reply with quotes, availability and samples.</p>" +
                            "</div>" +
                            '<button class="modal-close" type="button" data-enq-close ' +
                                'aria-label="Close">&times;</button>' +
                        "</div>" +
                        '<div class="modal-body"></div>' +
                    "</div>" +
                "</div>");
            document.body.appendChild(modalHost);

            modalHost.addEventListener("click", function (e) {
                if (e.target.closest && e.target.closest("[data-enq-close]")) { closeEnquiry(); }
            });
        }

        qs("#enq-title", modalHost).textContent = products.length > 1
            ? "Enquire About " + products.length + " Fabrics"
            : (products.length === 1 ? "Enquire About This Product" : "Send Us An Enquiry");

        var body = qs(".modal-body", modalHost);
        body.innerHTML = formHtml(products);

        var form = qs("#enq-form", body);
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!validate(form)) {
                var bad = qs(".has-error .input, .has-error .select", form);
                if (bad) { bad.focus(); }
                return;
            }
            var msg = composeMessage(readForm(form), products);
            body.innerHTML = donePanel(msg, products);

            var copy = qs("#enq-copy", body);
            copy.addEventListener("click", function () {
                var text = qs("#enq-preview", body).textContent;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(function () {
                        toast("Enquiry copied");
                    }, function () { toast("Could not copy"); });
                } else {
                    toast("Copying is not supported in this browser");
                }
            });
        });

        /* Clear the error state as soon as the buyer starts fixing it. */
        form.addEventListener("input", function (e) {
            var f = e.target.closest && e.target.closest(".field");
            if (f) { f.classList.remove("has-error"); }
        });

        modalHost.classList.add("is-open");
        document.body.style.overflow = "hidden";
        var first = qs("#enq-name", body);
        if (first) { first.focus(); }
    }

    function closeEnquiry() {
        if (!modalHost) { return; }
        modalHost.classList.remove("is-open");
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    }

    /* ---------- init ----------------------------------------------------- */

    function init(active) {
        var header = qs("#site-header");
        if (header) {
            header.className = "site-header";
            header.innerHTML = headerHtml(active);

            var toggle = qs(".nav-toggle", header);
            var nav = qs("#site-nav", header);
            toggle.addEventListener("click", function () {
                var open = nav.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });

            /* The header sits flush until the page moves, then picks up a
               hairline and a faint shadow. Throttled to one check per frame. */
            var ticking = false;
            function onScroll() {
                if (ticking) { return; }
                ticking = true;
                window.requestAnimationFrame(function () {
                    header.classList.toggle("is-scrolled", window.pageYOffset > 4);
                    ticking = false;
                });
            }
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
        }

        var footer = qs("#site-footer");
        if (footer) {
            footer.className = "site-footer";
            footer.innerHTML = footerHtml();
        }

        bindActions();
        bindTray();
        STORE.onChange(syncStates);
        syncStates();

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeEnquiry();
                var f = qs(".filters.is-open");
                if (f) { f.classList.remove("is-open"); }
            }
        });

        /* Scroll reveal and image fades. Page scripts call MOTION.scan()
           again after they render their own content. */
        if (window.MOTION) { window.MOTION.init(); }
    }

    return {
        init: init,
        esc: esc,
        el: el,
        qs: qs,
        qsa: qsa,
        param: param,
        card: card,
        crumbs: crumbs,
        catNames: catNames,
        catShort: catShort,
        toast: toast,
        syncStates: syncStates,
        openEnquiry: openEnquiry
    };
}());
