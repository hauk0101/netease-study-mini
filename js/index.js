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
        //设置轮播图效果
        setBannerEffect();
        //设置内容区域数据
        setContentData();
        //设置视频模块
        setVideoPlay();
        //设置最热排行模块
        setHotRank();
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

    /**
     * 设置Banner图轮播效果
     */
    function setBannerEffect() {
        var _bannerList = document.querySelectorAll('.index-banner .banner-slide');
        var _silderList = document.querySelectorAll('.index-banner .slider-panel .slider');
        var _changeTime = 5000, _fadeTime = 500;
        var _currentIndex = 0;
        var _silderSelectedClassName = 'slider-selected';
        var _bannerPauseChange = false;
        //默认开始隐藏全部banner，并只显示第一个banner 
        hideAllBanner(function () {
            $.fadeIn(_bannerList[_currentIndex], 0);
        });
        //默认开始隐藏全部silder选中状态,并只显示第一个
        hideAllSlider();
        $.addClass(_silderList[_currentIndex], _silderSelectedClassName);
        //开启定时器
        var _intervalIndex = setInterval(changeBanner, _changeTime);
        //改变banner图
        function changeBanner() {
            if (!_bannerPauseChange) {
                $.fadeOut(_bannerList[_currentIndex], 0, null);
                _currentIndex++;
                _currentIndex = (_currentIndex >= _bannerList.length) ? 0 : _currentIndex;
                $.fadeIn(_bannerList[_currentIndex], _fadeTime, null);
                hideAllSlider();
                $.addClass(_silderList[_currentIndex], _silderSelectedClassName);
            }
        }
        //为silder添加点击事件
        for (var i = 0; i < _silderList.length; i++) {
            _silderList[i]._currentIndex = i;
            $.addEventListener(_silderList[i], 'click', function () {
                _bannerPauseChange = true;
                setCurrentBanner(this._currentIndex);
            });
        }

        //为每个banner添加鼠标移入移出事件
        for (var i = 0; i < _bannerList.length; i++) {
            var _b = _bannerList[i];
            $.addEventListener(_b, 'mouseover', function () {
                _bannerPauseChange = true;
            });
            $.addEventListener(_b, 'mouseout', function () {
                _bannerPauseChange = false;
            });
        }

        //设置当前Banner显示
        function setCurrentBanner(currentIndex) {
            _currentIndex = currentIndex;
            hideAllBanner(function () {
                $.fadeIn(_bannerList[_currentIndex], _fadeTime, null);
                _bannerPauseChange = false;
            });
            hideAllSlider();
            $.addClass(_silderList[_currentIndex], _silderSelectedClassName);
        }

        //隐藏全部banner
        function hideAllBanner(callback) {
            for (var i = 0; i < _bannerList.length; i++) {
                if (callback) {
                    if (i == _bannerList.length - 1) {
                        $.fadeOut(_bannerList[i], 0, callback);
                    }
                    else {
                        $.fadeOut(_bannerList[i], 0, null);
                    }
                } else {
                    $.fadeOut(_bannerList[i], 0, null);
                }
            }
        }
        //隐藏全部silder
        function hideAllSlider() {
            for (var i = 0; i < _silderList.length; i++) {
                $.removeClass(_silderList[i], _silderSelectedClassName);
            }
        }
    }

    /**
     * 设置视频播放模块
     */
    function setVideoPlay() {
        var _videoDialogOpenBtn = document.querySelector('.index-content .index-content-right .introduce-video-play');
        $.addEventListener(_videoDialogOpenBtn, 'click', function () {
            showVidoeDialog();
        });

    }
    /**
     * 视频播放器弹窗
     */
    function showVidoeDialog() {
        var _videoDialogHtml = '<div class="dialog-bg ie-fixed"></div>' +
            '<div class="dialog-container video-container">' +
            '<span class="btn-close">×</span>' +
            '<p class="video-title">请观看下面的视频</p>' +
            '<div class="video-panel">' +
            '<video width="891" height="593" controls poster="./img/img-video-poster.jpg">' +
            '<source src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4" type="video/mp4">' +
            '<p>您的浏览器不支持播放器标签，请更换浏览器打开或升级浏览器！</p>' +
            '</video>' +
            '<div class="btn-video-play">' +
            '<img src="./img/btn-video-play.png">' +
            '</div>' +
            '</div>' +
            '</div>';
        //添加元素至body中
        var _div = document.createElement("div");
        _div.innerHTML = _videoDialogHtml;
        $.addClass(_div, "public-dialog");
        document.body.insertBefore(_div, document.body.firstChild);
        var _playBtn = document.querySelector('.public-dialog .video-panel .btn-video-play');
        var _closeBtn = document.querySelector('.public-dialog .dialog-container .btn-close');
        //如果浏览器不支持video标签，则隐藏_playBtn
        if (!!(document.createElement('video').canPlayType)) {
            var _videoEl = document.querySelector('.public-dialog .video-panel video');
            $.addEventListener(_videoEl, 'play', function () {
                //视频播放时，隐藏播放按钮
                _playBtn.style.display = 'none';
            });
            $.addEventListener(_videoEl, 'pause', function () {
                //视频播放时，隐藏播放按钮
                _playBtn.style.display = '';
            });
            $.addEventListener(_playBtn, 'click', function () {
                _videoEl.play();
                _playBtn.style.display = 'none';
            });
        } else {
            _playBtn.style.display = 'none';
        }

        //登录框关闭按钮
        $.addEventListener(_closeBtn, 'click', loginCloseBtnClickHandler);
        function loginCloseBtnClickHandler() {
            $.removeEventListener(_closeBtn, 'click', loginCloseBtnClickHandler);
            //移除弹窗层
            document.body.removeChild(_div);
        }
    }

    /**
     * 设置最热排行
     */
    function setHotRank() {
        var _rankContainer = document.querySelector('.index-content .index-content-right .hot-rank .right-content');
        var _rankHotItems = [];
        var _dataList = [];
        var _rankContainerHtml = '';
        //请求数据
        $.ajax({
            url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                _dataList = $.shuffle(data);
                for (var i = 0; i < 10; i++) {
                    _rankContainerHtml += createHotRankItem(_dataList[i]);
                }
                _rankContainer.innerHTML = _rankContainerHtml;
                _rankHotItems = _rankContainer.querySelectorAll('.hot-course');
                //排行榜滚动效果
                changeRankHotItemEffect(_rankHotItems, _dataList);
            }
        });

        //排行榜变化效果
        function changeRankHotItemEffect(items, dataList) {
            var _index = 0, _length = dataList.length;
            setInterval(function () {
                var _tmpIndex;
                for (var i = 0, _len = items.length; i < _len; i++) {
                    _tmpIndex = ((_index + i) >= _length) ? ((_index + i) % _length) : (_index + i);
                    updateHotRankItem(items[i], dataList[_tmpIndex]);
                }
                _index++;
                _index = (_index == _length) ? 0 : _index;
            }, 5000);
        }


        //根据传入数据，更新已有的最热排行item
        function updateHotRankItem(item, data) {
            var _imgEl = item.querySelector('img');
            var _nameEl = item.querySelector('.hot-course-desc .course-name');
            var _hotEl = item.querySelector('.hot-course-desc .course-hot');
            _imgEl.src = data.smallPhotoUrl;
            _nameEl.innerHTML = data.name;
            _hotEl.innerHTML = data.learnerCount;
        }
        //根据传入数据，创建最热排行的item
        function createHotRankItem(data) {
            var _item = '<div class="hot-course">' +
                '<img src="' + data.smallPhotoUrl + '">' +
                '<div class="hot-course-desc">' +
                '<p class="course-name">' + data.name + '</p>' +
                '<p class="course-hot">' + data.learnerCount + '<p>' +
                '</div>' +
                '</div>';
            return _item;
        }
    }

    /**
     * 设置内容区域数据
     */
    function setContentData() {
        var _productDesignTab = document.querySelector("#product-design");
        var _programLanguageTab = document.querySelector("#program-language");
        var _pageinationContainerEl = document.querySelector('.index-content .index-content-left .content-pagination-container');
        var _courseContentContainerEl = document.querySelector('.index-content .index-content-left .content-container');
        var _pageinationItemList = [], _courseContentItemList = [];
        var _pageinationLeftBtn, _pageinationRightBtn;
        var _courseType = 10;

        var _currentPageinateIndex = 1;
        //设置默认数据
        getCourseData({ pageNo: 1, psize: 20, type: _courseType }, function (data) {
            //设置分页器
            setPageinationItem(data);
            // 设置课程内容
            updateCourseData({
                pageNo: _currentPageinateIndex,
                psize: 20,
                type: _courseType
            });
        });

        //设置分页器
        function setPageinationItem(data) {
            //设置分页器页码
            var _pageinationCount = data.pagination.totlePageCount;
            createPageination(_pageinationCount);
            //判断当前页码是否为第1个或最后1个，并作出相关设置
            $.removeClass(_pageinationLeftBtn, 'disabled');
            $.removeClass(_pageinationRightBtn, 'disabled');
            if (_currentPageinateIndex == 1) {
                $.addClass(_pageinationLeftBtn, 'disabled');
            } else if (_currentPageinateIndex == _pageinationCount) {
                $.addClass(_pageinationRightBtn, 'disabled');
            }
            //设置分页器点击事件
            _currentPageinateIndex = 1;
            for (var i = 0, len = _pageinationItemList.length; i < len; i++) {
                $.addEventListener(_pageinationItemList[i], 'click', pageinationItemClickHandle);
            }
            //设置分页器左右箭头点击事件
            $.addEventListener(_pageinationLeftBtn, 'click', function (evt) {
                //判断左箭头按钮是否可点击
                if ($.hasClass(evt.target, 'disabled')) return;
                //当前页码-1，并设置数据
                _currentPageinateIndex -= 1;
                //清除原有页码选中样式
                clearPageinationItemSelectEffect(_pageinationItemList);
                var _item = _pageinationItemList[_currentPageinateIndex - 1];
                //设置当前页码元素为选中状态
                $.addClass(_item, 'tab-item-select');
                $.removeClass(_pageinationLeftBtn, 'disabled');
                $.removeClass(_pageinationRightBtn, 'disabled');
                if (_currentPageinateIndex == 1) {
                    $.addClass(_pageinationLeftBtn, 'disabled');
                } else if (_currentPageinateIndex == _pageinationItemList.length) {
                    $.addClass(_pageinationRightBtn, 'disabled');
                } 
                // 设置课程内容
                updateCourseData({
                    pageNo: _currentPageinateIndex,
                    psize: 20,
                    type: _courseType
                });
            });
            $.addEventListener(_pageinationRightBtn, 'click', function (evt) {
                //判断左箭头按钮是否可点击
                if ($.hasClass(evt.target, 'disabled')) return;
                //当前页码+1，并设置数据
                _currentPageinateIndex += 1;
                //清除原有页码选中样式
                clearPageinationItemSelectEffect(_pageinationItemList);
                var _item = _pageinationItemList[_currentPageinateIndex - 1];
                //设置当前页码元素为选中状态
                $.addClass(_item, 'tab-item-select');
                $.removeClass(_pageinationLeftBtn, 'disabled');
                $.removeClass(_pageinationRightBtn, 'disabled');
                if (_currentPageinateIndex == 1) {
                    $.addClass(_pageinationLeftBtn, 'disabled');
                } else if (_currentPageinateIndex == _pageinationItemList.length) {
                    $.addClass(_pageinationRightBtn, 'disabled');
                } 
                // 设置课程内容
                updateCourseData({
                    pageNo: _currentPageinateIndex,
                    psize: 20,
                    type: _courseType
                });
            });
        }
        //分页器item点击处理函数
        function pageinationItemClickHandle(evt) {
            var _item = evt.target;
            var _index = parseInt(_item.innerHTML);
            //如果点击的是当前分页器item,则返回不执行，避免重复请求数据
            if (_currentPageinateIndex == _index) return;
            _currentPageinateIndex = _index;
            //清除原有页码选中样式
            clearPageinationItemSelectEffect(_pageinationItemList);
            //设置当前页码元素为选中状态
            $.addClass(_item, 'tab-item-select');
            //判断当前页码是否为第1个或最后1个，并作出相关设置
            $.removeClass(_pageinationLeftBtn, 'disabled');
            $.removeClass(_pageinationRightBtn, 'disabled');
            if (_currentPageinateIndex == 1) {
                $.addClass(_pageinationLeftBtn, 'disabled');
            } else if (_currentPageinateIndex == _pageinationItemList.length) {
                $.addClass(_pageinationRightBtn, 'disabled');
            }
            //根据当前页数，页面类型，请求数据，并更新课程内容
            updateCourseData({
                pageNo: _currentPageinateIndex,
                psize: 20,
                type: _courseType
            });
        }

        //清除分页器被选中样式
        function clearPageinationItemSelectEffect(arr) {
            for (var i = 0; i < arr.length; i++) {
                $.removeClass(arr[i], 'tab-item-select');
            }
        }
        //产品设计tab按钮点击事件监听
        $.addEventListener(_productDesignTab, 'click', function () {
            //如果当前为选中状态，则不处理，避免重复请求数据
            if ($.hasClass(_productDesignTab, 'selected')) return;
            //样式设置
            $.addClass(_productDesignTab, 'selected');
            $.removeClass(_programLanguageTab, 'selected');
            //数据设置
            //初次获取数据
            _courseType = 10;
            var _data = {
                pageNo: 1,
                psize: 20,
                type: _courseType
            };
            getCourseData(_data, function (data) {
                //设置分页器
                setPageinationItem(data);
                //TODO 设置课程内容
                updateCourseData({
                    pageNo: _currentPageinateIndex,
                    psize: 20,
                    type: _courseType
                });
            });
        });
          //编程语言tab按钮点击事件监听
        $.addEventListener(_programLanguageTab, 'click', function () {
            //如果当前为选中状态，则不处理，避免重复请求数据
            if ($.hasClass(_programLanguageTab, 'selected')) return;
            //样式设置
            $.addClass(_programLanguageTab, 'selected');
            $.removeClass(_productDesignTab, 'selected');
            //数据设置
            //初次获取数据
            _courseType = 20;
            var _data = {
                pageNo: 1,
                psize: 20,
                type: _courseType
            };
            getCourseData(_data, function (data) {
                //设置分页器
                setPageinationItem(data);
                // 设置课程内容
                updateCourseData({
                    pageNo: _currentPageinateIndex,
                    psize: 20,
                    type: _courseType
                });
            });
        });

        //更新课程内容数据
        function updateCourseData(param) {
            //请求数据
            getCourseData(param, function (data) {
                createCourseItem(data);
                //设置事件
                for(var i = 0; i < _courseContentItemList.length;i++){
                    var _normalItem = _courseContentItemList[i].querySelector('.course-panel-normal'); 
                    var _bigItem = _courseContentItemList[i].querySelector('.course-panel-big');
                    _normalItem.bigItem = _bigItem;
                    _bigItem.normalItem = _normalItem;
                    $.addEventListener(_normalItem,'mouseover',normalItemMouseOverHandler);
                    $.addEventListener(_bigItem,'mouseleave',function(){
                        $.addEventListener(this.normalItem,'mouseover',normalItemMouseOverHandler);
                        $.hide(this);
                    });
                }
            });

            function normalItemMouseOverHandler(){
                $.show(this.bigItem);
                $.removeEventListener(this,'mouseover',normalItemMouseOverHandler);
            }
        }

        //根据课程类型，获取课程相关数据
        function getCourseData(param, callback) {
            $.ajax({
                url: 'http://study.163.com/webDev/couresByCategory.htm',
                type: "get",
                dataType: 'json',
                data: param,
                success: function (data) {
                    if(!!data){
                        callback(data);
                    }
                }
            });
        }

        //创建课程元素
        function createCourseItem(data) {
            _courseContentItemList = [];
            _courseContentContainerEl.innerHTML="";
            var _dataList = data.list;
            for(var i = 0,len = _dataList.length;i<len;i++){
                var _div = document.createElement('div');
                $.addClass(_div,'course-panel-normal');
                //课程图片
                var _img = document.createElement('img');
                _img.src = _dataList[i].middlePhotoUrl;
                _img.alt =  _dataList[i].name;
                _div.appendChild(_img);
                //课程名称
                var _pName = document.createElement('p');
                $.addClass(_pName,'course-name');
                _pName.innerHTML=_dataList[i].name;
                _div.appendChild(_pName);
                //课程作者
                var _pAuthor = document.createElement('p');
                $.addClass(_pAuthor,'course-author');
                _pAuthor.innerHTML = _dataList[i].provider;
                _div.appendChild(_pAuthor);
                //课程热度
                var _span =document.createElement('span');
                $.addClass(_span,'course-hot');
                _span.innerHTML = _dataList[i].learnerCount;
                _div.appendChild(_span);
                //课程价格
                var _pPrice = document.createElement('p');
                $.addClass(_pPrice,'course-price');
                _pPrice.innerHTML = (_dataList[i].price == 0)? "免费":"￥"+_dataList[i].price.toString();
                _div.appendChild(_pPrice);
                var _coursePanel = document.createElement('div');
                $.addClass(_coursePanel,'content-course-panel')
                _coursePanel.appendChild(_div);
                ////////////////////添加课程详情元素//////////////////
                var _bigDiv = document.createElement('div');
                $.addClass(_bigDiv,'course-panel-big');
                var _panelTop = document.createElement('div');
                $.addClass(_panelTop,'big-panel-top');
                $.addClass(_panelTop,'clearfloat');
                _bigDiv.appendChild(_panelTop);
                //课程图片
                var _bImg = document.createElement('img');
                _bImg.src = _dataList[i].bigPhotoUrl;
                _bImg.title = _dataList[i].name;
                _panelTop.appendChild(_bImg);
                //课程名称
                var _bName =  document.createElement('p');
                $.addClass(_bName,'big-course-name');
                _bName.innerHTML = _dataList[i].name;
                _panelTop.appendChild(_bName);
                //课程热度
                var _bHot = document.createElement('p');
                $.addClass(_bHot,'big-course-hot');
                _bHot.innerHTML = _dataList[i].learnerCount.toString() + "人在学";
                _panelTop.appendChild(_bHot);
                //课程作者
                var _bAuthor = document.createElement('p');
                $.addClass(_bAuthor,'big-course-author');
                _bAuthor.innerHTML = "发布者："+ _dataList[i].provider;
                _panelTop.appendChild(_bAuthor);
                //课程分类
                var _bType = document.createElement('p');
                $.addClass(_bType,'big-course-type');
                _bType.innerHTML = "分类："+_dataList[i].categoryName;
                _panelTop.appendChild(_bType);
                //课程描述
                var _panelBottom = document.createElement('div');
                $.addClass(_panelBottom,'big-panel-bottom');
                _panelBottom.innerHTML = _dataList[i].description;
                _bigDiv.appendChild(_panelBottom);
                //默认隐藏课程详情
                $.hide(_bigDiv);
                _coursePanel.appendChild(_bigDiv);
                _courseContentContainerEl.appendChild(_coursePanel);
                _courseContentItemList.push(_coursePanel);
            }
        }
        //创建分页器
        function createPageination(total) {
            if (total < 1) return null;
            _pageinationItemList = [];
            _pageinationLeftBtn = null;
            _pageinationRightBtn = null;
            _pageinationContainerEl.innerHTML = "";
            //向前按钮
            _pageinationLeftBtn = document.createElement('span');
            _pageinationLeftBtn.innerHTML = '<';
            $.addClass(_pageinationLeftBtn, 'tab-arrow');
            _pageinationContainerEl.appendChild(_pageinationLeftBtn);
            //中间分页器数据
            for (var i = 0; i < total; i++) {
                var _span = document.createElement('span');
                $.addClass(_span, 'pageination-tab-item');
                _span.innerHTML = (i + 1).toString();
                _pageinationContainerEl.appendChild(_span);
                _pageinationItemList.push(_span);
            }
            //默认第1页为选中页
            $.addClass(_pageinationItemList[0], 'tab-item-select');
            //向后按钮
            _pageinationRightBtn = document.createElement('span');
            _pageinationRightBtn.innerHTML = '>';
            $.addClass(_pageinationRightBtn, 'tab-arrow');
            _pageinationContainerEl.appendChild(_pageinationRightBtn);
        }
    }
})();