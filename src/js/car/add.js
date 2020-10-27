define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');


    // 模板
    var tpls = {
        add: require('../../tpl/car/add')
    };

    var carAdd = function () {};

    $.extend(carAdd.prototype, {
        init: function (id) {
            if (!id) {
                this.initControl();
            } else {
                var me = this;
                common.initTemplate(api.car.detail, {
                    id: id
                }, function (data) {
                    me.initControl(data)
                });
            }
        },

        initControl: function (data) {
            data = data || {};
            common.renderContent(tpls.add, data);

            this.event();

            common.renderForm(function (form) {
                form.on('submit(*)', function (data) {

                    var submitData = data.field;
                    var url = api.car.update;
                    common.fetchData({
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(submitData),
                        callback: function (res) {
                            if (res && res.success) {
                                common.layMsg('数据操作成功!');
                                common.changeHash('#car/index');
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
        selectDriver: function () {
            common.layUIDialog({
                title: '司机列表',
                type: 1,
                content: '<table id="driverList"></table>',
                area: ['500px', '400px'],
                success: function () {
                    common.initTable({
                        elem: '#driverList',
                        url: api.car.DriverList,
                        page: {
                            limit: 20,
                            layout: ['count']
                        },
                        height: 280,
                        cols: [
                            [ //表头
                                {
                                    title: '',
                                    field: 'Id',
                                    type: 'checkbox'
                                },
                                {
                                    title: '名 称',
                                    field: 'DriverName'
                                },
                                {
                                    title: '编 号',
                                    field: 'DriverNum'
                                }
                            ]
                        ]
                    });
                },
                btnAlign: 'r',
                btn: ['确 定', '关 闭'],
                yes: function (index) {
                    var obj = common.getSelectedRow('DriverList');
                    if (obj.success) {
                        var data = obj.data;
                        common.$(':hidden[name="OilDepotId"]').val(data.Id);
                        common.$(':text[name="DepotName"]').val(data.Name);
                        layer.close(index);
                    }
                },
                btn2: function (index) {
                    layer.close(index)
                }
            });
        },
        event: function () {
            var me = this;
            $('#content').on('click', 'button[lay-filter="back"]', function () {
                common.changeHash('#car/index');
            }).on('click', 'a[data-event="selectDriver"]', function () {
                me.selectDriver();
            });
        }
    });

    var _carAdd = new carAdd();

    exports.init = function (param) {
        _carAdd.init(param.id);
    };
});