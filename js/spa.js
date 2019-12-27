var Page = (function() {
    var winW, winH, scrollTop, scrollBottom, scrollLeft, secFullH, secFullLimitH;
    var topH;

    var fixedScrollTop, getFixedScrollTop;
    var root = document.querySelector('.app-root');

    // data
    var answers = {
        "q1": false,
        "q2": [],
        "q3": ""
    };

    // router
    var routes = {
        'intro': function () {
            get('/data/intro.html').then(renderHtml).then(clickEvent);
        },
        'step1': function () {
            get('/data/step1.html').then(renderHtml).then(clickEvent);
        },
        'step2': function () {
            get('/data/step2.html').then(renderHtml).then(clickEvent);
        },
        'step3': function () {
            get('/data/step3.html').then(renderHtml).then(clickEvent);
        },
        'complete': function () {
            get('/data/complete.html').then(renderHtml).then(clickEvent);
        },
        otherwise(page) {
            root.innerHTML = `${page} Not Found`;
        }
    };

    // 반응형 디바이스 타입
    var oldDeviceType;
    var currentDeviceType;

    var _setFixed = function() {
        var time=0;
        fixedScrollTop = scrollTop;
        $('body').addClass('fixed');
        $('body').stop().animate({
            'margin-top': -fixedScrollTop
        }, time);
        getFixedScrollTop = fixedScrollTop;
    };

    var _removeFixed = function() {
        $('body').removeClass('fixed');
        $('body').css('margin-top' ,0);
        $('html, body').stop().animate({
            scrollTop: fixedScrollTop
        }, 0,function() {
        });
        getFixedScrollTop = 0;

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
                _setFixed();
                $('.common-modal').fadeIn('fast');
                $('.common-backdrop').fadeIn('fast');
                return false;
            }else if($(':checkbox[name=reason]:checked').length > 0){
                $('#step3').attr( 'disabled', false);
            }else if($(':checkbox[name=reason]:checked').length === 0){
                $('#step3').attr( 'disabled', true);
            }


            if($(this).val() === '기타'){
                if($(this).is(":checked")) $(this).parents('.form-check').siblings('.text-area').slideDown('fast');
                else $(this).parents('.form-check').siblings('.text-area').slideUp('fast');
            }


        });

        // modal
        $('.modal-close-btn').on('click', function (e) {
            e.preventDefault();
            $('.common-modal').fadeOut('fast');
            $('.common-backdrop').fadeOut('fast');
            _removeFixed();
        });

        $('.common-backdrop').on('click', function (e) {
            e.preventDefault();
            $('.common-modal').fadeOut('fast');
            $('.common-backdrop').fadeOut('fast');
            _removeFixed();
        });

        // step3
        $("#step3").click(function(){
            for(var i=0; i<$(':checkbox[name=reason]:checked').length; i++){
                if($(':checkbox[name=reason]:checked').eq(i).val() === '기타') answers['q2'][i] = $('textarea').val();
                else answers['q2'][i] = $(':checkbox[name=reason]:checked').eq(i).val();
            }
            // console.log(answers);
        });

        $("#complete").click(function(){
            answers['q3'] = $('#opinion').val();
            console.log(toJson(answers));
        });


    }

    function clickEvent(){
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

    /*=========================================================== [ sec kv ] =======================================================================*/

    //
    // var seckv_init = function(){
    // };
    // var seckv_resize = function() {
    // };
    //
    // var seckv_scroll = function() {
    // };


    /*=========================================================== [ removeClass ] =======================================================================*/

    function removeClass( target, className ){
        target.addClass('noTransition');
        target[0].offsetHeight;
        target.removeClass('noTransition');
        target.removeClass(className);
    }



    /*=========================================================== [ addevent ] =======================================================================*/
    var checkResponsiveType = function(){
        winW = (window.innerWidth || document.documentElement.clientWidth);
        oldDeviceType = currentDeviceType;

        if(winW < 767.3){
            currentDeviceType = 'mobile';
        }else {
            currentDeviceType = 'pc';
        }
    };

    var addEvent = function(){
        $(window).on('resize',onResize);
        $(window).on('scroll',onScroll);
        onResize();

    };
    var onResize = function(){
        winW = $(window).width() <= 1280 ? 1280 : $(window).width();
        winH = $(window).height();
        secFullH = winH - topH;
        secFullLimitH = winH - topH <=1000 ? 1000 : winH - topH;
        checkResponsiveType();
        onScroll();
    };

    var onScroll = function(){
        scrollTop = ($(window).scrollTop()|| $('body').scrollTop());
        scrollLeft = ($(window).scrollLeft()|| $('body').scrollLeft());
        scrollBottom = scrollTop + winH;
    };

    /*=========================================================== [ init ] =======================================================================*/
    var _init = function(){
    };

    var _load_init = function(){
        $('#content').addClass('onShow');
        router('intro');
        addEvent();
    };
    return{
        router: router,
        init:_init,
        load_init:_load_init
    }

})();

/*=========================================================== [ ready / load ] =======================================================================*/


$(window).on('ready',function(){
    // Motion.init();
    Page.init();
});
$(window).on('load',function(){
    // Motion.load_init();
    Page.load_init();
});
