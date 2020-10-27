<div class="layui-form-dialog">
    <form class="layui-form">
        <div class="layui-form-item">
            <label class="layui-form-label">登录名</label>
            <div class="layui-input-block">
                <input type="text" name="UserId" value="<%= UserId %>" lay-verify="required" lay-verType="tips"
                    autocomplete="new-password" placeholder="请输入登录名" class="layui-input" />
                <input type="hidden" name="Id" value="<%= Id %>">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">密 码</label>
            <div class="layui-input-block">
                <input type="password" name="UserPwd" lay-verify="required" lay-verType="tips"
                    autocomplete="new-password" class="layui-input" placeholder="请输入登陆密码" />
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">是否启用</label>
            <div class="layui-input-block">
                <input type="radio" name="IsAble" value="true" title="是">
                <input type="radio" name="IsAble" value="false" title="否" checked>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea placeholder="请输入内容" name="Description" class="layui-textarea"><%= Description %></textarea>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button type="submit" class="layui-btn" lay-submit lay-filter="*">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重 置</button>
            </div>
        </div>
    </form>
</div>