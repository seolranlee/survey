/**
 * -----------------------------------------------------
 * Created by uforgot on 2018. 3. 19.
 * designsamsung_2018
 * -----------------------------------------------------
 */

var Motion = (function() {
    var topH = 70;

    var motionElObjectArray = [];
    var scrollTop, scrollLeft, scrollBottom;
    var winW, winH,isMobile;

    function evil(fn) {
        return new Function('return ' + fn)();
    }

    var initMotionEl = function() {
        var motionEl = $('.motion');
        var tmpEl, tmpObj;
        // motionElObjectArray

        for (var i=0;i<motionEl.length;i++) {
            tmpEl = $(motionEl[i]);

            tmpObj = {
                el:tmpEl,
                pos:tmpEl.attr('motion-pos'),
                pos_m:tmpEl.attr('motion-pos-m'),
                toggle:tmpEl.attr('motion-class'),
                debug:tmpEl.attr('debug'),
                self : tmpEl.attr('motion-hide-self')
            };

            motionElObjectArray.push(tmpObj);
        }

        //console.log(motionElObjectArray);
    };

    var getTop = function($el) {
        console.log($el)
        var attr = $el.attr('motion-top').trim();
        attr = attr.replace('height', $el.height());
        return parseInt(evil(attr));
    };

    var setMotionEl = function() {
        var i;
        var tmpObject;
        for (i=0;i<motionElObjectArray.length;i++) {
            tmpObject = motionElObjectArray[i];
            setAddMotionClass(tmpObject);
        }
    };

    var setAddMotionClass = function ($obj) {
        var el = $obj.el;
        var po = isMobile && $obj.pos_m ? $obj.pos_m : $obj.pos;
        var pos = po ? po.trim() : 0;
        var className = $obj.toggle ? $obj.toggle : 'onTrans'
        var pos_judge = el.height() < parseInt(el.css('padding-top')) ? el.offset().top +  parseInt(el.css('padding-top'))*pos : el.offset().top + el.height()*pos;

        if ($obj.debug === '1') {
            console.log(el + ' : ' + el.height() + " :: ", parseInt(el.css('padding-top')));
        }

        if(scrollBottom >= pos_judge) {
            el.addClass(className);
        }else{
            /*if (scrollBottom < $el.offset().top) {
                $el.removeClass(className);
            }*/
            if (scrollBottom < el.parents('section').offset().top) {
                el.removeClass(className);
            }
        }
    };

    var setRemoveMotionClass = function ($el, $className) {
        $el.removeClass($className);
    };

    // temp - related storied
    var related_stories_scroll = function(){
        if(scrollBottom >= $('.related-stories-wrap .component-list').offset().top +  $('.related-stories-wrap .component-list').height()*0.75) {
            $('.related-stories-wrap .component-list').addClass('onTrans');
        }
        if (scrollBottom < $('.related-stories-wrap .component-list').offset().top) {
            $('.related-stories-wrap .component-list').removeClass('onTrans');
        }
    };

    /*=========================================================== [ event ] =====================================================================*/
    var resize = function() {
        winW = $(window).width() <= 1280 ? 1280 : $(window).width();
        winH = $(window).height();
        isMobile = $(window).width() < 767.7 ? true : false;
    };

    var onScroll = function(){
        scrollTop = ($(window).scrollTop()|| $('body').scrollTop());
        scrollLeft = ($(window).scrollLeft()|| $('body').scrollLeft());
        scrollBottom = scrollTop + winH;
        //console.log(scrollBottom)
        setMotionEl();

        // temp - related storied
        //related_stories_scroll();
    };

    var onResize = function(){
        resize();
        onScroll();
    };

    var addEvent = function() {
        $(window).on('resize',onResize);
        $(window).on('scroll',onScroll);
    };

    /*=========================================================== [ init ] =====================================================================*/

    var _init = function(){
        initMotionEl();
        addEvent();
        onResize();
    };

    var _load_init = function(){

    };
    return{
        init:_init,
        load_init:_load_init
    }

})();

