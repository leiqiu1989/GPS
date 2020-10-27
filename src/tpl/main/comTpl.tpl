<!-- 弹窗地图 -->
<script type="text/html" class="lay-hide" id="tplDialogMap">
    <div class="full">
        <div class="dialog-map-input layui-form-search layui-form-dialog">
            <div class="layui-row">
                <div class="layui-col-md5">
                    <div class="layui-form-item">
                        <label class="layui-form-label">经度</label>
                        <div class="layui-input-block">
                            <input type="text" name="lng" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-col-md5">
                    <div class="layui-form-item">
                        <label class="layui-form-label">纬度</label>
                        <div class="layui-input-block">
                            <input type="text" name="lat" class="layui-input">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="dialogMap"></div>
    </div>
</script>

<script id="oilTankTpl" type="text/html">
    {{# layui.each(d.list, function(index, item){ }}
    <div class="show-block show-block-tank">
        <div class="show-content">
            <div class="title">{{ item.OilTankName }}</div>
            <div class="flex-row space-between">
                <div class="oilTank"></div>
                <div class="oilMass">
                    <div class="inner">
                        <div class="inner-value">
                            <div class="inner-text">65%</div>
                        </div>
                    </div>
                </div>
                <div class="tank-info">
                    <div class="tank-item">高 度：<label>{{ item.OilMassHeight || 0 }} M</label></div>
                    <div class="tank-item">密 度：<label>{{ item.OilMassDensity || 0 }} kg/m³</label></div>
                    <div class="tank-item">温 度：<label>{{ item.OilMassTemp || 0 }} ℃</label></div>
                    <div class="tank-item">油 量：<label>{{ item.OilMass || 0 }} L</label></div>
                    <div class="tank-item"><button type="button"
                            class="layui-btn layui-btn-xs layui-btn-normal layui-btn-fluid">历史记录</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{# }); }}
</script>

<script id="oilCarTpl" type="text/html">
    {{# layui.each(d.list, function(index, item){ }}
    <div class="show-block show-block-truck">
        <div class="show-content">
            <div class="title">{{ item.CarName }}</div>
            <div class="flex-row space-between">
                <div class="oilTankTruck"></div>
                <div class="oilMass">
                    <div class="inner">
                        <div class="inner-value">
                            <div class="inner-text">65%</div>
                        </div>
                    </div>
                </div>
                <div class="truck-info">
                    <div class="truck-item">高 度：<label>{{ item.CarMassHeight || 0 }} M</label></div>
                    <div class="truck-item">密 度：<label>{{ item.CarMassDensity || 0 }} kg/m³</label></div>
                    <div class="truck-item">温 度：<label>{{ item.CarOilTemperature || 0 }} ℃</label></div>
                    <div class="truck-item">油 量：<label>{{ item.CarOilMass || 0 }} L</label></div>
                    <div class="truck-item">状 态：<label>{{ item.CarStatusTxt }}</label></div>
                    <div class="truck-item"><button type="button"
                            class="layui-btn layui-btn-xs layui-btn-normal layui-btn-fluid">查看详情</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{# }); }}
</script>

<script id="tplChangePwd" type="text/html">
    <form class="layui-form layui-form-dialog">
        <div class="layui-form-item">
            <label class="layui-form-label">当前密码</label>
            <div class="layui-input-block">
                <input type="password" name="OldPassword" lay-verify="required" lay-verType="tips" autocomplete="off"
                    placeholder="请输入当前密码" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">新密码</label>
            <div class="layui-input-block">
                <input type="password" name="NewPassword" lay-verify="required|pwd" lay-verType="tips"
                    autocomplete="off" placeholder="请输入当前密码" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">确认新密码</label>
            <div class="layui-input-block">
                <input type="password" name="ConfirmPassword" lay-verify="required|pwd" lay-verType="tips"
                    autocomplete="off" placeholder="请输入当前密码" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button type="submit" class="layui-btn" lay-submit lay-filter="*">立即提交</button>
            </div>
        </div>
    </form>
</script>