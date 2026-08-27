/* ==========================================================================
   K.K. Knitwear Club - scroll reveal & image fade
   --------------------------------------------------------------------------
   Two jobs, both deliberately small:

   1. Blocks of content fade and rise by 12px as they come into view, once.
   2. Product photographs fade in as they decode, instead of popping.
   3. The home page introduction gets a hand-timed cascade, with the
      headline revealed one word at a time.

   Rules this file follows
   -----------------------
   - Nothing is hidden unless this script is running. The hidden state lives
     behind `html.motion-ready`, which only this file adds. With JavaScript
     off, or if the reader has asked for reduced motion, every element
     renders exactly as authored.

   - Revealing never depends on IntersectionObserver alone. The observer is
     the efficient path, but a throttled scroll sweep runs alongside it and
     is what actually guarantees content becomes visible. This matters:
     IntersectionObserver callbacks are delivered as part of the rendering
     loop, so a document that is never painted - a background tab, a
     prerender, an offscreen frame - may never receive them. The sweep uses
     plain geometry and works regardless.

   - Neither path ever reveals content the reader has not reached. Elements
     further down the page stay hidden until they are genuinely on screen,
     so scroll reveal keeps working for the whole visit.

   - Both listeners detach as soon as the last element has been revealed, so
     an idle page costs nothing.

   - Only opacity and transform are animated. Both are composited, so
     scrolling stays smooth with fifty cards on screen.

   The product grid on the catalogue is deliberately NOT revealed. It
   re-renders on every keystroke and every filter change, so animating it
   would flicker. A working tool should feel instant.
   ========================================================================== */

