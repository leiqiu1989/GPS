<div class="layui-form-dialog">
    <form class="layui-form">
        <input type="hidden" name="Id" value="<%= Id %>">
        <div class="layui-form-item">
            <label class="layui-form-label">角色名称</label>
            <div class="layui-input-block">
                <input type="text" name="RoleName" value="<%= RoleName %>" lay-verify="required" lay-vertype="tips" placeholder="请输入角色名" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea placeholder="请输入内容" name="Description" lay-verify="required" lay-vertype="tips" class="layui-textarea"><%= Description %></textarea>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button type="button" class="layui-btn" lay-submit lay-filter="*">立即提交</button>
            </div>
        </div>
    </form>
</div>