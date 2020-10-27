define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');

    // 模板
    var tpls = {
        index: require('../../tpl/monitor/index')
    };

    var monitor = function () {};

    $.extend(monitor.prototype, {
        init: function () {
            var me = this;
            common.renderContent(tpls.index);
            this.getOilTankList();
            this.getOilCarList();
            // 油罐定时器
            this.oilTankTimer = setInterval(function () {
                me.getOilTankList()
            }, 2 * 60 * 1000);
            // 罐车定时器
            this.oilCarTimer = setInterval(function () {
                me.getOilTankList()
            }, 3 * 60 * 1000);
        },
        getOilTankList: function () {
            common.fetchData({
                url: api.oilTank.list,
                callback: function (res) {
                    var data = res.data || [];
                    console.log(data);
                    var laytpl = layui.laytpl;
                    laytpl(oilTankTpl.innerHTML).render({
                        list: data
                    }, function (html) {
                        $('#oilTankTemp').empty().html(html);
                    });
                }
            });
        },
        getOilCarList: function () {
            common.fetchData({
                url: api.car.list,
                callback: function (res) {
                    var data = res.data || [];
                    console.log(data);
                    data = _.map(data, function (item) {
                        var status = common.getCarStatus(item.Lng, item.Lat);
                        item.CarStatusTxt = status == 1 ? '<span class="red">外 出</span>' : '<span class="green">在 场</span>';
                        return item;
                    });
                    var laytpl = layui.laytpl;
                    laytpl(oilCarTpl.innerHTML).render({
                        list: data
                    }, function (html) {
                        $('#oilCarTemp').empty().html(html);
                    });
                }
            });
        },
        destory: function () {
            this.oilTankTimer && clearInterval(this.oilTankTimer);
            this.oilCarTimer && clearInterval(this.oilCarTimer);
        }
    });

    var _monitor = new monitor();

    exports.init = function () {
        _monitor.init();
    };
    exports.destory = function () {
        _monitor.destory();
    }
});