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
        //设置关注信息
        setFollowStatus();
    }

    /**
     * 页面顶部提示消息显示
     * 为了保证用户体验，默认js文件加载完成前不显示，js加载完成后通过cookie判断决定是否显示
     */
    function setTopNotice() {
        var _topNoticeEl = document.querySelector(".public-top-notice");
        var _cookieName = "topNoticeHide";
        if (!!($.getCookie(_cookieName))) {
            _topNoticeEl.style.display = 'none';
        } else {
            _topNoticeEl.style.display = 'block';
            var _cancelBtn = document.querySelector(".public-top-notice .top-notice-cancel");
            $.addEventListener(_cancelBtn, 'click', _cancelBtnClickHandler);
            function _cancelBtnClickHandler() {
                $.removeEventListener(_cancelBtn, 'click', _cancelBtnClickHandler);
                //设置cookie
                $.setCookie(_cookieName, "true", 30);
                //同时隐藏顶部提示消息
                _topNoticeEl.style.display = 'none';
            }
        }
    }

    /**
     * 设置关注相关状态
     * 如果用户未登录，则需要先登录
     * 粉丝数没有给接口，所以暂时用假数据效果替代
     */
    function setFollowStatus() {
        var _cookieName = "followSuc";
        var _followToDoEl = document.querySelector('.public-header .header-follow .follow-todo');
        var _followDoneEl = document.querySelector('.public-header .header-follow .follow-done');
        var _followCancelBtn = document.querySelector('.public-header .header-follow .follow-cancel');
        var _fansTotalEl = document.querySelector('.public-header .header-follow .fans-total');
        //判断是否已关注,如果存在，则隐藏关注按钮
        if (!!($.getCookie(_cookieName))) {
            setFollowStatus(true);
        } else {
            setFollowStatus(false);
        }
        //添加关注按钮点击事件
        $.addEventListener(_followToDoEl, 'click', function () {
            //如果没有登录，则需要先登录
            if (!!($.getCookie('loginSuc'))) {
                //调用登录模块
                setFollowStatus(true);
                //设置cookie
                $.setCookie(_cookieName, "true", 30);
            } else {
                loginDialog(function () {
                    setFollowStatus(true);
                    //设置cookie
                    $.setCookie(_cookieName, "true", 30);
                });
            }
        });
        //添加取消关注按钮点击处理函数
        $.addEventListener(_followCancelBtn, 'click', function () {
            setFollowStatus(false);
        });
        //设置关注与否的相关样式
        function setFollowStatus(bool) {
            if (bool) {
                _followToDoEl.style.display = 'none';
                _followDoneEl.style.display = '';
                _fansTotalEl.innerHTML = "粉丝 46";
            } else {
                _followDoneEl.style.display = 'none';
                _followToDoEl.style.display = '';
                _fansTotalEl.innerHTML = "粉丝 45";
                //清除cookie
                $.setCookie(_cookieName, "", -1);
            }
        }
    }

    /**
     * 登录模块
     * @param {function} callback 登录成功后调用的回调函数
     */
    function loginDialog(callback) {
        //弹窗相关html结构
        var _loginDialogHtml =
            '<div class="dialog-bg ie-fixed"></div>' +
            '<div class="dialog-container">' +
            '<span class="btn-close">×</span>' +
            '<p class="login-title">登录网易云课堂</p>' +
            '<ul>' +
            '<li><input name="username" id="login-username" type="text" placeholder="账号" value=""></li>' +
            '<li><input name="password" id="login-password" type="password" placeholder="密码" value=""></li>' +
            '</ul>' +
            '<div class=" btn-login-submit btn-submit-gradient" id="btn-login-submit"></div>' +
            '</div>';

        //添加元素至body中
        var _div = document.createElement("div");
        _div.innerHTML = _loginDialogHtml;
        $.addClass(_div, "public-dialog");
        document.body.insertBefore(_div, document.body.firstChild);
        //当input元素中value发生变化时，如果value为空，则显示提示文本
        //添加valuechange监听事件
        var _loginUsrInput = document.querySelector('#login-username');
        var _loginPwdInput = document.querySelector('#login-password');
        var _loginSubmitBtn = document.querySelector("#btn-login-submit");
        var _loginCloseBtn = document.querySelector('.public-dialog .dialog-container .btn-close');
        $.addEventListener(_loginSubmitBtn, 'click', loginSubmitBtnClickHandler);
        $.addEventListener(_loginCloseBtn, 'click', loginCloseBtnClickHandler);
        //提交按钮点击处理函数
        function loginSubmitBtnClickHandler() {
            //简单的校验，保证两个输出框不为空,暂时不做相关弹窗的样式
            //默认使用浏览器自带alert
            if (_loginUsrInput.value == "" || _loginPwdInput.value == "") {
                alert('用户名或密码未输入!');
            } else {
                //请求参数,使用md5加密该用户数据
                var _data = {
                    userName: hex_md5(_loginUsrInput.value),
                    password: hex_md5(_loginPwdInput.value)
                };
                $.ajax({
                    type: "GET",
                    url: 'http://study.163.com/webDev/login.htm',
                    data: _data,
                    success: function (data) {
                        if (parseInt(data) == 1) {
                            //设置cookie
                            $.setCookie("loginSuc", "true", 30);
                            //移除相关事件
                            $.removeEventListener(_loginSubmitBtn, 'click', loginSubmitBtnClickHandler);
                            //移除弹窗层
                            document.body.removeChild(_div);
                            //调用回调函数
                            callback();
                        } else {
                            alert('登录失败，请确认您输入的用户名或密码是否正确!');
                        }
                    },
                    error: function () {
                        //默认使用浏览器自带alert
                        alert('登录失败，请确认您输入的用户名或密码是否正确!');
                    }
                });
            }
        }
        //登录框关闭按钮
        function loginCloseBtnClickHandler() {
            $.removeEventListener(_loginCloseBtn, 'click', loginCloseBtnClickHandler);
            //移除弹窗层
            document.body.removeChild(_div);
        }
    }

})();