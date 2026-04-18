// ICY Immobilier — Form handler → ICY OS via Supabase RPC
// Remplace le webhook Make par un appel direct à l'OS

const ICY_OS_CONFIG = {
  supabaseUrl: "https://kwuiivaqvkopcxfecway.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3dWlpdmFxdmtvcGN4ZmVjd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTU2MzAsImV4cCI6MjA5MTMzMTYzMH0.M36nQmxU-qctN-2r4QTAuRTMuohgbw9OulNY18rIW7k",
  skinId: "icy_immobilier",
};

function envoyerFormulaire(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  // --- Validation ---
  let valid = true;

  form.querySelectorAll("input[required], select[required], textarea[required]").forEach((el) => {
    if (!el.value || el.value.trim() === "") {
      el.style.borderColor = "#C46210";
      valid = false;
    } else {
      el.style.borderColor = "";
    }
  });

  // Validation radio "etat" (si présent)
  const radiosEtat = form.querySelectorAll('input[name="etat"]');
  if (radiosEtat.length > 0) {
    const etatChecked = form.querySelector('input[name="etat"]:checked');
    if (!etatChecked) {
      radiosEtat.forEach((r) => (r.closest(".f-radio").style.borderColor = "#C46210"));
      valid = false;
      alert("Merci de sélectionner l'état du bien.");
      return;
    } else {
      radiosEtat.forEach((r) => (r.closest(".f-radio").style.borderColor = ""));
    }
  }

  if (!valid) {
    alert("Merci de remplir tous les champs obligatoires.");
    return;
  }

  // --- Collecter les données ---
  const formData = {};

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    const key = el.id || el.name || el.placeholder;
    if (!key) return;

    if (el.type === "radio") {
      if (el.checked) formData[el.name] = el.value;
    } else {
      formData[key] = el.value;
    }
  });

  // Déterminer la source
  let source = "contact";
  if (formId === "form-estimation") source = "estimation";
  else if (formId === "form-contact") source = "contact";
  else if (formId === "form-radar") source = "icy-radar";
  else if (formId === "form-direct") source = "icy-direct";

  formData._source = source;
  formData._page = window.location.pathname;
  formData._timestamp = new Date().toISOString();

  // --- Anti-spam basique : 1 soumission par 30s ---
  const lastSubmit = sessionStorage.getItem("icy_last_submit");
  if (lastSubmit && Date.now() - parseInt(lastSubmit) < 30000) {
    alert("Merci de patienter quelques secondes avant de renvoyer le formulaire.");
    return;
  }

  // --- Envoyer à ICY OS ---
  const btn = form.querySelector(".btn-submit");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Envoi en cours...";
  }

  // Envoi principal → ICY OS via Supabase
  fetch(`${ICY_OS_CONFIG.supabaseUrl}/rest/v1/rpc/web_intake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ICY_OS_CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${ICY_OS_CONFIG.supabaseAnonKey}`,
    },
    body: JSON.stringify({
      skin_id_param: ICY_OS_CONFIG.skinId,
      source: source,
      form_data: formData,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error("ICY OS error, fallback Make:", data.error);
        return fallbackMake(formData, source);
      }
      showConfirmation(form, formData.prenom);
    })
    .catch((err) => {
      console.error("Supabase down, fallback Make:", err);
      return fallbackMake(formData, source);
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = formId === "form-estimation" ? "Recevoir mon estimation gratuite →" : "Prendre un rendez-vous →";
      }
    });
}

// Fallback Make — si Supabase est indisponible, le lead part par email
function fallbackMake(formData, source) {
  const sourceLabel = source === "estimation" ? "Site /estimation" : source === "contact" ? "Site /contact" : "Site /" + source;
  return fetch("https://hook.eu1.make.com/jkvmdjx6wzez9aespn8jnl1ax48t9nu4", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, source: sourceLabel }),
  })
    .then(() => {
      showConfirmation(document.querySelector(".form-card"), formData.prenom);
    })
    .catch((err2) => {
      console.error("Make fallback also failed:", err2);
      alert("Erreur de connexion. Appelez-nous au 06 XX XX XX XX ou envoyez un email à contact@icy-immobilier.fr");
    });
}

function showConfirmation(form, prenom) {
  sessionStorage.setItem("icy_last_submit", String(Date.now()));
  if (form) {
    form.innerHTML = `
      <div style="text-align:center; padding: 2rem;">
        <h3 style="color:#1a1a1a;">Merci ${prenom || ""} !</h3>
        <p style="color:#555; margin-top:1rem;">
          Votre demande a bien été envoyée.<br>
          Nous vous répondons sous 24h.
        </p>
      </div>
    `;
  }
}
