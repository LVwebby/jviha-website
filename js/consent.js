/* Cookie consent + Google Analytics (loads only after "Accept").
   Put your Google Analytics ID (G-XXXXXXXXXX) below. Until then, no analytics runs. */
(function () {
  var GA_ID = "G-XXXXXXXXXX";
  var NAME = "jv_consent", DAYS = 180;

  function read() { var m = document.cookie.match(/(?:^|; )jv_consent=([^;]*)/); return m ? m[1] : null; }
  function save(v) { document.cookie = NAME + "=" + v + "; max-age=" + DAYS * 86400 + "; path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : ""); }
  function clearGa() {
    document.cookie.split("; ").forEach(function (c) {
      var n = c.split("=")[0];
      if (/^_ga/.test(n)) ["", "; domain=" + location.hostname, "; domain=." + location.hostname.replace(/^www\./, "")].forEach(function (d) {
        document.cookie = n + "=; max-age=0; path=/" + d;
      });
    });
  }
  function loadGa() {
    if (!/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === "G-XXXXXXXXXX" || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("js", new Date());
    gtag("config", GA_ID);
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  var css = ".cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;margin-left:auto;background:#000;color:rgba(255,255,255,.8);border-top:4px solid #EE7424;padding:22px 24px;font-size:.9rem;line-height:1.55;box-shadow:0 20px 50px rgba(0,0,0,.35)}" +
    ".cc h2{font-family:var(--font-head,serif);color:#fff;font-size:1.15rem;margin:0 0 8px;letter-spacing:.04em}" +
    ".cc a{color:#EE7424;font-weight:700}.cc p{margin:0 0 16px}" +
    ".cc-btns{display:flex;flex-wrap:wrap;gap:10px}.cc button{font:inherit;font-weight:800;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;padding:12px 18px;border:2px solid #fff;background:transparent;color:#fff;cursor:pointer}" +
    ".cc button.cc-accept{background:#EE7424;border-color:#EE7424;color:#000}.cc button:hover{border-color:#EE7424}" +
    ".cc-opts{display:none;margin:0 0 16px;border-top:1px solid rgba(255,255,255,.15)}.cc.open .cc-opts{display:block}" +
    ".cc-opt{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.15)}.cc-opt strong{color:#fff;display:block}.cc-opt small{display:block;font-size:.8rem}" +
    ".cc-opt input{width:20px;height:20px;accent-color:#EE7424;flex:none;margin-top:3px}" +
    "@media(max-width:860px){body.has-mobile-join .cc{bottom:90px}}";

  var box;
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var root = (document.querySelector('link[rel=stylesheet][href*="css/style.css"]') || {}).getAttribute ? document.querySelector('link[rel=stylesheet][href*="css/style.css"]').getAttribute("href").replace("css/style.css", "") : "";
    box = document.createElement("div");
    box.className = "cc"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Cookie settings"); box.hidden = true;
    box.innerHTML = '<h2>Cookies</h2><p>We use one essential cookie to remember your choice. With your permission we also use Google Analytics cookies to see how visitors use the site. See our <a href="' + root + 'policies.html#cookies">Cookie Policy</a>.</p>' +
      '<div class="cc-opts"><label class="cc-opt"><span><strong>Essential</strong><small>Remembers your cookie choice. Always on.</small></span><input type="checkbox" checked disabled></label>' +
      '<label class="cc-opt"><span><strong>Analytics</strong><small>Google Analytics: anonymous visitor statistics.</small></span><input type="checkbox" class="cc-an"></label></div>' +
      '<div class="cc-btns"><button type="button" class="cc-accept">Accept all</button><button type="button" class="cc-reject">Reject</button><button type="button" class="cc-set">Settings</button></div>';
    document.body.appendChild(box);
    box.querySelector(".cc-accept").onclick = function () { choose(1); };
    box.querySelector(".cc-reject").onclick = function () { choose(0); };
    box.querySelector(".cc-set").onclick = function () {
      if (box.classList.contains("open")) { choose(box.querySelector(".cc-an").checked ? 1 : 0); }
      else { box.classList.add("open"); this.textContent = "Save choices"; }
    };
  }
  function show() { box.hidden = false; box.querySelector(".cc-an").checked = read() === "1"; }
  function choose(v) {
    save(v ? "1" : "0"); box.hidden = true; box.classList.remove("open"); box.querySelector(".cc-set").textContent = "Settings";
    if (v) loadGa(); else { clearGa(); if (window.gtag) location.reload(); }
  }

  function init() {
    build();
    var c = read();
    if (c === "1") loadGa(); else if (c === null) show();
    document.addEventListener("click", function (e) { var t = e.target.closest && e.target.closest("[data-cookie-settings]"); if (t) { e.preventDefault(); show(); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
