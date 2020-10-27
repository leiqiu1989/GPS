<div class="layuimini-page-anim">
    <div class="layui-row">
        <div class="layui-col-md12">
            <table class="layui-hide" lay-filter="roleTb" lay-data="{id:'roleTbList'}" id="roleTbList">
            </table>
        </div>
    </div>
</div>

<script type="text/html" id="topToolbar">
    <button type="button" lay-event="add" class="layui-btn layui-btn-primary layui-btn-sm">
        <i class="layui-icon">&#xe654;</i>
    </button>
</script>
<script type="text/html" id="toolbar">
    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="lookUser">查看成员</a>
    <a class="layui-btn layui-btn-xs" lay-event="authorization">角色授权</a>
    <a class="layui-btn layui-btn-xs" lay-event="edit">编 辑</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete">删 除</a>
</script>