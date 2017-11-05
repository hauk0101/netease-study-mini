### 开发小记

 * 暂时不考虑性能优化，主要先体现整体前端项目的各个功能的分割和实现
 

### 开发小悟

 * 一个优雅的html页面，是可以在css失效的情况下，依旧正常显示出可读性较好的内容。
 * 两个inline-block元素之间如果存在空格，则会出现间隙，删除即可。
 * 如果需要操作cookie，则访问协议应该为http/https，直接通过文件地址查看无法在浏览器中设置相关cookie值
 * 关于闭包在事件绑定中的应用，解决方案之一：
 
 ```
 //为silder添加点击事件
        for (var i = 0; i < _silderList.length; i++) {
            _silderList[i]._currentIndex = i; 
            $.addEventListener(_silderList[i], 'click', function () {
                _bannerPauseChange = true;
                setCurrentBanner(this._currentIndex);
            });
        }
 ```
 