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

  // ---- reels: load and play only while on screen ----
  // preload="none" in the markup means nothing is fetched until this decides
  // it is worth fetching. Six autoplaying videos would otherwise all download
  // at once, on a page whose whole pitch is that it feels fast.
  function addSource(video, src, type) {
    if (!src) return;
    var source = document.createElement("source");
    source.src = src;
    source.type = type;
    video.appendChild(source);
  }

  var reels = document.querySelectorAll(".f .motion[data-src]");
  if (reels.length) {
    reels.forEach(function (el) {
      var video = /** @type {HTMLVideoElement} */ (el);
      var field = video.parentElement;
      if (!field) return;

      // Under prefers-reduced-motion the reel never loads or plays; the poster
      // frame stands in as a still, so the slot still reads as finished.
      if (calm.matches) {
        if (video.poster) {
          var still = new Image();
          still.onload = function () {
            field.classList.add("loaded");
          };
          still.src = video.poster;
        }
        return;
      }

      // Autoplay is only permitted muted. Set it on the element as well as in
      // the markup: a browser restoring state across a reload can otherwise
      // hand back an unmuted element and silently refuse to play it.
      video.muted = true;

      var started = false;
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!started) {
                started = true;
                // WebM first — Chrome and Firefox take it at roughly two
                // thirds the bytes. Safari ignores it and falls through to the
                // MP4, which is the only one it will play.
                addSource(video, video.dataset.srcWebm, "video/webm");
                addSource(video, video.dataset.src, "video/mp4");
                video.load();
              }
              var play = video.play();
              // A rejected play() is normal — a background tab, a battery
              // saver, a browser that declines. The poster stays; nothing to
              // handle, but it must not surface as an unhandled rejection.
              if (play && play.catch) play.catch(function () {});
            } else {
              video.pause();
            }
          });
        },
        { rootMargin: "200px" },
      );

      video.addEventListener("loadeddata", function () {
        field.classList.add("loaded");
      });
      // If every source is missing or refused, fall back to the poster rather
      // than fading in a black rectangle. The error fires on the <video> only
      // once all its <source> children have failed.
      video.addEventListener("error", function () {
        if (video.poster) {
          field.classList.add("loaded");
        } else {
          field.classList.remove("loaded");
        }
      });

      observer.observe(field);
    });
  }

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
