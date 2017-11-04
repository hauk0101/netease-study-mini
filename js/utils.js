/**
 * @author YaoQiao
 * @description 工具类，用原生js封装一些常用的方法
 */

; (function () {
    var Utils = {};
    /**
     * 获取浏览器cookie数据，key-value键值对
     * @param name 需要获取的key值名称
     * @return 返回的value值
     */
    Utils.getCookie = function (name) {
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        var arr = document.cookie.match(reg);
        if (arr) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    };
    /**
     * 设置cookie
     * @param c_name 需要设置的cookie名称
     * @param value 需要设置的cookie值
     * @param expiredays 需要设置的cookie有效时间
     */
    Utils.setCookie = function (c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString());
    };

    /**
     * 添加事件监听方法，兼容IE8
     * @param el 需要添加事件监听的DOM对象
     * @param eventName 事件名称
     * @param handler 回调函数
     */
    Utils.addEventListener = function (el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function () {
                handler.call(el);
            });
        }
    };

    /**
     * 移除事件监听方法，兼容IE8
     * @param el 需要移除事件监听的DOM对象
     * @param eventName 事件名称
     * @param handler 回调函数
     */
    Utils.removeEventListener = function (el, eventName, handler) {
        if (el.removeEventListener) {
            el.removeEventListener(eventName, handler);
        } else {
            el.detachEvent('on' + eventName, handler);
        }
    };

    window.$ = Utils;
})();