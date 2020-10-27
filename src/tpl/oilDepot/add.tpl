<div class="layui-tab flex-grow flex">
    <ul class="layui-tab-title">
        <li class="layui-this">油库信息</li>
    </ul>
    <div class="layui-tab-content flex-grow">
        <div class="layui-tab-item layui-show">
            <form class="layui-form" id="frmOilDepot">
                <input type="hidden" name="Id" value="<%= Id || 0 %>">
                <input type="hidden" name="Lng" value="<%= Lng %>" />
                <input type="hidden" name="Lat" value="<%= Lat %>" />
                <div class="layui-row">
                    <div class="layui-col-md4">
                        <div class="layui-form-item">
                            <label class="layui-form-label">油库名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="Name" value="<%= Name %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md4">
                        <div class="layui-form-item">
                            <label class="layui-form-label">油库编号</label>
                            <div class="layui-input-block">
                                <input type="text" name="Num" value="<%= Num %>" lay-verify="required"
                                    lay-verType="tips" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md4">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">坐 标</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="strLngLat"
                                        value="<%= (Lng && Lat) ? (Lng +','+ Lat) : '' %>"
                                        placeholder="点击右侧图标选择经纬度" readonly autocomplete="off" class="layui-input">
                                </div>
                                <div class="layui-form-mid">
                                    <a href="javascript:;" data-event="selectMap">
                                        <i class="fa fa-map-marker"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md4">
                        <div class="layui-form-item">
                            <label class="layui-form-label">备 注</label>
                            <div class="layui-input-block">
                                <textarea name="Remark" placeholder="请输入备注信息"
                                    class="layui-textarea"><%= Remark %></textarea>
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