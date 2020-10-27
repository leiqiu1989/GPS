define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');

    // 模板
    var tpls = {
        index: require('../../tpl/car/index')
    };

    var car = function () {};

    $.extend(car.prototype, {
        init: function (param) {
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
            common.initTable({
                elem: '#carTbList',
                page: {
                    limit: 20,
                    layout: ['count', 'prev', 'page', 'next']
                },
                url: api.car.list,
                where: param || {},
                toolbar: '#topToolbar',
                height: 'full-180',
                cols: [
                    [ //表头
                        {
                            field: 'CarName',
                            title: '罐车名称'
                        },
                        {
                            field: 'CarNumber',
                            title: '罐车编号'
                        },
                        {
                            field: 'CarMassHeight',
                            title: '高 度（M）'
                        },
                        {
                            field: 'CarMassDensity',
                            title: '密 度（kg/m³）'
                        },
                        {
                            field: 'CarOilMass',
                            title: '油 量（L）'
                        },
                        {
                            field: 'CarOilTemperature',
                            title: '温 度（℃）'
                        },
                        {
                            field: 'CarStatus',
                            title: '罐车状态',
                            width: 100,
                            templet: function (d) {
                                var status = common.getCarStatus(d.Lng, d.Lat);
                                return status == 1 ? '<span class="red">外出</span>' : '<span class="green">在场</span>';
                            }
                        },
                        {
                            field: 'DriverName',
                            title: '驾驶人员'
                        },
                        {
                            align: 'left',
                            toolbar: '#toolbar'
                        }
                    ]
                ],
                layFilter: 'tbCar',
                layFilterEvent: function (obj) {
                    var data = obj.data,
                        layEvent = obj.event;
                    if (layEvent === 'delete') {} else if (layEvent === 'edit') {
                        common.changeHash('#car/add/', {
                            id: data.Id
                        });
                    }
                },
                layFilterToolbarEvent: function (obj) {
                    if (obj.event == 'add') {
                        common.changeHash('#car/add');
                    }
                }
            });
        }
    });

    var _car = new car();

    exports.init = function (param) {
        _car.init(param);
    };
});