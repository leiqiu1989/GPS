define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');


    // 模板
    var tpls = {
        add: require('../../tpl/oilDepot/add')
    };

    var oilDepotAdd = function () {};

    $.extend(oilDepotAdd.prototype, {
        init: function (id) {
            if (!id) {
                this.initControl();
            } else {
                var me = this;
                common.initTemplate(api.oilDepot.detail, {
                    id: id
                }, function (data) {
                    me.initControl(data)
                });
            }
        },
        initControl: function (data) {
            data = data || {
            };
            common.renderContent(tpls.add, data);

            // 地图标点
            common.mapDialog('#frmOilDepot', function (point) {
                common.$('#strLngLat').val(point.lng + ',' + point.lat);
                common.$(':hidden[name="Lng"]').val(point.lng);
                common.$(':hidden[name="Lat"]').val(point.lat);
            });
            this.event();

            common.renderForm(function (form) {
                form.on('submit(*)', function (data) {
                    var submitData = data.field;
                    var url = api.oilDepot.update;
                    common.fetchData({
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(submitData),
                        callback: function (res) {
                            if (res && res.success) {
                                common.layMsg('数据操作成功!');
                                common.changeHash('#oilDepot/index');
                            } else {
                                var msg = res.msg || '操作数据失败';
                                common.layAlert(msg);
                                return false;
                            }
                        }
                    });
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            });
        },
        event: function () {
            $('#content').on('click', 'button[lay-filter="back"]', function () {
                common.changeHash('#oilDepot/index');
            });
        }
    });

    var _oilDepotAdd = new oilDepotAdd();

    exports.init = function (param) {
        _oilDepotAdd.init(param.id);
    };
});