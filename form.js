(function(){
  window.envoyerFormulaire = function(formId, redirectUrl){
    var form = document.getElementById(formId);
    if(!form) return;

    var ok = true;

    form.querySelectorAll('input[required]:not([type="radio"]),select[required],textarea[required]').forEach(function(el){
      if(!el.value.trim()){
        ok = false;
        el.style.borderColor = '#C46210';
        el.addEventListener('input', function(){ el.style.borderColor = ''; }, {once:true});
      } else { el.style.borderColor = ''; }
    });

    var rGroups = {};
    form.querySelectorAll('input[type="radio"][required]').forEach(function(r){
      if(!rGroups[r.name]) rGroups[r.name] = [];
      rGroups[r.name].push(r);
    });
    Object.keys(rGroups).forEach(function(n){
      var checked = rGroups[n].some(function(r){ return r.checked; });
      if(!checked){
        ok = false;
        rGroups[n].forEach(function(r){ var l=r.closest('label'); if(l) l.style.borderColor='#C46210'; });
      }
    });

    if(!ok){ alert('Merci de remplir tous les champs obligatoires.'); return; }

    var sourceLabel = formId==='form-estimation' ? 'Site /estimation' :
                      formId==='form-contact'    ? 'Site /contact'    : 'Autre';
    var data = { source: sourceLabel, page: window.location.pathname };

    form.querySelectorAll('input,select,textarea').forEach(function(el){
      if(el.type==='radio' && !el.checked) return;
      var key = el.id || el.name || el.placeholder;
      if(key) data[key] = el.value;
    });

    var params = new URLSearchParams();
    Object.keys(data).forEach(function(k){ params.append(k, data[k]); });

    fetch('https://hook.eu1.make.com/jkvmdjx6wzez9aespn8jnl1ax48t9nu4', {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).catch(function(e){ console.error('Webhook error:', e); });

    alert('Merci ! Votre demande a bien ete envoyee. Reponse sous 24h.');
    if(redirectUrl) setTimeout(function(){ window.open(redirectUrl, '_blank'); }, 300);
  };
})();