var MOTION = (function () {

    /* Blocks that fade in as a single unit */
    var SOLO = [
        ".section-head",
        ".cta-band",
        ".pd",
        ".info-card",
        ".sl-bar",
        ".cmp-scroll",
        ".empty",
        ".prose h2",
        ".prose .table-scroll"
    ];

    /* The home page introduction gets its own hand-written cascade rather
       than the generic index-based stagger, so the eyebrow, the headline,
       the paragraph and the buttons arrive in a deliberate order.
       `split` means the element's words are revealed one at a time. */
    var HERO = [
        { sel: ".hero-copy .eyebrow",  delay: 0,   mode: "block" },
        { sel: ".hero-copy h1",        delay: 70,  mode: "split" },
        { sel: ".hero-copy .lede",     delay: 300, mode: "block" },
        { sel: ".hero-copy .hero-cta", delay: 400, mode: "block" },
        { sel: ".hero-collage",        delay: 180, mode: "block" }
    ];

    var WORD_STAGGER = 38;      /* ms between words of a split headline */
    var WORD_STAGGER_MAX = 12;  /* a very long headline must not crawl */

    /* Containers whose direct children fade in one after another */
    var GROUPS = [
        "#home-stats",
        "#home-cats",
        "#home-featured",
        ".steps",
        "#pd-related .grid-products",
        ".sl-list"
    ];

    var STAGGER = 60;        /* ms between children */
    var STAGGER_MAX = 5;     /* stop increasing after this many, so a long
                                list never crawls */
    var SWEEP_MS = 100;      /* scroll-sweep throttle */

    var reduced = false;
    var enabled = false;
    var observer = null;
    var pending = [];         /* tagged, not yet revealed */
    var pendingImgs = [];     /* hidden, still waiting to decode */
    var listening = false;
    var timer = null;

    function qsa(sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }

    /* ---------- image fade ----------------------------------------------- */

    function showImage(img) {
        img.setAttribute("data-fade", "done");
        img.classList.add("is-loaded");
    }

    function fadeImages(root) {
        if (!enabled) { return; }

        qsa("img", root).forEach(function (img) {
            var state = img.getAttribute("data-fade");
            if (state === "done") { return; }

            /* A cached image is already complete before we get here and
               would never fire another load event. */
            if (img.complete && img.naturalWidth > 0) { showImage(img); return; }

            /* Listeners are already attached - do not add a second pair. */
            if (state === "pending") { return; }

            img.setAttribute("data-fade", "pending");
            pendingImgs.push(img);

            /* A broken image must still un-hide, or it leaves a blank box. */
            img.addEventListener("load", function () { showImage(img); }, { once: true });
            img.addEventListener("error", function () { showImage(img); }, { once: true });
        });
    }

    /* Belt and braces for the image fade. An image hidden at opacity 0 that
       is waiting on a load event is one missed event away from being a blank
       box, so every sweep re-checks `complete` directly rather than trusting
       the event alone. Cheap: the list only ever shrinks. */
    function drainImages() {
        if (!pendingImgs.length) { return; }
        pendingImgs = pendingImgs.filter(function (img) {
            if (!img.isConnected) { return false; }
            if (img.complete && img.naturalWidth > 0) { showImage(img); return false; }
            return img.getAttribute("data-fade") !== "done";
        });
    }

    /* ---------- reveal --------------------------------------------------- */

    function reveal(el) {
        el.classList.add("is-in");
        if (observer) { observer.unobserve(el); }
    }

    function onScreen(el) {
        var r = el.getBoundingClientRect();
        /* A little tolerance at the bottom, so the reveal finishes about
           when the reader's eye arrives. */
        return r.top < window.innerHeight * 0.94 && r.bottom > 0;
    }

    /* Reveals everything currently on screen, and nothing else. */
    function sweep() {
        drainImages();

        if (pending.length) {
            pending = pending.filter(function (el) {
                if (!el.isConnected) { return false; }   /* re-rendered away */
                if (onScreen(el)) { reveal(el); return false; }
                return true;
            });
        }

        if (!pending.length && !pendingImgs.length) { stopListening(); }
    }

    function onScroll() {
        if (timer) { return; }
        timer = window.setTimeout(function () {
            timer = null;
            sweep();
        }, SWEEP_MS);
    }

    function startListening() {
        if (listening) { return; }
        listening = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
    }

    function stopListening() {
        if (!listening) { return; }
        listening = false;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
    }

    function escHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    /* Rewrites a heading as one wrapper per word, so each word can slide up
       from behind its own clipping box.

       The heading keeps an aria-label carrying the original sentence, and
       the generated spans are aria-hidden, so assistive technology reads one
       continuous line rather than a list of words. Returns false if there is
       nothing to split, and the caller falls back to a plain block reveal. */
    function splitWords(el) {
        var text = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) { return false; }

        var words = text.split(" ");
        el.setAttribute("aria-label", text);
        el.innerHTML = words.map(function (w, i) {
            var d = Math.min(i, WORD_STAGGER_MAX) * WORD_STAGGER;
            return '<span class="w" aria-hidden="true">' +
                       '<span class="wi" style="--d:' + d + 'ms">' + escHtml(w) + "</span>" +
                   "</span>";
        }).join(" ");
        return true;
    }

    function tag(el, delay, mode) {
        if (!el) { return; }
        if (el.hasAttribute("data-reveal") || el.hasAttribute("data-reveal-words")) {
            return;
        }

        if (mode === "split" && !splitWords(el)) { mode = "block"; }

        el.setAttribute(mode === "split" ? "data-reveal-words" : "data-reveal", "");
        if (delay) { el.style.setProperty("--reveal-delay", delay + "ms"); }
        pending.push(el);
        if (observer) { observer.observe(el); }
    }

    function scan(root) {
        if (!enabled) { return; }
        root = root || document;

        /* The hero cascade runs first so its hand-picked delays win over any
           generic stagger - tag() ignores anything already tagged. */
        HERO.forEach(function (step) {
            qsa(step.sel, root).forEach(function (el) {
                tag(el, step.delay, step.mode);
            });
        });

        SOLO.forEach(function (sel) {
            qsa(sel, root).forEach(function (el) { tag(el, 0, "block"); });
        });

        GROUPS.forEach(function (sel) {
            qsa(sel, root).forEach(function (container) {
                Array.prototype.slice.call(container.children)
                    .forEach(function (child, i) {
                        tag(child, Math.min(i, STAGGER_MAX) * STAGGER, "block");
                    });
            });
        });

        fadeImages(root);

        if (pending.length || pendingImgs.length) {
            startListening();
            sweep();                 /* whatever is already on screen */
        }
    }

    /* ---------- init ----------------------------------------------------- */

    function init() {
        try {
            reduced = window.matchMedia &&
                      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch (e) { reduced = false; }

        if (reduced) { return; }      // leave the page exactly as authored

        enabled = true;
        document.documentElement.classList.add("motion-ready");

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(function (entries) {
                var hit = false;
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) { return; }
                    reveal(entry.target);
                    hit = true;
                });
                if (hit) {
                    pending = pending.filter(function (el) {
                        return !el.classList.contains("is-in");
                    });
                    if (!pending.length && !pendingImgs.length) { stopListening(); }
                }
            }, {
                rootMargin: "0px 0px -6% 0px",
                threshold: 0.04
            });
        }

        scan(document);
    }

    return {
        init: init,
        scan: scan,
        images: fadeImages
    };
}());
