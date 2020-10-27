define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');

    // 模板
    var tpls = {
        index: require('../../tpl/report/index')
    };

    var reportFn = function () {};

    $.extend(reportFn.prototype, {
        init: function () {
            common.renderContent(tpls.index);
            // 实时通信
            //this.sigalConnection();
            // 获取图表数据
            //this.getData();
            // 事件绑定
            //this.event();
        },
        sigalConnection: function () {
            var me = this;
            signalConn = signal.init({
                url: api.signalPostBack,
                qs: {
                    RequestType: 'notifyInfo'
                },
                connectionDone: function () {
                    console.info('signal connection done');
                    // notice 提示
                    common.startTime(function () {
                        sendData({
                            userId: Cookies.get('userId'),
                            dataType: [{
                                type: 'noticeCount'
                            }]
                        });
                    }, 'notice', 15000);
                    // 上级tar显示
                    common.startTime(function () {
                        sendData({
                            tarSource: 2,
                            dataType: [{
                                type: 'tar'
                            }]
                        });
                    }, 'tarShow');
                }
            });
            signalConn.received(function (recData) {
                if (recData) {
                    var type = recData.type;
                    switch (type) {
                        case 'noticeCount':
                            me.processNoticeCount(recData.data);
                            break;
                        case 'tar':
                            me.tarShow(recData.data);
                            break;
                    }
                }
            });

            function sendData(param) {
                if (signalConn) {
                    var install = signalConn.getInstall();
                    var state = install.state;
                    if (install && state == 1) {
                        install.send(param);
                    }
                }
            }
        },
        // 处理消息
        processNoticeCount: function (data) {
            common.$('[notifyAudit]').text(data.auditCount);
            common.$('[notifyMsg]').text(data.receiveCount);
        },
        // 显示
        // tar包显示
        tarShow: function (res) {
            var me = this;
            var data = res.list || [];
            var currentTime = (new Date()).valueOf(); // 当前毫秒数
            data = _.filter(data, function (item) {
                var equalTime = (new Date(item.EBD_EBDTime)).valueOf();
                var minutes = (currentTime - equalTime) / 1000 / 60;
                return minutes < constVal.tarEqualsTime;
            });

            data = _.map(data, function (d) {
                var rt = _.find(constVal.emergencySeverityArray, function (item) {
                    return item.value == d.Severity;
                });
                var name = rt ? '<span class="' + rt.cls + '">' + (rt.text || '') + '</span>' : '';
                d.SeverityName = name;
                return d;
            });

            common.$('[notifyTar]').text(data.length);

            var laytpl = layui.laytpl;
            laytpl(tarShow.innerHTML).render({
                list: data
            }, function (html) {
                if (tarTime) {
                    clearInterval(tarTime);
                }
                common.$('.tarContainer').empty().html(html);
                me.autoScroll();
            });
        },

        getData: function () {
            var me = this;
            common.loading();
            common.fetchData({
                url: api.summary.chart,
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var data = res.Data || {};
                        me.chartEmergency(data.One, data.Two, data.Three, data.Four);
                        me.chartDeviceCount(data.modemCount || 0, data.reamingMachineCount || 0, data.soundColumnCount || 0);
                        me.chartDeviceStatus(data.list || []);
                    }
                    common.closeAllLayer();
                }
            });
        },
        autoScroll: function () {
            var $el = $('.tarContainer');
            var $this = $el.find('.tarBlock');
            var len = $this.size();

            // 大于2条数据才滚动
            if (len > 2) {
                scroll();
            }

            function scroll() {
                tarTime = setInterval(function () {
                    $el.animate({
                        'marginTop': '-104px'
                    }, 1000, function () {
                        $(this).css({
                            marginTop: "0px"
                        }).find(".tarBlock:first").appendTo(this);
                    });
                }, 2000);
            }
        },

        chartEmergency: function (oneLevel, twoLevel, threeLevel, fourLevel) {
            var avg = 100 / (oneLevel + twoLevel + threeLevel + fourLevel);
            Highcharts.chart('chartEmergencyLevel', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: '占比',
                    colorByPoint: true,
                    data: [{
                        name: '一级(特别重大)',
                        y: avg * oneLevel,
                        sliced: true,
                        selected: true
                    }, {
                        name: '二级(重大)',
                        y: avg * twoLevel,
                    }, {
                        name: '三级(较大)',
                        y: avg * threeLevel,
                    }, {
                        name: '四级(一般)',
                        y: avg * fourLevel,
                    }]
                }]
            });

            Highcharts.chart('chartEmergencyCount', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '消息数量(条)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '消息条数: <b>{point.y:.0f} 条</b>'
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    data: [{
                        name: '一级',
                        y: oneLevel
                    }, {
                        name: '二级',
                        y: twoLevel
                    }, {
                        name: '三级',
                        y: threeLevel
                    }, {
                        name: '四级',
                        y: fourLevel
                    }]
                }]
            });

        },
        chartDeviceCount: function (modemCount, reamingMachineCount, soundColumnCount) {
            Highcharts.chart('deviceCount', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: '数据截止 ' + (new Date()).format('yyyy/MM/dd')
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45 // 设置轴标签旋转角度
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '数量 (台)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '设备总量: <b>{point.y} 台</b>'
                },
                series: [{
                    name: '总数',
                    data: [
                        ['收扩机', reamingMachineCount],
                        ['音柱', soundColumnCount],
                        ['适配器', modemCount]
                    ],
                    dataLabels: {
                        enabled: true,
                        color: '#FFFFFF',
                        align: 'center',
                        format: '{point.y}', // :.1f 为保留 1 位小数
                        y: 30
                    }
                }]
            });
        },
        chartDeviceStatus: function (data) {
            var online = 0,
                offline = 0,
                warning = 0;


            function filterStatus(postback, isBackFunc) {
                if (_.isEmpty(postback) || !isBackFunc) {
                    offline += 1;
                } else {
                    var receiveDate = postback.ReceiveDate;
                    var interValMin = ((new Date()).valueOf() - (new Date(receiveDate)).valueOf()) / 1000 / 60; // 相差分钟
                    if (interValMin > constVal.postBackInterVal) {
                        offline += 1;
                    } else {
                        if (postback.IsWaring) {
                            warning += 1;
                        } else {
                            online += 1;
                        }
                    }
                }
            }

            _.each(data, function (item) {
                filterStatus(item.DevicePostBack, item.BackFunction);
            });

            var chart = Highcharts.chart('deviceStatus', {
                chart: {
                    spacing: [40, 0, 40, 0]
                },
                title: {
                    floating: true,
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y} 个</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y} 个',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        point: {
                            events: {
                                mouseOver: function (e) { // 鼠标滑过时动态更新标题
                                    // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                                    chart.setTitle({
                                        text: e.target.name + '\t' + e.target.y + ' 个'
                                    });
                                }
                                //, 
                                // click: function(e) { // 同样的可以在点击事件里处理
                                //     chart.setTitle({
                                //         text: e.point.name+ '\t'+ e.point.y + ' %'
                                //     });
                                // }
                            }
                        },
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '80%',
                    name: '个数',
                    data: [
                        ['离线', offline],
                        {
                            name: '在线',
                            y: online,
                            sliced: true,
                            selected: true,
                        },
                        ['报警', warning]
                    ]
                }]
            }, function (c) { // 图表初始化完毕后的会掉函数
                // 环形图圆心
                var centerY = c.series[0].center[1],
                    titleHeight = parseInt(c.title.styles.fontSize);
                // 动态设置标题位置
                c.setTitle({
                    y: centerY + titleHeight / 2
                });
            });
        },
        destory: function () {
            
        }
    });

    var _reportFn = new reportFn();

    exports.init = function () {
        _reportFn.init();
    };
    exports.destory = function () {
        _reportFn.destory();
    }
});