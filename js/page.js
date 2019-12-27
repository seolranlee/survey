var Page = (function() {
    var winW, winH, scrollTop, scrollBottom, scrollLeft, secFullH, secFullLimitH;
    var seckv = $('#section-kv');
    var topH;

    var seckvH;

    // 반응형 디바이스 타입
    var oldDeviceType;
    var currentDeviceType;


    /*=========================================================== [ sec kv ] =======================================================================*/


    var seckv_init = function(){
    };
    var seckv_resize = function() {
    };

    var seckv_scroll = function() {
    };


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
        topH = $('#header').height();
        winW = $(window).width() <= 1280 ? 1280 : $(window).width();
        winH = $(window).height();
        topH = $('#header').height();
        secFullH = winH - topH;
        secFullLimitH = winH - topH <=1000 ? 1000 : winH - topH;
        seckvH = seckv.height();
        checkResponsiveType();
        seckv_resize();
        onScroll();
    };

    var onScroll = function(){
        scrollTop = ($(window).scrollTop()|| $('body').scrollTop());
        scrollLeft = ($(window).scrollLeft()|| $('body').scrollLeft());
        scrollBottom = scrollTop + winH;
        seckv_scroll();
    };

    /*=========================================================== [ init ] =======================================================================*/
    var _init = function(){
    };

    var _load_init = function(){
        addEvent();
        seckv_init();
        $('#content').addClass('onShow');
    };
    return{
        init:_init,
        load_init:_load_init
    }

})();

/*=========================================================== [ Grid/Box Debuging ] =======================================================================*/


/*=========================================================== [ ready / load ] =======================================================================*/


$(window).on('ready',function(){
    Motion.init();
    Page.init();
});
$(window).on('load',function(){
    Motion.load_init();
    Page.load_init();
});