define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');

    // 模板
    var tpls = {
        index: require('../../tpl/oilTank/index')
    };

    var oilTank = function () {};

    $.extend(oilTank.prototype, {
        init: function () {
            common.renderContent(tpls.index);
            this.initTable();
        },
        initTable: function (param) {
            var me = this;
            common.initTable({
                elem: '#oilTankTblist',
                page: {
                    limit: 20,
                    layout: ['count', 'prev', 'page', 'next']
                },
                url: api.oilTank.list,
                where: param || {},
                toolbar: '#topToolbar',
                height: 'full-120',
                cols: [
                    [ //表头
                        {
                            field: 'OilTankName',
                            title: '名 称'
                        },
                        {
                            field: 'OilTankNum',
                            title: '编 号'
                        },   
                        {
                            field: 'OilMassHeight',
                            title: '高 度（M）'
                        },                     
                        {
                            field: 'OilMassDensity',
                            title: '密 度（kg/m³）'
                        },
                        {
                            field: 'OilMassTemp',
                            title: '温 度（℃）'
                        },
                        {
                            field: 'OilMass',
                            title: '油 量（kg）'
                        },
                        /*{
                            field: 'DepotName',
                            title: '油库名称'
                        },
                        {
                            field: 'DepotNum',
                            title: '油库编号'
                        },*/
                        {
                            field: 'OperatorTime',
                            title: '操作时间',
                            width: 160,
                            templet: function (d) {
                                return d.OperatorTime ? new Date(d.OperatorTime).format('yyyy/MM/dd hh:mm') : '';
                            }
                        },
                        {
                            align: 'left',
                            toolbar: '#toolbar'
                        }
                    ]
                ],
                layFilter: 'tboilTank',
                layFilterEvent: function (obj) {
                    var data = obj.data,
                        layEvent = obj.event;
                    if (layEvent === 'delete') {} else if (layEvent === 'edit') {
                        common.changeHash('#oilTank/add/', {
                            id: data.Id
                        });
                    }
                },
                layFilterToolbarEvent: function (obj) {
                    if (obj.event == 'add') {
                        common.changeHash('#oilTank/add');
                    }
                }
            });
        }
    });

    var _oilTank = new oilTank();

    exports.init = function () {
        _oilTank.init();
    };
});