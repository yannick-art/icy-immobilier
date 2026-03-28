(function(){
  function initQuestions(){
    var answers=document.querySelectorAll('.question-a');
    for(var i=0;i<answers.length;i++){answers[i].style.display='none';}
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initQuestions);
  }else{initQuestions();}
  window.toggleQuestion=function(el){
    var item=el.parentElement;
    var answer=item.querySelector('.question-a');
    var wasOpen=item.classList.contains('open');
    var items=document.querySelectorAll('.question-item');
    for(var i=0;i<items.length;i++){
      items[i].classList.remove('open');
      var a=items[i].querySelector('.question-a');
      if(a)a.style.display='none';
    }
    if(!wasOpen){item.classList.add('open');if(answer)answer.style.display='block';}
  };
})();