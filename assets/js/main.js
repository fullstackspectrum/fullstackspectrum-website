(function () {
  "use strict";

  // Year in footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Header border on scroll
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  // Copy install commands
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var code = btn.parentElement.querySelector("code");
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.textContent.trim()).then(function () {
        btn.textContent = "copied";
        btn.classList.add("done");
        setTimeout(function () { btn.textContent = "copy"; btn.classList.remove("done"); }, 1600);
      });
    });
  });

  // Project filters
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      var want = f.dataset.filter;
      filters.forEach(function (x) { x.setAttribute("aria-pressed", String(x === f)); });
      document.querySelectorAll(".projects .card").forEach(function (card) {
        var tags = (card.dataset.tags || "").split(" ");
        card.hidden = want !== "all" && tags.indexOf(want) === -1;
      });
    });
  });

  // Cursor-follow glow on cards
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Live GitHub star counts (silently skipped if the API is unavailable/rate-limited)
  var starEls = document.querySelectorAll("[data-repo]");
  if (starEls.length && window.fetch) {
    fetch("https://api.github.com/users/fullstackspectrum/repos?per_page=100")
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (repos) {
        var stars = {};
        repos.forEach(function (repo) { stars[repo.name.toLowerCase()] = repo.stargazers_count; });
        starEls.forEach(function (card) {
          var n = stars[card.dataset.repo.toLowerCase()];
          var slot = card.querySelector("[data-stars]");
          if (slot && typeof n === "number") slot.textContent = "★ " + n;
        });
      })
      .catch(function () {});
  }

  // Blog post lists
  var posts = (window.POSTS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  document.querySelectorAll("[data-posts]").forEach(function (list) {
    var limit = parseInt(list.dataset.limit, 10) || posts.length;
    var items = posts.slice(0, limit);
    if (!items.length) {
      list.innerHTML = '<p class="post-date" style="padding:22px 0">No posts yet — check back soon.</p>';
      return;
    }
    items.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "post-row";
      a.href = p.url;
      if (p.external) { a.target = "_blank"; a.rel = "noopener"; }
      var d = new Date(p.date + "T00:00:00");
      var dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

      var date = document.createElement("span"); date.className = "post-date"; date.textContent = dateStr;
      var title = document.createElement("span"); title.className = "post-title"; title.textContent = p.title;
      if (p.excerpt) {
        var ex = document.createElement("span"); ex.className = "post-excerpt"; ex.textContent = p.excerpt;
        title.appendChild(ex);
      }
      var arrow = document.createElement("span"); arrow.className = "post-arrow"; arrow.textContent = p.external ? "↗" : "→";

      a.append(date, title, arrow);
      list.appendChild(a);
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 60 + "ms"; io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
