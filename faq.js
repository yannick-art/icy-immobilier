(function(){
  function initFaq(){
    var answers=document.querySelectorAll('.faq-answer');
    for(var i=0;i<answers.length;i++){answers[i].style.display='none';}
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initFaq);
  }else{initFaq();}
  window.toggleFaq=function(el){
    var item=el.parentElement;
    var answer=item.querySelector('.faq-answer');
    var wasOpen=item.classList.contains('open');
    var items=document.querySelectorAll('.faq-item');
    for(var i=0;i<items.length;i++){
      items[i].classList.remove('open');
      var a=items[i].querySelector('.faq-answer');
      if(a)a.style.display='none';
    }
    if(!wasOpen){item.classList.add('open');if(answer)answer.style.display='block';}
  };
})();
