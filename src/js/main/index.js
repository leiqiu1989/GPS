define(function (require, exports, module) {
    'use strict';

    var common = require('common');
    var api = require('api');
    var signal = require('signal');
    var map = require('map');
    var constVal = require('constVal');

    var signalConn = null;

    // 模板
    var tpls = {
        index: require('../../tpl/main/index')
    };

    var mainFunc = function () {};

    $.extend(mainFunc.prototype, {
        init: function () {
            var me = this;
            this.timer = null;
            common.renderContent(tpls.index);
            // 实时通信
            //this.sigalConnection();
            // 地图展示s
            map.init('mapInit', {}, function () {
                me.getData();
            });
        },
        getData: function () {
            var me = this;
            // 获取油库信息
            common.fetchData({
                url: api.oilDepot.list,
                callback: function (res) {
                    var data = res.data || [];
                    me.oilDepotMarker(data);
                }
            });
            // 获取车辆信息
            this.getCarInfo();

            // driverRoute
            setTimeout(function () {
                /*var driver = new BMap.DrivingRoute('拉萨', {
                    onSearchComplete: function (res) {
                        if (driver.getStatus() == BMAP_STATUS_SUCCESS) {
                            var plan = res.getPlan(0);
                            debugger;
                        }
                    }
                });
                var start = new BMap.Point(91.10119, 29.635523);
                var end = new BMap.Point(91.196626, 29.673187);
                driver.search('拉萨火车南站', '西藏大学');*/
                /*var driving = new BMap.DrivingRoute(map.getMap(), { 
                    renderOptions: { 
                        map: map.getMap(), 
                        autoViewport: true 
                    }
                });
                var start = new BMap.Point(91.10119, 29.635523);
                var end = new BMap.Point(91.196626, 29.673187);
                driving.search(start, end);*/
            }, 5000);
        },
        getCarInfo: function () {
            var me = this;
            common.fetchData({
                url: api.car.list,
                callback: function (res) {
                    var data = res.data || [];
                    me.statistics(data);
                    if (me.timer) {
                        me.updateCarInfo(data);
                    } else {
                        me.carMarker(data);
                        me.timer = setInterval(function () {
                            me.getCarInfo();
                        }, 10 * 1000);
                    }
                }
            });
        },
        // 车辆统计
        statistics: function (data) {
            var outCount = 0,
                InCount = 0;
            _.each(data, function (item) {
                var status = common.getCarStatus(item.Lng, item.Lat);
                if (status == 2) {
                    outCount += 1;
                } else {
                    InCount += 1;
                }
            });
            common.$('#carOut').text(outCount);
            common.$('#carIn').text(InCount);
        },
        updateCarInfo: function (data) {
            var markers = this.getAllMarker();
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var marker = _.find(markers, function (mkr) {
                    return mkr.cusAttr.Id == 'car_' + item.Id;
                });
                if (marker) {
                    var startPoint = marker.getPosition();
                    var endPoint = new BMap.Point(item.Lng, item.Lat);
                    if (common.getDistance(startPoint.lng, startPoint.lat, item.Lng, item.Lat) > constVal.distance) {
                        var lushu = new BMapLib.LuShu(map.getMap(), [startPoint, endPoint], {
                            defaultContent: "",
                            autoView: true,
                            icon: marker.getIcon(),
                            landmarkPois: [],
                            speed: 4500,
                            enableRotation: true,
                            // 移动完成
                            done: function () {
                                lushu.done();
                                marker.setPosition(endPoint);
                                marker.show();
                            }
                        });
                        marker.closeInfoWindow();
                        lushu.start(function () {
                            marker.hide();
                        });
                    }
                    var label = marker.getLabel();
                    label.setContent(item.CarName);
                    marker.setLabel(label);
                    this.renderInfoWindow(marker, item);
                }
            }
        },
        getAllMarker: function () {
            var markers = [];
            var overlays = map.getMap().getOverlays();
            // 统计所有罐车marker
            _.each(overlays, function (overlay) {
                var overlayType = overlay.toString();
                if (overlay.cusAttr && overlay.cusAttr.type == 'car' && overlayType === '[object Marker]')
                    markers.push(overlay);
            });
            return markers;
        },
        oilDepotMarker: function (data) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var myicon = new BMap.Icon('./img/oil-dept.png', new BMap.Size(19, 24), {
                    imageSize: new BMap.Size(19, 24) // 引用图片实际大小
                });
                var marker = new BMap.Marker(new BMap.Point(item.Lng, item.Lat), {
                    icon: myicon
                });
                map.getMap().addOverlay(marker);
            }
        },
        carMarker: function (data) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var myicon = new BMap.Icon('./img/car-small.png', new BMap.Size(24, 24), {
                    imageSize: new BMap.Size(24, 24) // 引用图片实际大小
                });
                var marker = new BMap.Marker(new BMap.Point(item.Lng, item.Lat), {
                    icon: myicon
                });

                var label = new BMap.Label(item.CarName, {
                    offset: new BMap.Size(-15, -30)
                });

                label.setStyle({
                    color: '#333',
                    borderRadius: '5px',
                    borderColor: '#ccc',
                    padding: '5px',
                    fontSize: '14px',
                    height: '15px',
                    lineHeight: '15px',
                    fontFamily: '微软雅黑'
                });
                marker.setLabel(label);
                marker.cusAttr = {
                    type: 'car',
                    Id: 'car_' + item.Id
                }
                marker.CarType =
                    map.getMap().addOverlay(marker);

                this.renderInfoWindow(marker, item);
            }
        },
        renderInfoWindow: function (marker, data) {
            // 添加提示信息
            var strhtml = '';
            var laytpl = layui.laytpl;
            laytpl(carDetail.innerHTML).render(data, function (html) {
                strhtml = html;
            });
            var infoWindow = new BMap.InfoWindow(strhtml, {
                width: 250,
                height: 255,
                title: '车辆信息'
            });
            marker.addEventListener('click', function () {
                this.openInfoWindow(infoWindow);
            });
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
        destory: function () {
            this.timer = null;
            signalConn && signalConn.destory();

        }
    });

    var _mainFunc = new mainFunc();

    exports.init = function () {
        _mainFunc.init();
    };
    exports.destory = function () {
        _mainFunc.destory();
    }
});