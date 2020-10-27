define(function (require, exports, module) {
    'use strict';
    var common = require('common');
    var api = require('api');


    // 模板
    var tpls = {
        index: require('../../tpl/user/index'),
        add: require('../../tpl/user/add')
    };

    var user = function () {};

    $.extend(user.prototype, {
        init: function (param) {
            common.renderContent(tpls.index);
            this.initTable();
        },
        initTable: function () {
            var me = this;
            var table = common.initTable({
                elem: '#userTbList',
                //url: api.getUserList,
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
                    limit: 20,
                    layout: ['count']
                },
                toolbar: '#topToolbar',
                height: 'full-120',                
                cols: [
                    [ //表头
                        {
                            title: '',
                            field: 'Id',
                            type: 'checkbox'
                        },
                        {
                            title: '登录名',
                            field: 'UserId',
                            width: 100
                        },
                        {
                            title: '角色',
                            field: 'RoleName',
                            width: 120
                        },
                        {
                            title: '是否启用',
                            field: 'IsAble',
                            width: 100,
                            templet: function (d) {
                                return d.IsAble ? '是' : '否'
                            }
                        },
                        {
                            title: '创建时间',
                            field: 'AddDate',
                            templet: function (d) {
                                return d.AddDate ? new Date(d.AddDate).format('yyyy/MM/dd hh:mm') : '';
                            }
                        },
                        {
                            title: '备 注',
                            field: 'Description'
                        },
                        {
                            title: '操作',
                            width: 250,
                            align: 'left',
                            toolbar: '#toolbar'
                        }
                    ]
                ],
                layFilter: 'userFilter',
                layFilterEvent: function (obj) {
                    var data = obj.data,
                        layEvent = obj.event;
                    if (layEvent === 'areaAuthorization') {
                        me.areaAuthorization(data.Id);
                    } else if (layEvent === 'setrole') {
                        me.setRole(data);
                    } else if (layEvent === 'finger') {
                        me.finger(data.Id);
                    }
                },
                layFilterToolbarEvent: function (obj) {
                    if (obj.event == 'add') {
                        me.editUser();
                    }
                }
            });
        },
        setRole: function (data) {
            var me = this;
            var id = data.Id;
            var checkData = data.RoleId.split(',');
            common.layUIDialog({
                title: '设置角色',
                id: 'set-role',
                type: 1,
                content: '<div id="dialogSetRole" class="ztree"></div>',
                area: ['300px', '500px'],
                success: function (layerEl) {
                    common.initTree({
                        url: api.role.list,
                        param: {},
                        loadingEl: '#set-role',
                        treeId: 'dialogSetRole',
                        idKey: 'id',
                        pIdKey: 'pid',
                        name: 'name',
                        checkEnable: true,
                        isProcess: false,
                        ajaxCallBack: function (res) {
                            var data = _.map(res.data || [], function (item) {
                                return {
                                    id: item.Id,
                                    name: item.RoleName,
                                    pid: 0
                                };
                            });
                            return {
                                IsSuccess: true,
                                Data: data
                            }
                        },
                        dataFilter: function (data) {
                            _.each(checkData, function (id) {
                                var rt = _.find(data, function (obj) {
                                    return obj.id == parseInt(id);
                                });
                                if (rt) {
                                    rt.checked = true;
                                }
                            });
                            return data;
                        },
                        callback: function (e, treeId, treeNode) {
                            var zTree = $.fn.zTree.getZTreeObj('dialogSetRole');
                            zTree.checkNode(treeNode, !treeNode.checked, true);
                        },
                        initCallBack: function () {
                            var zTree = $.fn.zTree.getZTreeObj('dialogSetRole');
                            var nodes = zTree.getCheckedNodes(true);
                            _.each(nodes, function (node) {
                                zTree.checkNode(node, true, true);
                            });
                        }
                    });
                },
                btnAlign: 'c',
                btn: ['确 定', '关 闭'],
                yes: function (index) {
                    var zTree = $.fn.zTree.getZTreeObj('dialogSetRole');
                    var nodes = zTree.getCheckedNodes(true);
                    var roleIds = _.map(nodes, function (item) {
                        return item.id;
                    });
                    me.setUserRole(id, roleIds);
                    layer.close(index);
                },
                btn2: function (index) {
                    layer.close(index)
                }
            });
        },
        setUserRole: function (id, roleIds) {
            var me = this;
            common.fetchData({
                url: api.SetUserRole,
                data: JSON.stringify({
                    userId: id,
                    roleIds: roleIds
                }),
                method: 'POST',
                callback: function (res) {
                    if (res && res.success) {
                        common.layMsg('操作成功');
                    }
                }
            });
        },
        areaAuthorization: function (id) {
            var me = this;
            common.fetchData({
                url: api.getUserADCDRole,
                data: {
                    userId: id
                },
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var checkData = res.Data;
                        common.layUIDialog({
                            title: '区域授权',
                            id: 'author-area',
                            type: 1,
                            content: '<div id="dialogAreaAuthor" class="ztree"></div>',
                            area: ['300px', '500px'],
                            success: function (layerEl) {
                                common.initTree({
                                    url: api.getAreaList,
                                    param: {
                                        userAuthorization: true
                                    },
                                    treeId: 'dialogAreaAuthor',
                                    idKey: 'ADCD',
                                    pIdKey: 'ParentCode',
                                    loadingEl: '#author-area',
                                    isParentEl: true,
                                    name: 'ADNM',
                                    checkEnable: true,
                                    expandChildFlag: true,
                                    dataFilter: function (data) {
                                        _.each(checkData, function (item) {
                                            var rt = _.find(data, function (obj) {
                                                return obj.ADCD == item.ADCD;
                                            });
                                            if (rt) {
                                                rt.checked = true;
                                            }
                                        });
                                        return data;
                                    },
                                    callback: function (e, treeId, treeNode) {
                                        var zTree = $.fn.zTree.getZTreeObj('dialogAreaAuthor');
                                        zTree.checkNode(treeNode, !treeNode.checked, true);
                                    },
                                    initCallBack: function () {
                                        var zTree = $.fn.zTree.getZTreeObj('dialogAreaAuthor');
                                        var nodes = zTree.getCheckedNodes(true);
                                        _.each(nodes, function (node) {
                                            zTree.checkNode(node, true, true);
                                        });
                                    }
                                });
                            },
                            btnAlign: 'c',
                            btn: ['确 定', '关 闭'],
                            yes: function (index) {
                                var rt = common.recursionNode('dialogAreaAuthor');
                                me.setUserADCDRole(rt.arrayCodes, id);
                                layer.close(index);
                            },
                            btn2: function (index) {
                                layer.close(index)
                            }
                        });
                    }
                }
            });
        },
        setUserADCDRole: function (codes, id) {
            var me = this;
            if (codes.length) {
                var data = _.map(codes, function (code) {
                    return {
                        ADCD: code
                    }
                });
                common.fetchData({
                    url: api.setUserADCDRole,
                    data: JSON.stringify({
                        roleADCDS: data,
                        userId: id
                    }),
                    method: 'POST',
                    callback: function (res) {
                        if (res && res.success) {
                            common.layMsg('操作成功');
                        }
                    }
                });
            }
        },
        editUser: function (data) {
            var me = this;
            data = data || {};
            var isAdd = _.isEmpty(data);
            var _html = template.compile(tpls.add)($.extend(data, {
                isAdd: isAdd
            }));
            var title = isAdd ? '新增用户信息' : '编辑用户信息';
            common.layUIDialog({
                title: title,
                type: 1,
                content: _html,
                area: ['450px', '400px'],
                success: function (layero, index) {
                    common.renderForm(function (form) {
                        form.on('submit(*)', function (data) {
                            var submitData = data.field;
                            var url = submitData.Id ? api.editUser : api.addUser;
                            common.fetchData({
                                url: url,
                                data: JSON.stringify(submitData),
                                method: 'POST',
                                callback: function (res) {
                                    if (res && res.success) {
                                        layer.close(index);
                                        me.table.reload('userTbList');
                                    }
                                }
                            });
                            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                        });
                    });
                }
            });
        },
        getUserByUserId: function (id) {
            var me = this;
            common.fetchData({
                url: api.getUserByUserId,
                data: {
                    id: id
                },
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var data = res.Data;
                        me.editDialog(data);
                    }
                }
            });
        },
        event: function () {
            var me = this;
            $('#content').off().on('click', '.js-add', function () {
                me.editDialog();
            }).on('click', '.js-edit', function () {
                var rt = common.getSelectedRow(me.table, 'userTbList');
                rt.success && me.getUserByUserId(rt.data.Id);
            }).on('click', '.js-del', function () {
                var rt = common.getSelectedRow(me.table, 'userTbList');
                if (rt.success) {
                    common.layConfirm('确定删除该该用户?', function () {
                        common.fetchData({
                            url: api.deleteUser,
                            data: {
                                idList: rt.data.Id
                            },
                            callback: function (res) {
                                if (res && res.success) {
                                    me.table.reload('userTbList');
                                }
                            }
                        });
                    });
                }
            });
        }
    });

    var _user = new user();

    exports.init = function (param) {
        _user.init(param);
    };
});