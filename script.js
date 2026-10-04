// Rajendra Guttedar — portfolio v2 interactions
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // ── Resume link ─────────────────────────────────────────────
  // Production: Google Drive public link (set 2026-10-05). Every element
  // with the [data-resume] attribute picks up this URL automatically.
  // Note: the `download` attribute is ignored by browsers for cross-origin
  // links, so this opens the Drive preview — that is normal and expected.
  var RESUME_URL = "https://drive.google.com/file/d/1CD_B4SRvJ31G_sUp6-7KaFKxGxLiwdCv/view?usp=sharing";

  document.querySelectorAll("[data-resume]").forEach(function (a) {
    a.setAttribute("href", RESUME_URL);
    // The `download` attribute only works for same-origin files;
    // leave it — harmless for cross-origin Drive links (they open instead).
  });

  // Mobile nav
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Safety net: reveal anything still hidden after 1.2s (e.g. IO quirks)
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.visible)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("visible");
    });
  }, 1200);

  // Active nav link
  var sections = ["work", "skills", "experience", "contact"];
  var navLinks = {};
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (a) {
    navLinks[a.getAttribute("href").slice(1)] = a;
  });
  function setActive() {
    var current = null;
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 140) current = id;
    });
    var doc = document.documentElement;
    if (window.innerHeight + (window.scrollY || window.pageYOffset || 0) >= doc.scrollHeight - 2) {
      var last = sections[sections.length - 1];
      if (document.getElementById(last)) current = last;
    }
    Object.keys(navLinks).forEach(function (id) {
      navLinks[id].classList.toggle("active", id === current);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  // Copy email
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "rajendraguttedar55@gmail.com";
      function done() {
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = "Copy email"; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        try {
          if (document.execCommand("copy")) done();
        } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
