<div class="layuimini-page-anim">
    <hr class="layui-bg-gray">
    <div class="layui-form layui-form-search">
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">油库名称</label>
                <div class="layui-input-inline">
                    <input type="text" class="layui-input" name="oilDeptName" placeholder="请输入油库名称">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn" lay-submit lay-filter="search">查 询</button>
                <button class="layui-btn layui-btn-primary" lay-submit lay-filter="reset">重 置</button>
            </div>
        </div>
    </div>
    <hr class="layui-bg-gray">
    <table class="layui-hide" lay-filter="tboilDepot" lay-data="{id:'oilDepotTblist'}" id="oilDepotTblist">
    </table>
</div>

<script type="text/html" id="topToolbar">
    <button type="button" lay-event="add" class="layui-btn layui-btn-primary layui-btn-sm">
        <i class="layui-icon">&#xe654;</i>
    </button>
    <button type="button" lay-event="paramSend" class="layui-btn layui-btn-primary layui-btn-sm">
        参数下发
    </button>
</script>

<script type="text/html" id="toolbar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">
        编 辑
    </a>
    <!--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete">
        删 除
    </a>-->
</script>