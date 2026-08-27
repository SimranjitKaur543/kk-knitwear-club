/* ==========================================================================
   K.K. Knitwear Club - shortlist & compare storage
   --------------------------------------------------------------------------
   Both lists are just arrays of product ids kept in the browser's
   localStorage. Nothing is sent anywhere - this is a front-end only site.

   Every read and write is wrapped in try/catch because localStorage throws
   in some private-browsing modes instead of simply being empty.

   Any change fires a "kk:store" event on document so the header badges,
   the compare tray and the buttons on cards all stay in sync.
   ========================================================================== */

var STORE = (function () {

    var KEY_SHORTLIST = "kk_shortlist";
    var KEY_COMPARE   = "kk_compare";
    var MAX_COMPARE   = 4;

    /* In-memory mirror, so the site still works if localStorage is blocked. */
    var memory = {};

    function read(key) {
        try {
            var raw = window.localStorage.getItem(key);
            if (raw) { return JSON.parse(raw) || []; }
        } catch (e) { /* blocked or unparseable - fall through */ }
        return memory[key] || [];
    }

    function write(key, list) {
        memory[key] = list;
        try {
            window.localStorage.setItem(key, JSON.stringify(list));
        } catch (e) { /* blocked - the in-memory copy still works this visit */ }
        announce();
    }

    function announce() {
        try {
            document.dispatchEvent(new CustomEvent("kk:store"));
        } catch (e) {
            var ev = document.createEvent("Event");
            ev.initEvent("kk:store", true, true);
            document.dispatchEvent(ev);
        }
    }

    /* Drop ids that no longer exist in products.js. */
    function clean(list) {
        var out = [];
        for (var i = 0; i < list.length; i++) {
            if (productById(list[i]) && out.indexOf(list[i]) === -1) {
                out.push(list[i]);
            }
        }
        return out;
    }

    function makeList(key, limit) {
        return {
            all: function () { return clean(read(key)); },

            count: function () { return this.all().length; },

            has: function (id) { return this.all().indexOf(id) !== -1; },

            isFull: function () { return limit ? this.count() >= limit : false; },

            add: function (id) {
                var list = this.all();
                if (list.indexOf(id) !== -1) { return "already"; }
                if (limit && list.length >= limit) { return "full"; }
                list.push(id);
                write(key, list);
                return "added";
            },

            remove: function (id) {
                var list = this.all();
                var at = list.indexOf(id);
                if (at === -1) { return false; }
                list.splice(at, 1);
                write(key, list);
                return true;
            },

            /* Returns "added" | "removed" | "full" */
            toggle: function (id) {
                if (this.has(id)) { this.remove(id); return "removed"; }
                return this.add(id);
            },

            clear: function () { write(key, []); },

            /* The product objects, in the order they were saved. */
            products: function () {
                var ids = this.all();
                var out = [];
                for (var i = 0; i < ids.length; i++) {
                    var p = productById(ids[i]);
                    if (p) { out.push(p); }
                }
                return out;
            }
        };
    }

    return {
        shortlist: makeList(KEY_SHORTLIST, 0),
        compare:   makeList(KEY_COMPARE, MAX_COMPARE),
        MAX_COMPARE: MAX_COMPARE,
        onChange: function (fn) { document.addEventListener("kk:store", fn); }
    };
}());
