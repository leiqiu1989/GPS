define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');

    // 模板
    var tpls = {
        index: require('../../tpl/oilDepot/index')
    };

    var oilDepot = function () {};

    $.extend(oilDepot.prototype, {
        init: function () {
            common.renderContent(tpls.index);
            this.initControl();
            this.initTable();
        },
        initControl: function () {
            var me = this;
            common.renderForm(function (form) {
                form.on('submit(search)', function (data) {
                    var param = data.field;
                    me.initTable(param);
                    return false;
                });
                form.on('submit(reset)', function () {
                    common.$(':text').val('');
                    me.initTable();
                });
            });
        },
        initTable: function (param) {
            var me = this;
            common.initTable({
                elem: '#oilDepotTblist',
                page: {
                    limit: 20,
                    layout: ['count', 'prev', 'page', 'next']
                },
                url: api.oilDepot.list,
                where: param || {},
                toolbar: '#topToolbar',
                height: 'full-180',
                cols: [
                    [ //表头
                        {
                            title: '',
                            type: 'checkbox'
                        },
                        {
                            field: 'Name',
                            title: '油库名称',
                            width: 200
                        },
                        {
                            field: 'Num',
                            title: '油库编号',
                            width: 150
                        },
                        {
                            field: 'Lng',
                            title: '经度',
                            width: 100,
                        },
                        {
                            field: 'Lat',
                            title: '纬度',
                            width: 100
                        },
                        {
                            field: 'OperatorTime',
                            title: '操作时间',
                            width: 160,
                            templet: function (d) {
                                return d.OperatorTime ? new Date(d.OperatorTime).format('yyyy/MM/dd hh:mm') : '';
                            }
                        },
                        {
                            field: 'Remark',
                            title: '备 注'
                        },
                        {
                            align: 'left',
                            toolbar: '#toolbar'
                        }
                    ]
                ],
                layFilter: 'tboilDepot',
                layFilterEvent: function (obj) {
                    var data = obj.data,
                        layEvent = obj.event;
                    if (layEvent === 'delete') {

                    } else if (layEvent === 'edit') {
                        common.changeHash('#oilDepot/add/', {
                            id: data.Id
                        });
                    }
                },
                layFilterToolbarEvent: function (obj) {
                    if (obj.event == 'add') {
                        common.changeHash('#oilDepot/add');
                    } else if (obj.event == 'paramSend') {
                        var row = common.getSelectedRow('oilDepotTblist');
                        if (row.success) {
                            var data = row.data;
                            common.loading();
                            common.fetchData({
                                url: api.oilDepot.sendParam,
                                data: {
                                    oilDepotId: data.Id
                                },
                                callback: function (res) {
                                    if (res && res.success) {
                                        var data = res.data || {};
                                        callback && callback(data);
                                    } else {
                                        var msg = res.msg || '获取数据异常!';
                                        me.layAlert(msg);
                                        return false;
                                    }
                                    common.closeAllLayer();
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    var _oilDepot = new oilDepot();

    exports.init = function () {
        _oilDepot.init();
    };
});