/**
 * 
 */

//弹出警告框
var alertWarning = function(msg) {
	if (!msg) {
		msg = "操作失败！";
	}
	swal({
        title: "",
        text: msg,
        type: "warning"
    });
}

//弹出成功框
var alertSuccess = function(msg) {
	if (!msg) {
		msg = "操作成功！";
	}
	swal({
        title: "",
        text: msg,
        type: "success"
    });
}

//未选择点击编辑
var alertUpdateNone = function() {
	alertWarning("请选择一条记录！");
}

//未选择点击删除
var alertDeleteNone = function() {
	alertWarning("请至少选择一条记录！");
}

//弹出确认框
var alertConfirm = function(func, msg) {
	if (!msg) {
		msg = "您确定要继续吗？";
	}
	//确认或取消选择框
    swal({
    	title: "",
    	text: msg,
    	type: "warning",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        closeOnConfirm: false
    }, func);
}

var alertWithFunc = function(msg, type, func) {
	swal({
		title: "", 
		text: msg, 
		type: type
	}, func);
}

//显示模态框
var showModal = function($modal) {
	if ($modal) {
		$modal.modal({
            keyboard : false,
            backdrop : 'static',
            show : true
        });
	}
}

//显示加载层
var showLoading = function() {
	parent.$("#layout").css("display", "block");
	parent.$("#over").css("display", "block");
}

//移除加载层
var removeLoading = function() {
	parent.$("#layout").css("display", "none");
	parent.$("#over").css("display", "none");
}

//验证prettyFile
var validatePrettyFile = function($inputAppend, validate) {
	$inputAppend.on("focusout keyup focusInvalid focusCleanup", function(){
		validate.element($(this).prev(":file"));
	});
}

//上传背景图片
function uploadImage(formId,inputId,imgId){
	$("#"+formId).ajaxSubmit({
		type: "POST",
		dataType: "json",
		url: "/webservice/upload/uploadImage",
		success: function (data) {
			var webUrl = "http://p9mu5lfc8.bkt.clouddn.com/"
			if(data.code == 200){
				var url = data.data.key;
				$("#"+inputId).val(webUrl+url);
				$("#"+imgId).attr("src",webUrl+url);
			}
		},
		error: function () {
			alert("上传失败，请联系系统管理员！");
		},
		async: true
	});
}