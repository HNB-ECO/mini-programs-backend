/**
 * Created by Administrator on 2018/5/21.
 */
/**
 * Created by Administrator on 2018/5/23.
 */
/**
 * Created by Administrator on 2018/5/22.
 */

//row全局变量
var row;
//全局table对象
var $table;
//全局类型id
var goodTypeId = "";
//是否可以编辑添加
var canSave = false;
var param = new Object();



//时间戳转时间
function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}

$("#btnSearch").on('click',function(){
    $table.bootstrapTable('refresh', {pageNumber: 1});
})


$().ready(function(){

    window.operateEvents = {
        'click .RoleOfedit': function (e, value, row, index) {
            workOrderId = value
            alertConfirm(function(){
                $.ajax({
                    url: "/admin/admin/blockAdmin",
                    type: "post",
                    data: {
                        adminId:value
                    },
                    cache: false,
                    beforeSend: function() {
                        showLoading();
                    },
                    complete: function() {
                        removeLoading();
                    },
                    success: function(data) {
                        $table.bootstrapTable('refresh', {pageNumber: 1});
                        alertSuccess("操作成功");
                    },
                    error: function() {
                        alertWarning();
                    }
                })
            }, "确定冻结该账户？");
        },
        'click .FailOfedit': function (e, value, row, index) {
            alertConfirm(function(){
                $.ajax({
                    url: "/admin/admin/resetPassword",
                    type: "post",
                    data: {
                        adminId:value
                    },
                    cache: false,
                    beforeSend: function() {
                        showLoading();
                    },
                    complete: function() {
                        removeLoading();
                    },
                    success: function(data) {
                        $table.bootstrapTable('refresh', {pageNumber: 1});
                        alertSuccess("操作成功");
                    },
                    error: function() {
                        alertWarning();
                    }
                })
            }, "确定重置密码？");
        },
        'click .DetailOfedit': function (e, value, row, index) {

            console.log(row)
            $.ajax({
                url: "/admin/admin/adminDetail",
                type: "get",
                data: {
                    adminId:value
                },
                cache: false,
                beforeSend: function() {
                    showLoading();
                },
                complete: function() {
                    removeLoading();
                },
                success: function(data) {
                    $("#moreModal").modal('show')
                    $("#username").val(data.data.username)
                    $("#password").val(data.data.password)
                    $("#role").val(data.data.role)
                },
                error: function() {
                    alertWarning();
                }
            })
        }
    };

    $table = $('#table');
    $table.bootstrapTable({
        url: "/admin/admin/pageList",//加载数据的url
        // uniqueId: "goodNameId",
        pagination:true,//是否分页
        pageSize: 10,  //每页显示的记录数
        queryParams: function (params) {
            //页号
            param["pageNum"] = params.pageNumber;
            //////每页条数
            param["pageSize"] = params.pageSize;
            //////排序方式
            //param["orderBy"] = params.sortOrder;
            //额外的参数
            param["userName"] = $("#useName").val();
            return param;
        },
        //onLoadSuccess: function(data){  //加载成功时执行
        //    alert("加载成功"+data);
        //},
        onLoadError: function(){  //加载失败时执行
            alert("加载失败");
        },
        columns: [
            {
                field : "state",
                checkbox : true
            },
            {
                field : "role",
                title : "角色",
            },
            {
                field : "username",
                title : "管理员",
            },
            {
                field : "address",
                title : "地址",
            },
            {
                field : "isDelete",
                title : "状态",
                formatter : function (value, row, index) {
                    var str = '';
                    if( value == 0){
                        str = "正常"
                    }else{
                        str = "冻结"
                    }
                    return str;
                },

            },
            {
                field : "department",
                title : "部门",
            },
            {
                field: 'id',
                title: '操作',
                width: '100px',
                align:'center',
                events: operateEvents,
                formatter:  function operateFormatter(value, row, index) {
                    return [
                        '<input type="submit" value="冻结账户" class="RoleOfedit btn btn-primary  btn-sm"   data-toggle="modal"  style="display:inline-block" >',
                        '<input type="submit" value="重置密码" class="FailOfedit btn btn-danger btn-sm"  style="display: inline-block"  data-toggle="modal"  style="display:inline-block;margin-left: 3px" >',
                        '<input type="submit" value="查看明细" class="DetailOfedit btn btn-warning  btn-sm"   data-toggle="modal"  style="display:inline-block;margin-left: 2px" >',
                    ].join('');
                }
            }

        ],
        responseHandler: function(res) {
            console.log(res)
            return {
                "total": res.data.total,//总页数
                "rows": res.data.list  //数据
            };
        },

    });


    //保存模态框初始内容
    var saveModalBodyHtml = $("#saveModal .modal-body").html();
    //导入模态框初始内容
    var importModalBodyHtml = $("#importModal .modal-body").html();

    //保存模态框关闭事件
    $('#saveModal').on('hidden.bs.modal', function (e) {
        //初始化模态框
        $(this).find(".modal-body").html(saveModalBodyHtml);
        $(this).find(".modal-body select").selectpicker();
        initICheck();
    });

    //导入模态框关闭事件
    $('#importModal').on('hidden.bs.modal', function (e) {
        //初始化模态框
        $(this).find(".modal-body").html(importModalBodyHtml);
    });

    //添加
    $("#addBtn").on("click", function() {
        if (canSave) {
            alertWarning("请先选择商品类别！");
            return;
        }
        var $modal = $("#saveModal");
        $modal.find(".modal-title").text("添加");
        $modal.find("#lx").val(goodTypeId);
        saveFormValidate();
        //显示模态框
        showModal($modal);
    });

    //初始化单选框
    initICheck();

    //添加保存按钮
    $("#saveBtn").on("click", function() {
        $("#saveModal form").submit();
    });

    //编辑
    $("#updateBtn").on("click", function () {
        //获取表格已选择项数组
        var checkArr = $table.bootstrapTable('getSelections');
        if (checkArr.length != 1) {
            alertUpdateNone();
            return;
        }
        //选中row
        row = checkArr[0];
        openEdit(row.id);
    });

    //删除
    $("#deleteBtn").on("click", function () {
        //获取表格已选择项数组
        var checkArr = $table.bootstrapTable('getSelections');
        if (checkArr.length == 0) {
            alertDeleteNone();
            return;
        }
        var ids = getIds(checkArr, "id");
        console.log(ids)
        //确认或取消选择框
        alertConfirm(function(){
            $.ajax({
                url: "/admin/admin/deleteAdmin",
                type: "post",
                data: {
                    adminId: ids
                },
                cache: false,
                dataType: "json",
                beforeSend: function() {
                    showLoading();
                },
                complete: function() {
                    removeLoading();
                },
                success: function(data) {
                    $table.bootstrapTable('refresh', {pageNumber: 1});
                    alertSuccess("删除成功");
                },
                error: function() {
                    alertWarning();
                }
            })
        }, "您确定要删除已选择的记录吗？");
    });

    //导出
    $("#reprotGood").on("click",function(){
        alertConfirm(function(){
            var params = getGoodExportParams("search");
            location.href = "../report/report!goodReport.html?" + $.param(params);
            alertSuccess("导出成功");
        }, "您确定要导出这些记录吗？");
    });

    //导入按钮点击事件
    $("#importBtn").on("click", function() {
        if (canSave) {
            alertWarning("请先选择商品类别！");
            return;
        }
        var $modal = $("#importModal");
        $modal.find('.modal-body :file').prettyFile();
        importFormValidate();
        //显示模态框
        showModal($modal);
    });

    $("#importSaveBtn").on("click", function() {
        $("#importModal form").submit();
    })

    //树形视图
    $("#jsTree").jstree({
        'core' : {
            'data' : {
                "url" : "../manage/good!getJsTreeFormatData.html",
                'dataType': 'json'
            }
        },
        'plugins': ['types', 'dnd'],
        "types": {
            "default": {
                "icon": "fa fa-folder"
            }
        }
    }).on('changed.jstree',function(e,data){
        //当前选中节点的id
        goodTypeId = data.instance.get_node(data.selected[0]).id;
        if (goodTypeId == "j1_1" || goodTypeId == 0) {
            goodTypeId = "";
        }
        $table.bootstrapTable('refresh', {pageNumber: 1});
        if (data.node.children.length) {
            canSave = false;
        } else {
            canSave = true;
        }
    });
});

