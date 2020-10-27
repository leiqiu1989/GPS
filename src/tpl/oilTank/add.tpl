<div class="layui-tab flex-grow flex">
    <ul class="layui-tab-title">
        <li class="layui-this">油罐信息</li>
    </ul>
    <div class="layui-tab-content flex-grow">
        <div class="layui-tab-item layui-show">
            <form class="layui-form">
                <input type="hidden" name="Id" value="<%= Id || 0 %>">
                <input type="hidden" name="OilDepotId" value="<%= OilDepotId || 0 %>">
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">名 称</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilTankName" value="<%= OilTankName %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">编 号</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilTankNum" value="<%= OilTankNum %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">高 度（M）</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassHeight" value="<%= OilMassHeight %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">总容积（L）</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassVolume" value="<%= OilMassVolume %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">油 库</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="DepotName" value="<%= DepotName %>"
                                        placeholder="点击右侧图标选择油库" readonly autocomplete="off" class="layui-input">
                                </div>
                                <div class="layui-form-mid">
                                    <a href="javascript:;" data-event="selectOilDepot">
                                        <i class="fa fa-map-marker"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">传感器地址</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassSensorAddress" value="<%= OilMassSensorAddress %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">燃油类型</label>
                            <div class="layui-input-block">
                                <select name="OilMassFuelType">
                                    <option value="0">汽 油</option>
                                    <option value="1">柴 油</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">油位校准值</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilLevelCalibration" value="<%= OilLevelCalibration %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">密度校准值</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilDensityCalibration" value="<%= OilDensityCalibration %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">高度闸值（高）</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassHeightAlarm_Hign" value="<%= OilMassHeightAlarm_Hign %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">高度闸值（低）</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassHeightAlram_Low" value="<%= OilMassHeightAlram_Low %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">温度闸值（高）</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassTempAlarm_Hign" value="<%= OilMassTempAlarm_Hign %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">温度闸值（低）</label>
                            <div class="layui-input-block">
                                <input type="text" name="OilMassTempAlarm_Low" value="<%= OilMassTempAlarm_Low %>"
                                    lay-verify="required" lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <div class="layui-input-block">
                                <button class="layui-btn" type="submit" lay-submit lay-filter="*">立即提交</button>
                                <button class="layui-btn layui-btn-primary" type="button" lay-filter="back">返 回</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>