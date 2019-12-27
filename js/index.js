(function () {
  var root = document.querySelector('.app-root');
  var navigation = document.getElementById('navigation');

  var answers = {
    "q1": false,
    "q2": [],
    "q3": ""
  };

  var routes = {
    'home': function () {
      get('/data/intro.html').then(renderHtml).then(addEvent);
    },
    'step1': function () {
      get('/data/step1.html').then(renderHtml).then(addEvent);
    },
    'step2': function () {
      get('/data/step2.html').then(renderHtml).then(addEvent);
    },
    'step3': function () {
      get('/data/step3.html').then(renderHtml).then(addEvent);
    },
    'complete': function () {
      get('/data/complete.html').then(renderHtml).then(addEvent);
    },
    otherwise(page) {
      root.innerHTML = `${page} Not Found`;
    }
  };
  function router(page) {
    (routes[page] || routes.otherwise)(page);
  }

  function toJson(data){
    return JSON.stringify(data)
  }

  function render(data) {
    const json = JSON.parse(data);
    root.innerHTML = `<h1>${json.title}</h1><p>${json.content}</p>`;
  }

  function renderHtml(html) {
    root.innerHTML = html;

    // step1
    $(":radio[name=use]").click(function(){
      if($(':radio[name=use]:checked').length > 0){
        $('#step2').attr( 'disabled', false);
      }
    });
    $("#step2").click(function(){
      answers['q1'] = $(':radio[name=use]:checked').val();
      // console.log(JSON.stringify(answers));
    });

    // step2
    $(":checkbox[name=reason]").click(function(){

      if($(':checkbox[name=reason]:checked').length > 3){
        alert('최대 3개까지만 선택하실 수 있습니다.');
        return false;
      }else if($(':checkbox[name=reason]:checked').length > 0){
        $('#step3').attr( 'disabled', false);
      }else if($(':checkbox[name=reason]:checked').length === 0){
        $('#step3').attr( 'disabled', true);
      }


      if($(this).val() === '기타'){
        if($(this).is(":checked")) $(this).siblings('textarea').css('display','block');
        else $(this).siblings('textarea').css('display','none')
      }


    });

    $("#step3").click(function(){
      for(var i=0; i<$(':checkbox[name=reason]:checked').length; i++){
        if($(':checkbox[name=reason]:checked').eq(i).val() === '기타') answers['q2'][i] = $('textarea').val();
        else answers['q2'][i] = $(':checkbox[name=reason]:checked').eq(i).val();
      }
      // console.log(answers);
    });

    $("#complete").click(function(){

      answers['q3'] = $('textarea[name=freeopinion]').val();
      console.log(toJson(answers));
    });


  }

  function addEvent(){
    $('input[type=submit]').on('click', e => {
      e.preventDefault();
      router(e.target.id);
    });
  }
  function get(url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.send();
      req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) resolve(req.response);
          else reject(req.statusText);
        }
      };
    });
  }





  // AJAX 요청은 주소창의 url을 변경시키지 않으므로 history 관리가 되지 않는다.
  navigation.addEventListener('click', e => {
    if (!e.target || e.target.nodeName !== 'A') return;
    e.preventDefault();
    router(e.target.id);
  });


  // DOMContentLoaded은 HTML과 script가 로드된 시점에 발생하는 이벤트로 load 이벤트보다 먼저 발생한다. (IE 9 이상 지원)
  // 새로고침이 클릭되었을 때, 웹페이지가 처음 로딩되었을 때, 현 페이지(예를들어 loclahost:5002)를 서버에 요청한다. 이때 Home에 필요한 리소스를 Ajax 요청한다.
  window.addEventListener('DOMContentLoaded', () => router('home'));
}());
