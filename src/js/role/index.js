define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');

    // 模板
    var tpls = {
        index: require('../../tpl/role/index'),
        add: require('../../tpl/role/add')
    };

    var roleManager = function () {};

    $.extend(roleManager.prototype, {
        init: function (param) {
            common.renderContent(tpls.index);
            this.initTable();
        },
        initTable: function () {
            var me = this;

            var table = common.initTable({
                elem: '#roleTbList',
                //url: api.role.list,
                isLocal: true,
                data: [{
                    Id: 1,
                    UserId: 'admin',
                    RoleName: '超级管理员',
                    IsAble: true,
                    AddDate: new Date(),
                    Description: '系统内部账号'
                }],
                page: {
                    layout: ['count']
                },
                toolbar: '#topToolbar',
                height: 'full-160',
                cols: [
                    [ //表头
                        {
                            title: '角色名称',
                            field: 'RoleName',
                            width: 200
                        },
                        {
                            title: '角色描述',
                            field: 'Description',
                            width: 300
                        },
                        {
                            width: 300,
                            align: 'left',
                            toolbar: '#toolbar'
                        }
                    ]
                ],
                layFilter: 'roleTb',
                layFilterEvent: function (obj) {
                    var data = obj.data,
                        layEvent = obj.event;
                    var id = data.Id;
                    switch (layEvent) {
                        case 'edit':
                            me.getRoleDetail(id);
                            break;
                        case 'delete':
                            me.deleteRole(id);
                            break;
                        case 'lookUser':
                            me.getUser(id);
                            break;
                        case 'authorization':
                            me.authorizationRole(id);
                            break;
                    }
                },
                layFilterToolbarEvent: function (obj) {
                    if (obj.event == 'add') {
                        me.editRole();
                    }
                }
            });
        },
        authorizationRole: function (id) {
            var me = this;
            common.layUIDialog({
                title: '角色授权',
                type: 1,
                content: '<div id="authorizationTree" class="ztree"></div>',
                area: ['300px', '500px'],
                success: function () {
                    common.initTree({
                        url: api.role.authorization,
                        param: {
                            roleId: id
                        },
                        treeId: 'authorizationTree',
                        idKey: 'MenuId',
                        pIdKey: 'MenuParentId',
                        name: 'MenuName',
                        checkEnable: true,
                        isProcess: false,
                        dataFilter: function (data) {
                            return _.each(data, function (item) {
                                if (item.Checked && item.IsButton) {
                                    item.checked = true;
                                }
                            });
                        },
                        initCallBack: function () {
                            var zTree = $.fn.zTree.getZTreeObj('authorizationTree');
                            var nodes = zTree.getCheckedNodes(true);
                            _.each(nodes, function (node) {
                                zTree.checkNode(node, true, true);
                            });
                        },
                        zTreeOnCheck: function (e, treeId, treeNode) {
                            if (treeNode.IsButton) {
                                var zTree = $.fn.zTree.getZTreeObj('authorizationTree');
                                var nodes = zTree.getNodesByFilter(function (node) {
                                    return node.IsButton;
                                }, false, treeNode.getParentNode());
                                // 非浏览
                                if (treeNode.IsBaseButton) {
                                    var checked = treeNode.checked;
                                    if (!checked) {
                                        _.each(nodes, function (item) {
                                            zTree.checkNode(item, false, true);
                                        });
                                    }
                                } else {
                                    var browserButtonNode = _.find(nodes, function (item) {
                                        return item.IsBaseButton;
                                    });
                                    if (!browserButtonNode.checked) {
                                        zTree.checkNode(browserButtonNode, true, true);
                                    }
                                }
                            }
                        }
                    });
                },
                btnAlign: 'c',
                btn: ['确 定', '关 闭'],
                yes: function (index) {
                    var zTree = $.fn.zTree.getZTreeObj('authorizationTree');
                    var checks = zTree.getCheckedNodes(true);
                    // 获取是按钮的复选框
                    checks = _.filter(checks, function (item) {
                        return item.IsButton;
                    });
                    var len = checks.length;
                    var menuIds = len > 0 ? _.map(checks, function (item) {
                        return item.MenuId;
                    }) : [];
                    if (menuIds.length < 1) {
                        common.layAlert('请勾选角色所属操作');
                        return false;
                    }
                    me.setMenuRoleButton(menuIds.join(','), id);
                    layer.close(index);
                },
                btn2: function (index) {
                    layer.close(index)
                }
            });
        },
        setMenuRoleButton: function (menuIds, roleId) {
            common.fetchData({
                url: api.role.menuRoleButton,
                data: {
                    menuIds: menuIds,
                    roleId: roleId
                },
                callback: function (res) {
                    if (res && res.success) {
                        common.layMsg('角色授权成功,页面自动刷新');
                        setTimeout(function () {
                            location.reload();
                        }, 1500);
                    } else {
                        var msg = res.msg || '操作失败';
                        common.layAlert(msg);
                        return false;
                    }
                }
            });
        },
        getUser: function (id) {
            common.fetchData({
                url: api.role.users,
                data: {
                    roleId: id
                },
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var data = res.Data || [];
                        common.layUIDialog({
                            title: '成员列表',
                            type: 1,
                            offset: 'auto',
                            content: '<table class="layui-hide" id="roleUserTb"></table>',
                            area: ['450px', '400px'],
                            success: function () {
                                common.initTable({
                                    elem: '#roleUserTb',
                                    isLocal: true,
                                    data: data,
                                    page: {
                                        layout: ['count']
                                    },
                                    height: 300,
                                    isFilter: false,
                                    cols: [
                                        [ //表头
                                            {
                                                title: '登录名',
                                                field: 'UserId',
                                                width: 150
                                            },
                                            {
                                                title: '姓名',
                                                field: 'UserName',
                                                width: 150
                                            },
                                            {
                                                title: '是否启用',
                                                width: 100,
                                                field: 'IsAble',
                                                templet: function (d) {
                                                    return d.IsAble ? '是' : '否';
                                                }
                                            }
                                        ]
                                    ]
                                });
                            },
                            btnAlign: 'r',
                            btn: ['关 闭'],
                            yes: function (index) {
                                layer.close(index);
                            }
                        });
                    }
                }
            });
        },
        deleteRole: function (id) {
            var me = this;
            common.layConfirm('确定删除该角色?', function () {
                common.fetchData({
                    url: api.role.delete,
                    data: {
                        Id: id
                    },
                    callback: function (res) {
                        if (res && res.success) {
                            me.table.reload('roleTbList');
                        } else {
                            var msg = res.msg || '操作失败';
                            common.layAlert(msg);
                            return false;
                        }
                    }
                });
            });
        },
        getRoleDetail: function (id) {
            var me = this;
            common.fetchData({
                url: api.role.detail,
                data: {
                    Id: id
                },
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var data = res.Data || {};
                        me.addEditRole(data);
                    }
                }
            });
        },
        editRole: function (data) {
            var me = this;
            data = data || {};
            var isAdd = _.isEmpty(data);
            var _html = template.compile(tpls.add)(data);
            var title = isAdd ? '新增角色' : '编辑角色';
            common.layUIDialog({
                title: title,
                type: 1,
                content: _html,
                area: ['450px', '280px'],
                success: function (layero, index) {
                    common.renderForm(function (form) {
                        form.on('submit(*)', function (data) {
                            var submitData = data.field;
                            common.fetchData({
                                url: api.role.update,
                                data: JSON.stringify(submitData),
                                method: 'POST',
                                callback: function (res) {
                                    if (res && res.success) {
                                        layer.close(index);
                                        me.table.reload('roleTbList');
                                    }
                                }
                            });
                            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                        });
                    });
                }
            });
        }
    });

    var _roleManager = new roleManager();

    exports.init = function (param) {
        _roleManager.init(param);
    };
});