/**
 * 获取导出文件所需的参数
 */
var getGoodExportParams = function(prefix) {
    var params = new Object();
    for (var key in param) {
        if (key.indexOf(".") > 1) {
            params['goodSearch' + key.substring(key.indexOf("."))] = $.trim(param[key]);
        }
    }
    params["orderField"] = param["orderField"];
    params["orderDirection"] = param["orderDirection"];
    return params;
}

var openEdit = function(id){
    $.ajax({
        type: "get",
        url: "/admin/goodsType/getGoodsTypeInfo",
        data: {
            goodsTypeId: id
        },
        cache: false,
        dataType: "json",
        beforeSend: function() {
            showLoading();
        },
        complete: function() {
            removeLoading();
        },
        success: function(data) {
            var $modal = $("#saveModal");
            $modal.find(".modal-title").text("编辑");
            $modal.find("#khmc").selectpicker('val', data.data.userIdList);
            $modal.find("#cpbm").val(data.data.goodShortName);
            $modal.find("#cpmc").val(data.data.goodName);
            if (data.data.goodMergeContainerType == 1) {
                $modal.find("#yes").iCheck('check');
            } else {
                $modal.find("#no").iCheck('check');
            }
            if (data.data.transiType == 2) {
                $modal.find("#tran-yes").iCheck('check');
            } else {
                $modal.find("#tran-no").iCheck('check');
            }

            if (data.data.thawType == 1) {
                $modal.find("#thaw-type-yes").iCheck('check');
            } else {
                $modal.find("#thaw-type-no").iCheck('check');
            }

            if (data.data.transiTypeStatus == 1) {
                $modal.find("#transiTypeStatus-yes").iCheck('check');
            } else {
                $modal.find("#transiTypeStatus-no").iCheck('check');
            }

            $modal.find("#description").val(data.data.description);
            $modal.find("#goodTypeName").val(data.data.goodTypeName);
            $modal.find("#ranking").val(data.data.ranking);
            //$modal.find("#dw").val(data.data.goodUnit);
            //$modal.find("#tpzdsl").val(data.data.containerInfoNum);
            //$modal.find("#bh").val(data.data.goodNameId);
            //$modal.find("#lx").val(data.data.goodTypeId);
            //$modal.find("#bzxs").val(data.data.packageStyle);
            //$modal.find("#bzsl").val(data.data.packageNum);
            //$modal.find("#aqkc").val(data.data.safeStock);
            //$modal.find("#wxkc").val(data.data.dangerStock);

            saveFormValidate();
            //显示模态框
            showModal($modal);
        },
        error: function() {
            alertWarning();
        }
    })
}

