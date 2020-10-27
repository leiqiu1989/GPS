define(function (require, exports, module) {
    'use strict';

    var map = function () {
        // 公共变量
        this._map = null;
    };

    map.prototype = {
        reset: function () {
            this._map = null;
        },
        init: function (el, opt, callback) {
            var me = this;
            opt = _.extend({
                addNavigation: false
            }, (opt || {}));

            this.reset();
            this._map = new BMap.Map(el, {
                enableMapClick: false,
                mapType: BMAP_HYBRID_MAP
            });
            var centerPT = new BMap.Point(91.173284, 29.658985);

            this._map.centerAndZoom(centerPT, 11);
            this._map.panTo(centerPT);
            if (callback) callback(me._map);
            // 最大、最小缩放级别
            this._map.setMinZoom(8);
            this._map.setMaxZoom(13);
            //启用滚轮缩放
            this._map.enableScrollWheelZoom();
            // 添加地图平移控件
            if (opt.addNavigation) {
                this._map.addControl(new BMap.NavigationControl());
            }
        },
        // 清除所有覆盖物
        clearOverlays: function () {
            this._map.clearOverlays();
        },
        getMap: function () {
            return this._map;
        },
        // 设置中心点和zoom
        setCenterAndZoom: function (mapPoints, isInit = false) {
            if (mapPoints.length) {
                var view = this._map.getViewport(eval(mapPoints));
                var mapZoom = view.zoom;
                var centerPoint = view.center;
                this._map.centerAndZoom(centerPoint, isInit ? 12 : (mapZoom > 16 ? 16 : mapZoom));
            }
        },
        // 生成地图points
        generateMapPoints: function (data) {
            var mapPoints = [];
            $.each(data, function (index, item) {
                if (item.Lng && item.Lat) {
                    var point = new BMap.Point(item.Lng, item.Lat);
                    mapPoints.push(point);
                }
            });
            return mapPoints;
        }
    };
    var _map = new map();

    module.exports = _map;

});