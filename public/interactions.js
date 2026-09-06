// @ts-check
/**
 * Every interaction on the page, in one deferred script.
 *
 * All of it is imperative DOM work React has no opinion worth having about —
 * measuring a marquee set, following a cursor, dragging a scroll container,
 * decoding a photo. Holding any of it in component state would mean shipping a
 * framework to do what this file does, on a page whose entire pitch is that it
 * feels fast. So the page is server-rendered markup and this is the only
 * script on it.
 *
 * That also makes the page portable: `scripts/bundle.mjs` flattens the whole
 * site into one self-contained HTML file by inlining this alongside the markup,
 * with no framework runtime to reconstruct.
 *
 * Everything degrades. With no JS the gradients, the full text and the direct
 * WhatsApp links are all still there.
 */
(function () {
  "use strict";

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---- photos: fade in over the gradient once actually decoded ----
  document.querySelectorAll(".f .photo[data-src]").forEach(function (layer) {
    var src = /** @type {HTMLElement} */ (layer).dataset.src;
    var field = layer.parentElement;
    if (!src || !field) return;
    var probe = new Image();
    probe.onload = function () {
      /** @type {HTMLElement} */ (layer).style.backgroundImage = 'url("' + src + '")';
      field.classList.add("loaded");
    };
    // On failure nothing happens, which is the point: the gradient stays.
    probe.src = src;
  });

  // ---- sector rows: float the image at the cursor ----
  var peek = document.querySelector(".peek");
  var peekField = peek && peek.querySelector(".f");
  if (peek && peekField) {
    document.querySelectorAll(".srow").forEach(function (row) {
      var data = /** @type {HTMLElement} */ (row).dataset;
      row.addEventListener("mouseenter", function () {
        if (calm.matches) return;
        peekField.className = "f " + (data.peekTone || "");
        peekField.replaceChildren();
        if (data.peekSrc) {
          var layer = document.createElement("div");
          layer.className = "photo";
          layer.style.backgroundImage = 'url("' + data.peekSrc + '")';
          peekField.appendChild(layer);
          peekField.classList.add("loaded");
        }
        peek.classList.add("on");
      });
      row.addEventListener("mouseleave", function () {
        peek.classList.remove("on");
      });
      row.addEventListener("mousemove", function (e) {
        var m = /** @type {MouseEvent} */ (e);
        /** @type {HTMLElement} */ (peek).style.left = m.clientX + "px";
        /** @type {HTMLElement} */ (peek).style.top = m.clientY + "px";
      });
    });
  }

  // ---- marquee: clone past 2x viewport, animate by exactly one set ----
  var track = /** @type {HTMLElement | null} */ (document.querySelector(".marq-in"));
  var SPEED = 55; // px per second

  function buildMarquee() {
    if (!track) return;
    var first = /** @type {HTMLElement | null} */ (track.querySelector(".marq-set"));
    if (!first) return;
    track.querySelectorAll(".marq-set").forEach(function (set, i) {
      if (i) set.remove();
    });
    var width = first.getBoundingClientRect().width;
    // Real logos need explicit width/height, or this measures before they have
    // laid out and gets zero.
    if (!width) return;
    var copies = Math.ceil((window.innerWidth * 2) / width);
    for (var i = 1; i < copies; i++) {
      var clone = /** @type {HTMLElement} */ (first.cloneNode(true));
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
    track.style.setProperty("--set", width + "px");
    // Duration derived from measured width, never fixed, or the marquee speeds
    // up as names are added.
    track.style.setProperty("--dur", width / SPEED + "s");
  }

  buildMarquee();
  // Fonts land after this script runs and change the measured width.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildMarquee);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildMarquee, 200);
  });

  // ---- work rail: drag to scroll ----
  var rail = /** @type {HTMLElement | null} */ (document.querySelector(".rail"));
  if (rail) {
    var down = false;
    var startX = 0;
    var startLeft = 0;
    rail.addEventListener("pointerdown", function (e) {
      var p = /** @type {PointerEvent} */ (e);
      down = true;
      startX = p.clientX;
      startLeft = rail.scrollLeft;
      rail.setPointerCapture(p.pointerId);
    });
    rail.addEventListener("pointermove", function (e) {
      if (down) rail.scrollLeft = startLeft - (/** @type {PointerEvent} */ (e).clientX - startX);
    });
    var release = function () {
      down = false;
    };
    rail.addEventListener("pointerup", release);
    rail.addEventListener("pointercancel", release);
  }

  // ---- enquiry form: carry the answers into WhatsApp ----
  // Bookings run entirely through WhatsApp and there is no backend, so rather
  // than dropping the enquirer into an empty chat having lost everything they
  // typed, compose their answers into the opening message.
  var form = /** @type {HTMLFormElement | null} */ (document.querySelector("form[data-whatsapp]"));
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var value = function (key) {
        return String(data.get(key) || "").trim();
      };
      var lines = [
        "Hello " + (form.dataset.studio || "there") + ", I'd like to enquire.",
        "",
        "Name: " + (value("name") || "—"),
      ];
      if (value("company")) lines.push("Company: " + value("company"));
      lines.push("Date: " + (value("date") || "To be confirmed"));
      lines.push("Type: " + value("type"));
      lines.push("", value("brief") || "—");
      var url = form.dataset.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
})();
