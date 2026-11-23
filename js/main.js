/* JV Ice Hockey Academy London — site script */
(function () {
  document.documentElement.classList.remove("no-js");

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        toggle.focus();
      }
    });
  }

  // Header shadow on scroll
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Subtle reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Card sliders (scroll-snap + arrow buttons + progress bar)
  document.querySelectorAll("[data-slider]").forEach(function (wrap) {
    var track = wrap.querySelector(".slider");
    var prev = wrap.querySelector("[data-prev]");
    var next = wrap.querySelector("[data-next]");
    var bar = wrap.querySelector(".slider-progress span");
    if (!track) return;
    var step = function () {
      var slide = track.querySelector(".slide");
      return slide ? slide.getBoundingClientRect().width + 22 : track.clientWidth * 0.8;
    };
    var update = function () {
      var max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max - 4;
      if (bar) {
        var visible = track.clientWidth / track.scrollWidth;
        bar.style.width = Math.max(visible * 100, 12) + "%";
        bar.style.left = (max > 0 ? (track.scrollLeft / max) * (100 - Math.max(visible * 100, 12)) : 0) + "%";
      }
    };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  // Hero video loops on its own; it stays still only for visitors who turned on "reduce motion"
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && reduce) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }

  // Outline drawings drift and tilt a little as you scroll (off for "reduce motion").
  // Each one glides towards its scroll position with a little inertia, floats gently
  // while the page is still, and is clamped so it stays inside its own section.
  var drifters = [].slice.call(document.querySelectorAll("[data-speed]"));
  if (drifters.length && !reduce) {
    var floaters = drifters.map(function (el, i) {
      var sec = el.closest("section, footer") || el.parentElement;
      return { el: el, sec: sec, s: parseFloat(el.dataset.speed), cur: 0, y: 0, phase: i * 1.7, dir: i % 2 ? 1 : -1,
               padTop: /slant-top|cta-band/.test(sec.className) ? 90 : 24, padBottom: 24 };
    });
    var frame = function (time) {
      var mid = window.innerHeight / 2;
      floaters.forEach(function (it) {
        var r = it.sec.getBoundingClientRect();
        if (r.bottom < -300 || r.top > window.innerHeight + 300) return;
        var er = it.el.getBoundingClientRect();
        var baseTop = er.top - it.y - r.top, baseBottom = baseTop + er.height;
        var minY = Math.min(0, it.padTop - baseTop), maxY = Math.max(0, r.height - it.padBottom - baseBottom);
        var target = -((r.top + r.height / 2) - mid) * it.s;
        target = Math.max(minY, Math.min(maxY, target));
        it.cur += (target - it.cur) * 0.08;
        var t = time / 1000 + it.phase;
        var y = Math.max(minY, Math.min(maxY, it.cur + Math.sin(t * 0.9) * 6));
        it.y = y;
        var x = Math.cos(t * 0.6) * 5 * it.dir;
        var rot = it.cur * 0.06 * it.dir + Math.sin(t * 0.7) * 1.5;
        it.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) rotate(" + rot.toFixed(2) + "deg)";
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // Enquiry form (FormSubmit, emails the academy inbox)
  var form = document.getElementById("enquiry-form");
  if (form) {
    // Pre-select the enquiry type from links like contact.html?type=adult
    var preset = { children: "Children's Hockey", adult: "Adult Hockey", camps: "Camps & Clinics" }[
      new URLSearchParams(window.location.search).get("type")
    ];
    if (preset) form.querySelector("[name=enquiry_type]").value = preset;

    var status = document.getElementById("form-status");
    var button = form.querySelector("button[type=submit]");
    var show = function (type, msg) {
      status.className = "form-status show " + type;
      status.textContent = msg;
      status.focus();
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      // Honeypot: real visitors never fill this in
      if (form.querySelector("[name=botcheck]").checked) return;

      var data = new FormData(form);
      data.delete("botcheck");
      var type = data.get("enquiry_type") || "General";
      data.set("_subject", "Website enquiry: " + type);
      if (data.get("email")) data.set("_replyto", data.get("email"));

      button.disabled = true;
      var label = button.textContent;
      button.textContent = "Sending…";

      fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (res.ok && String(res.body.success) === "true") {
            form.reset();
            show("success", "Thank you! Your enquiry has been sent. We'll get back to you as soon as we can.");
          } else {
            show("error", "Sorry, something went wrong sending your enquiry. Please try again, or message us on WhatsApp.");
          }
        })
        .catch(function () {
          show("error", "Sorry, we couldn't send your enquiry. Please check your connection and try again, or message us on WhatsApp.");
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = label;
        });
    });
  }
})();
