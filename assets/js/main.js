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

  // Project card accents: the spectrum, shuffled on each visit and dealt out
  // in that order. Cycling one shuffled order keeps neighbours apart (beside
  // and below, in a three-column grid) and red to at most two cards.
  var accents = ["var(--blue)", "var(--blue-soft)", "var(--yellow)", "var(--orange)", "var(--red)"];
  for (var i = accents.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = accents[i]; accents[i] = accents[j]; accents[j] = swap;
  }
  var paintCards = function () {
    var n = 0;
    document.querySelectorAll(".projects .card").forEach(function (card) {
      if (!card.hidden) card.style.setProperty("--accent", accents[n++ % accents.length]);
    });
  };
  paintCards();

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
      paintCards();
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

  // Hero terminal: types each tool's command, then prints its output, cycling
  // through the tools. All output is from real runs (Lockly on an Express
  // upgrade, Basely on a python:3.12 Dockerfile, Sbomly on its test SBOMs,
  // Vulnly on a Trivy scan of python:3.12). The page ships the Lockly run
  // already printed, which is what visitors without JS or motion see.
  var heroTerm = document.querySelector("[data-hero-term]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroTerm && !reduceMotion) {
    var v = function (t) { return '<span class="c-v">' + t + "</span>"; };
    var f = function (t) { return '<span class="c-f">' + t + "</span>"; };
    var tag = function (cls, t) { return '<span class="' + cls + '">' + t + "</span>"; };
    var runs = [
      { cmd: "lockly diff --base origin/main", out: [
        "44 added, 23 upgraded. " + v("5 findings to review."),
        tag("c-p", "install script") + "  " + v("esbuild") + " " + f("0.24.0"),
        tag("c-p", "publisher") + "       " + v("body-parser") + " " + f("1.20.3"),
        tag("c-p", "publisher") + "       " + v("send") + " " + f("0.19.0"),
        tag("c-o", "vulnerable") + "      " + v("esbuild") + " " + f("0.24.0"),
        tag("c-o", "vulnerable") + "      " + v("qs") + " " + f("6.13.0")
      ] },
      { cmd: "basely advise", out: [
        f("// build stage") + "  " + v("python:3.12"),
        tag("c-k", "→ python:3.12-slim") + "  " + f("drop-in"),
        "  104 → 28 critical and high, 412 → 43 MB",
        f("- FROM python:3.12 AS build"),
        tag("c-k", "+ FROM python:3.12-slim AS build")
      ] },
      { cmd: "sbomly diff cdx-old.json cdx-new.json", out: [
        v("payments-api 2.3.0 → 2.4.0"),
        tag("c-p", "integrity") + "  " + v("axios") + " " + f("1.6.0"),
        tag("c-y", "copyleft") + "   " + v("readline-sync") + " " + f("1.4.10"),
        tag("c-y", "copyleft") + "   " + v("sharp") + " " + f("0.33.0"),
        tag("c-o", "supplier") + "   " + v("@acme/logger") + " " + f("1.2.0"),
        v("5 findings to review.")
      ] },
      { cmd: "vulnly trivy.json -o report.html", out: [
        "Report generated: report.html " + f("(2911 vulnerabilities)"),
        "  " + tag("c-p", "CRITICAL: 3") + "  " + tag("c-o", "HIGH: 194") + "  MEDIUM: 752  LOW: 1459",
        "  1 known exploited (KEV), 3 likely exploited"
      ] }
    ];
    var prompt = '<span class="c-p">$</span> ';
    var caret = '<span class="cursor"></span>';
    var run = 0, chars = 0, line = 0, pending = null, onScreen = true;

    var render = function (typing) {
      var r = runs[run];
      var text = prompt + v(r.cmd.slice(0, chars)) + (typing ? caret : "");
      if (!typing) text += "\n\n" + r.out.slice(0, line).join("\n") + (line === r.out.length ? "\n" + prompt + caret : "");
      heroTerm.innerHTML = text;
    };
    // Steps wait while the hero is off screen, and pick up where they left off.
    var later = function (step, ms) {
      setTimeout(function () { if (onScreen) step(); else pending = step; }, ms);
    };
    var type = function () {
      chars++;
      render(true);
      if (chars < runs[run].cmd.length) later(type, 40 + Math.random() * 60);
      else later(print, 450);
    };
    var print = function () {
      line++;
      render(false);
      if (line < runs[run].out.length) later(print, 110);
      else later(nextRun, 3200);
    };
    var nextRun = function () {
      run = (run + 1) % runs.length; chars = 0; line = 0;
      render(true);
      later(type, 350);
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen && pending) { var step = pending; pending = null; step(); }
      }).observe(heroTerm);
    }
    later(nextRun, 3200);
  }

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
