(function(){
  window.envoyerFormulaire = function(formId){
    var form = document.getElementById(formId);
    if(!form) return;
    var inputs = form.querySelectorAll('input,select,textarea');
    var data = {source: formId, page: window.location.pathname};
    inputs.forEach(function(el){
      var key = el.id || el.name || el.placeholder;
      if(key) data[key] = el.value;
    });
    var webhookUrl = 'https://hook.eu1.make.com/jkvmdjx6wzez9aespn8jnl1ax48t9nu4';
    if(webhookUrl === 'WEBHOOK_MAKE_URL'){
      alert('Merci pour votre demande. Yannick vous recontactera sous 24h.');
      return;
    }
    fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(function(){ alert('Merci ! Votre demande a bien ete envoyee. Reponse sous 24h.'); })
    .catch(function(){ alert('Une erreur est survenue. Contactez-nous : contact@icy-immobilier.fr'); });
  };
})();
