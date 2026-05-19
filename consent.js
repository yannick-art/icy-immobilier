(function () {
  const GTM_ID = "GTM-KKR6XMGH";
  const STORAGE_KEY = "icy_cookie_consent";

  function loadGtm() {
    if (window.icyGtmLoaded) return;
    window.icyGtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(script);
  }

  function remember(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  function removeBanner() {
    const banner = document.querySelector(".cookie-banner");
    if (banner) banner.remove();
  }

  function showBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-banner__text">
        Nous utilisons des cookies de mesure d'audience pour comprendre l'usage du site.
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-cookie-choice="refuse">Refuser</button>
        <button type="button" class="cookie-banner__btn" data-cookie-choice="accept">Accepter</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.addEventListener("click", function (event) {
      const choice = event.target && event.target.getAttribute("data-cookie-choice");
      if (!choice) return;
      remember(choice);
      if (choice === "accept") loadGtm();
      removeBanner();
    });
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .cookie-banner{position:fixed;left:24px;right:24px;bottom:24px;z-index:500;background:#fff;color:#3E403A;border:1px solid rgba(62,64,58,.12);box-shadow:0 16px 48px rgba(0,0,0,.16);border-radius:10px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;font-family:'DM Sans',Arial,sans-serif;font-size:13px;line-height:1.5}
      .cookie-banner__text{max-width:720px}
      .cookie-banner__actions{display:flex;gap:10px;flex-shrink:0}
      .cookie-banner__btn{border:1px solid #C46210;background:#C46210;color:#fff;border-radius:999px;padding:9px 16px;font:600 12px 'DM Sans',Arial,sans-serif;cursor:pointer}
      .cookie-banner__btn--ghost{background:transparent;color:#2B5141;border-color:rgba(43,81,65,.24)}
      @media(max-width:640px){.cookie-banner{left:12px;right:12px;bottom:12px;align-items:stretch;flex-direction:column}.cookie-banner__actions{width:100%}.cookie-banner__btn{flex:1}}
    `;
    document.head.appendChild(style);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (consent === "accept") {
      loadGtm();
      return;
    }
    if (consent === "refuse") return;
    addStyles();
    showBanner();
  });
})();
