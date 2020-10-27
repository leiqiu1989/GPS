define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');


    // 模板
    var tpls = {
        add: require('../../tpl/oilTank/add')
    };

    var oilTankAdd = function () {};

    $.extend(oilTankAdd.prototype, {
        init: function (id) {
            var me = this;
            if (!id) {
                this.initControl();
            } else {
                var me = this;
                common.initTemplate(api.oilTank.detail, {
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
                    var url = api.oilTank.update;
                    common.fetchData({
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(submitData),
                        callback: function (res) {
                            if (res && res.success) {
                                common.layMsg('数据操作成功!');
                                common.changeHash('#oilTank/index');
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
        oilDepotDialog: function () {
            common.layUIDialog({
                title: '油库列表',
                type: 1,
                content: '<table lay-filter="oilTable" id="oilList"></table>',
                area: ['500px', '400px'],
                success: function () {
                    common.initTable({
                        elem: '#oilList',
                        url: api.oilDepot.list,
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
                                    field: 'Name'
                                },
                                {
                                    title: '编 号',
                                    field: 'Num'
                                }
                            ]
                        ]
                    });
                },
                btnAlign: 'r',
                btn: ['确 定', '关 闭'],
                yes: function (index) {
                    var obj = common.getSelectedRow('oilList');
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
                common.changeHash('#oilTank/index');
            }).on('click', 'a[data-event="selectOilDepot"]', function () {
                me.oilDepotDialog();
            });
        }
    });

    var _oilTankAdd = new oilTankAdd();

    exports.init = function (param) {
        _oilTankAdd.init(param.id);
    };
});