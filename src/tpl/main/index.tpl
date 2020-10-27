<div class="flex-grow map-container">
    <!--<div class="map-left">
        <div class="layui-row layui-col-space10">
            <div class="layui-col-md12">
                <div class="layui-row layui-col-space10">
                    <div class="layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-header">
                                实时报警
                            </div>
                            <div class="layui-card-body">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-header">车辆监控（本周）</div>
                            <div class="layui-card-body">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-header">油量监控（当前）</div>
                            <div class="layui-card-body">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>-->
    <div class="map">
        <div id="mapInit" class="full"></div>
    </div>
    <div class="map-layer map-legend">
        <div class="title">图 例</div>
        <div class="legend-item">
            <div class="legend-icon oil-depot">
            </div>
            <div class="legend-text">油 库</div>
        </div>
        <div class="legend-item">
            <div class="legend-icon car-icon">
            </div>
            <div class="legend-text">罐 车</div>
        </div>
    </div>
    <div class="map-layer map-summary">
        <div class="title">统计信息</div>
        <div class="summary-item">
            <span class="title">油 库：</span>
            <label>数量：<span class="large-size">1</span></label>
        </div>
        <div class="summary-item">
            <span class="title">罐 车：</span>
            <label>在 岗：<span class="large-size" id="carOut">0</span></label>
            <label>外 出：<span class="large-size" id="carIn">0</span></label>
        </div>
    </div>
</div>

<script type="text/html" class="layui-hide" id="carDetail">
    <div class="car-row">
        <div class="car-item">
            <label>高 度（M）：</label>
            <div class="car-value">{{ d.CarMassHeight }}</div>
        </div>
    </div>
    <div class="car-row">
        <div class="car-item">
            <label>密 度（g/ml）：</label>
            <div class="car-value">{{ d.CarMassDensity }}</div>
        </div>
    </div>
    <div class="car-row">
        <div class="car-item">
            <label>温 度（℃）：</label>
            <div class="car-value">{{ d.CarOilTemperature }}</div>
        </div>
    </div>
    <div class="car-row">
        <div class="car-item">
            <label>油 量（吨）：</label>
            <div class="car-value">{{ d.CarOilMass }}</div>
        </div>
    </div>
    <div class="car-row">
        <div class="car-item">
            <label>当前驾驶人员：</label>
            <div class="car-value">{{ d.DriverName || '' }}</div>
        </div>
    </div>
    <div class="car-row align-right">
        <div class="car-item">
            <button type="button" class="layui-btn layui-btn-xs">历史轨迹</button>
        </div>
    </div>
</script>