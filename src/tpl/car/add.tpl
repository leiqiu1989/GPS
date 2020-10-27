<div class="layui-tab flex-grow flex">
    <ul class="layui-tab-title">
        <li class="layui-this">罐车信息</li>
    </ul>
    <div class="layui-tab-content flex-grow">
        <div class="layui-tab-item layui-show">
            <form class="layui-form">
                <input type="hidden" name="Id" value="<%= Id || 0 %>">
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">罐车名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="CarName" value="<%= CarName %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">罐车编号</label>
                            <div class="layui-input-block">
                                <input type="text" name="CarNumber" value="<%= CarNumber %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">罐车容积（L）</label>
                            <div class="layui-input-block">
                                <input type="text" name="CarCubage" value="<%= CarCubage %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <!--<div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">车辆状态</label>
                            <div class="layui-input-block">
                                <% if(CarStatus == 2) { %>
                                <input type="radio" name="CarStatus" value="2" title="在场" checked>
                                <input type="radio" name="CarStatus" value="1" title="外出">
                                <% } else { %>
                                <input type="radio" name="CarStatus" value="2" title="在场">
                                <input type="radio" name="CarStatus" value="1" title="外出" checked>
                                <% } %>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">罐车司机</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="DepotName"
                                        value="<%= DepotName %>"
                                        placeholder="点击右侧图标选择司机" readonly autocomplete="off" class="layui-input">
                                </div>
                                <div class="layui-form-mid">
                                    <a href="javascript:;" data-event="selectDriver">
                                        <i class="fa fa-map-marker"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3">
                        <div class="layui-form-item">
                            <label class="layui-form-label">油量高度（M）</label>
                            <div class="layui-input-block">
                                <input type="text" name="CarMassHeight" value="<%= CarMassHeight %>"
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