var initICheck = function() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $(".input-check:even").iCheck('check');

    $('.input-check:lt(2)').on("ifChecked", function (event) {
        var $this = $(this);
        var $nextDiv = $this.parent().parent().parent().parent().parent().next("div");
        if ($this.val() == 1) {
            $nextDiv.css("display", "block");
        } else {
            $nextDiv.css("display", "none");
            $nextDiv.find("input").val("");
        }
    });

}

var saveFormValidate = function() {
    $("#saveModal form").validate({
        submitHandler: function(form) {   //表单提交句柄,为一回调函数，带一个参数：form
            $.ajax({
                url: "/admin/admin/createAdmin",
                type: "post",
                cache: false,
                data: $(form).serialize(),
                //dataType: "json",
                beforeSend: function() {
                    showLoading();
                },
                complete: function() {
                    removeLoading();
                },
                success: function(data) {
                    console.log(data)
                    $("#saveModal").modal("hide");
                    //刷新表格
                    $table.bootstrapTable('refresh', {pageNumber: 1});
                    alertSuccess("保存成功");
                },
                error: function() {
                    alertWarning();
                }
            });
        },
        rules: {
            "goodsName.goodShortName": {
                required: true,
                maxlength: 20,
                remote: {
                    url: "../manage/good!checkShortName.html",
                    data: {
                        "goodsName.goodShortName": function() {
                            return $("#cpbm").val();
                        },
                        "goodsName.goodNameId": $("#bh").val(),
                        "customer.userId": $("#khmc").val()
                    }
                }
            },
            "goodsName.goodName": {
                required: true,
                maxlength: 60
            },
            "goodsName.goodMergeContainerCode": {
                required: true,
                maxlength: 200
            },
            "goodsName.goodSpecification": {
                required: true,
                maxlength: 20
            },
            "goodsName.goodWeight": {
                required: true,
                number: true
            },
            "goodsName.goodUnit": {
                required: true,
                maxlength: 20
            },
            "goodsName.packageStyle": {
                required: true,
                maxlength: 50
            },
            "goodsName.packageNum": {
                required: true,
                digits: true
            },
            "goodsName.containerInfoNum": {
                required: true,
                digits: true
            },
            "goodsName.safeStock": {
                required: true,
                digits: true
            },
            "goodsName.dangerStock": {
                required: true,
                digits: true
            }
        }
    });
}

var importFormValidate = function() {
    var validate = $("#importModal form").validate({
        ignore: ".input-large",
        submitHandler: function(form) {   //表单提交句柄,为一回调函数，带一个参数：form
            $(form).ajaxSubmit({
                url: "../manage/good!saveImport.html",
                type: "post",
                data: {
                    "inputInfo.goodTypeId": goodTypeId
                },
                dataType: "json",
                beforeSend: function() {
                    showLoading();
                },
                complete: function() {
                    removeLoading();
                },
                success: function(data) {
                    if (data.errcode != 0) {
                        alertWarning(data.errmsg);
                        return;
                    }
                    $("#importModal").modal("hide");
                    //刷新表格
                    $table.bootstrapTable('refresh', {pageNumber: 1});
                    alertSuccess("导入成功");
                },
                error: function(data) {
                    alertWarning();
                }
            });
        },
        rules: {
            file: "required"
        }
    });
    validatePrettyFile($("#importModal form .input-append"), validate);
}