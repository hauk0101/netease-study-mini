/**
 * @author YaoQiao
 * @description  逻辑入口文件
 */

; (function () {
    //获取工具对象
    var $ = window.$ || {};
    //程序入口
    init();
    /**
     * 主页逻辑入口函数
     */
    function init() {
       //设置顶部提示消息
       setTopNotice();
    }

    /**
     * 页面顶部提示消息显示
     * 为了保证用户体验，默认js文件加载完成前不显示，js加载完成后通过cookie判断决定是否显示
     */
    function setTopNotice(){
        var _topNoticeEl = document.querySelector(".public-top-notice");
        var _cookieName = "topNoticeHide";
        if(!!($.getCookie(_cookieName))){
            _topNoticeEl.style.display = 'none';
        }else{
            _topNoticeEl.style.display = 'block';
            var _cancelBtn = document.querySelector(".public-top-notice .top-notice-cancel");
            $.addEventListener(_cancelBtn,'click',_cancelBtnClickHandler);
            function _cancelBtnClickHandler(){
                $.removeEventListener(_cancelBtn,'click',_cancelBtnClickHandler);
                //设置cookie
                $.setCookie(_cookieName,"true",30);
                //同时隐藏顶部提示消息
                _topNoticeEl.style.display = 'none';
            }
        }
    }

})();