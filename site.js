// Twin Villas — shared site behavior. No analytics, no cookies, no third-party requests.
(function () {
  "use strict";

  var header = document.querySelector("header.site");
  if (!header) return;

  var menuBtn = header.querySelector(".menu-btn");
  var nav = header.querySelector("nav.primary");

  // Mobile menu toggle
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      if (!open) closeAllSubmenus();
    });
  }

  // Nested dropdown menus (desktop: hover + click; mobile: click/tap only)
  var topItems = nav ? nav.querySelectorAll(":scope > ul > li") : [];

  function closeAllSubmenus(except) {
    topItems.forEach(function (li) {
      if (li !== except) {
        li.classList.remove("has-open");
        var btn = li.querySelector(":scope > button.nav-top");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  topItems.forEach(function (li) {
    var btn = li.querySelector(":scope > button.nav-top");
    var submenu = li.querySelector(":scope > .submenu");
    if (!btn || !submenu) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = li.classList.contains("has-open");
      closeAllSubmenus(li);
      li.classList.toggle("has-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    li.addEventListener("mouseenter", function () {
      if (window.matchMedia("(min-width: 821px)").matches) {
        closeAllSubmenus(li);
        li.classList.add("has-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
    li.addEventListener("mouseleave", function () {
      if (window.matchMedia("(min-width: 821px)").matches) {
        li.classList.remove("has-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!nav || !nav.contains(e.target)) closeAllSubmenus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllSubmenus();
      if (nav && nav.classList.contains("open") && window.matchMedia("(max-width: 820px)").matches) {
        nav.classList.remove("open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Tour / contact form (front-end only — no data is sent anywhere)
  var form = document.getElementById("tour-form");
  if (form) {
    var status = document.getElementById("status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = Array.prototype.filter.call(form.querySelectorAll("[required]"), function (f) {
        return !f.value.trim();
      });
      status.hidden = false;
      if (missing.length) {
        status.textContent = "Please fill in your name, phone, email, and what you would like to do.";
        missing[0].focus();
        return;
      }
      status.textContent = "Thank you, " + form.first.value.trim() + ". We received your request and will call you within one business day.";
      form.reset();
    });
  }

  // Gallery filter (Gallery page only)
  var toolbar = document.querySelector(".gallery-toolbar");
  var galleryGrid = document.querySelector(".gallery-grid");
  if (toolbar && galleryGrid) {
    var chips = toolbar.querySelectorAll(".chip");
    var items = galleryGrid.querySelectorAll("figure");
    var empty = document.querySelector(".gallery-empty");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var filter = chip.getAttribute("data-filter");
        var visibleCount = 0;
        items.forEach(function (item) {
          var show = filter === "all" || item.getAttribute("data-category") === filter;
          item.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });
        if (empty) empty.style.display = visibleCount === 0 ? "block" : "none";
      });
    });
  }
})();
