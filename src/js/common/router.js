define(function (require, exports, module) {

    var common = require('common');

    function router() {}

    $.extend(router.prototype, {
        init: function () {
            return this;
        },
        getHash: function () {
            return common.getHash();
        },
        getModule: function (hash) {
            var _hash = hash || this.getHash(),
                arr = _hash.split('/'),
                len = arr.length;

            if (_hash.indexOf('=') === -1) {
                return _hash;
            }
            return arr.splice(0, len - 1).join('/');
        },
        getParam: function (hash) {
            var _hash = hash || this.getHash();
            return common.getParam(_hash);
        },
        run: function () {
            var me = this;

            //监听hash变化
            window.onhashchange = function (e) {
                var oldUrl = e.oldURL;
                this.destory(oldUrl, function () {
                    me.loadModule(me.getModule(), me.getParam());
                });
            }.bind(this);

            //初始化
            this.loadModule(this.getModule(), this.getParam());
        },

        // 清除上一个模块相关变量引用
        destory: function (prevUrl, callback) {
            var hash = prevUrl.split('#')[1] || 'main/index';
            var action = this.getModule(hash);
            var param = this.getParam(hash);

            this.loadModule(action, param, 'destory');

            callback && callback();
        },
        // 加载当前模块
        loadModule: function (action, param, operator = 'init') {
            //加载module目录下对应的模块
            require.async(['./../', action].join('/'), function (o) {
                if (o) {
                    // 生成面包屑
                    //common.generateBreadCrumb(operator, action);
                    //运行当前模块
                    o[operator] && o[operator](param);
                } else {
                    console.log('模块加载失败！');
                }
            });

        }
    });

    module.exports = new router();
});