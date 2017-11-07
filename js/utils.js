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

    /**
     * 为元素添加类名
     * @param el 需要添加类名的元素
     * @param className 需要添加的类名
     */
    Utils.addClass = function (el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };

    /**
     * 为元素移除类名
     * @param el 需要移除类名的元素
     * @param className 需要移除的类名
     */
    Utils.removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    /**
     * ajax数据请求
     * @param {} 请求时需要传入的对象
     * @description 用法示例
     * ajax({ 
     *  type:"POST", //请求类型
     *  url:"请求接口地址", 
     *  dataType:"json", 
     *  data:{"val1":"abc","val2":123,"val3":"456"}, 
     *  beforeSend:function(){ 
     *      //some js code 
     *  }, 
     *  success:function(data){ 
     *      console.log(data) 
     *  }, 
     *  error:function(){ 
     *      console.log("error") 
     *  } 
     *  })
     */
    Utils.ajax = function () {
        var ajaxData = {
            type: arguments[0].type || "GET",
            url: arguments[0].url || "",
            async: arguments[0].async || "true",
            data: arguments[0].data || null,
            dataType: arguments[0].dataType || "text",
            contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend: arguments[0].beforeSend || function () { },
            success: arguments[0].success || function () { },
            error: arguments[0].error || function () { }
        };
        ajaxData.beforeSend();
        var xhr = createxmlHttpRequest();
        if (ajaxData.type == "GET" || ajaxData.type == "get") {

            for (var d in ajaxData.data) {
                ajaxData.url = addURLParam(ajaxData.url, d, ajaxData.data[d]);
            }
            xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
            xhr.send(null);
        } else if (ajaxData.type == "POST" || ajaxData.type == "post") {
            xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
            xhr.setRequestHeader("content-type", ajaxData.contentType);
            xhr.send(convertData(ajaxData));
        }
        //获取请求结果
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (200 <= xhr.status && xhr.status < 300 || xhr.status == 304) {
                    var _data = xhr.response;
                    if (ajaxData.dataType == 'json') {
                        _data = JSON.parse(_data);
                    }
                    ajaxData.success(_data);
                } else {
                    ajaxData.error();
                }
            }
        };
        //为get请求方式添加参数
        function addURLParam(url, name, value) {
            url += (url.indexOf("?") == -1 ? "?" : "&");
            url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
            return url;
        }
        //创建xhr对象
        function createxmlHttpRequest() {
            var _xhr = null;
            try {
                //IE浏览器
                _xhr = new ActiveXObject('microsoft.xmlhttp');
            } catch (e) {
                try {
                    _xhr = new XMLHttpRequest();
                } catch (error) {
                    window.alert("您的浏览器不支持ajax,请升级或更换！");
                }
            }
            return _xhr;
        }
        //为post请求方式添加参数
        function convertData(data) {
            if (typeof data === 'object') {
                var convertResult = "";
                for (var c in data) {
                    convertResult += c + "=" + data[c] + "&";
                }
                convertResult = convertResult.substring(0, convertResult.length - 1);
            } else {
                return data;
            }
        }
    };

    /**
     * 元素淡入效果
     * @param el 需要淡入效果的元素
     * @param time 需要淡入效果的时间
     */
    Utils.fadeIn = function (el, time, callback) {
        var opacity = 0;
        el.style.display = "";
        el.style.opacity = 0;
        el.style.filter = '';
        var last = +new Date();
        //防止分母time出现0
        time = (time == 0) ? 1 : time;
        var tick = function () {
            opacity += (new Date() - last) / time;
            el.style.opacity = opacity;
            el.style.filter = 'alpha(opacity=' + (100 * opacity) | 0 + ')';
            last = +new Date();
            if (opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16));
            } else {
                el.style.opacity = 1;
                el.style.filter = 'alpha(opacity=100)';
                if (callback) callback();
            }
        };
        tick();
    };
    /**
     * 元素淡出效果
     * @param el 需要淡出效果的元素
     * @param time 需要淡出效果的时间
     */
    Utils.fadeOut = function (el, time, callback) {
        var opacity = 1;
        el.style.opacity = 1;
        el.style.filter = 'alpha(opacity=100)';
        //防止分母time出现0
        time = (time == 0) ? 1 : time;
        var last = +new Date();
        var tick = function () {
            opacity -= (new Date() - last) / time;
            el.style.opacity = opacity;
            el.style.filter = 'alpha(opacity=' - (100 * opacity) | 0 + ')';
            last = +new Date();
            if (opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16));
            } else {
                el.style.opacity = 0;
                el.style.filter = 'alpha(opacity=0)';
                el.style.display = "none";
                if (callback) callback();
            }
        };
        tick();
    };

    /**
     * 将数组里的元素变为随机顺序
     * @param {*} dataArray  传入需要打乱元素顺序的数组
     * @return [] 返回打乱元素顺序的数组
     */
    Utils.shuffle = function (dataArray) {
        var currentIndex = dataArray.length,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = dataArray[currentIndex];
            dataArray[currentIndex] = dataArray[randomIndex];
            dataArray[randomIndex] = temporaryValue;
        }
        return dataArray;
    };

    window.$ = Utils;
})();