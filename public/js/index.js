/**
 * author wlx
 */
//=====================登录页面回车键登录============================//
$('#adminlogin').on('click',function(){
    adminlogin();
});
$('#userlogin').on('click',function(){
    userlogin();
});
$('#username').on('keydown',function(){
    if(enterkey()){
        $('#userlogin').click();
    }
});
$('#userpsd').on('keydown',function(){
    if(enterkey()){
        $('#userlogin').click();
    }
});
$('#adminpsd').on('keydown',function(){
    if(enterkey()){
        $('#adminlogin').click();
    }
});
$('#admintel').on('keydown',function(){
    if(enterkey()){
        $('#adminlogin').click();
    }
});
//=====================添加管理员页面add_admin.html============================//
$('#adminTel').on('blur',function(){telCheck();allCheck(4);});
$('#adminTel').on('focus',hideTelCheck);

$('#rePassword').on('blur',function(){repsdCheck();allCheck(4);});
$('#rePassword').on('focus',hidePsdCheck);

$('#rePassword1').on('blur',function(){repsdCheck1();allCheck(4);});
$('#rePassword1').on('focus',hidePsdCheck1);

$('.checkNull').on('blur',function(){check($(this));allCheck(4);});
$('.checkNull').on('focus',function(){hide($(this));});

//======================注册页面register.html====================//
$('#userName').on('blur',function(){userCheck();allCheck(8);});
$('#userName').on('focus',hideUserCheck);

$('.recheckNull').on('blur',function(){check($(this));allCheck(8);});
$('.recheckNull').on('focus',function(){hide($(this));});

$('#userTel').on('blur',function(){justTelCheck();allCheck(8);});
$('#userTel').on('focus',function(){hide($(this));});

$('#ID_no').on('blur',function(){idCardCheck();allCheck(8);});
$('#ID_no').on('focus',function(){hide($(this));});
//==================检测各项输入是否为空========================//
function check($this){
    var value = $this.val();
    if(value == ""||value == null){
        $this.parent().parent().attr('class','has-error');
        $this.parent().next().show();
    }else{
        $this.parent().parent().attr("class","has-feedback");
        $this.next().show();
    }
}
function hide($this){
    $this.parent().parent().removeClass();
    $this.parent().next().hide();
    $this.next().hide();
}
//==================检测用户名是否重复===================//
function userCheck(){
    var $this = $("#userName");
    var username = $this.val();
    if(username == ""||username == null){
        showUserCheck('error');
    }else{
        var data = {"username":username};
        var jsondata = JSON.stringify(data);
        $.ajax({
            url : '/reg/check',
            type : 'post',
            data : jsondata,
            contentType : 'application/json',
            success : function(rel){
                if(rel.data == 0){
                    showUserCheck('ok');
                }else if(rel.data == 1){
                    showUserCheck('warning');
                }
            },
            error : function(){
                alert("服务器请求错误！");
                document.location.href='/reg';
            }
        });
    }
}
function showUserCheck(status){
    var $this = $("#userName");
    if(status == 'ok'){
        $this.parent().parent().attr("class","has-feedback");
        $this.next().show();
    }else if(status == 'warning'){
        $this.parent().parent().attr("class","has-warning");
        $(".user-warning").show();
    }else{
        $this.parent().parent().attr("class","has-error");
        $(".user-error").show();
    }
}
function hideUserCheck(){
    var $this = $("#userName");
    $this.parent().parent().removeClass();
    $this.next().hide();
    $(".user-error").hide();
    $(".user-warning").hide();
}
//==================检测手机号码========================//
function telCheck(){
    var $this = $("#adminTel");
    var adminTel = $this.val();
    if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(adminTel))){
        showTelCheck($this,'error');
    }else{
        var data = {"adminTel":adminTel};
        var jsondata = JSON.stringify(data);
        $.ajax({
            url : '/add/check',
            type : 'post',
            data : jsondata,
            contentType : 'application/json',
            success : function(rel){
                if(rel.data == 0){
                    showTelCheck($this,'ok');
                }else if(rel.data == 1){
                    showTelCheck($this,'warning');
                }
            },
            error : function(){
                alert("服务器请求错误！");
                document.location.href='/add';
            }
        });
    }
}
function showTelCheck($this,status){
    if(status == 'ok'){
        $this.parent().parent().attr("class","has-feedback");
        $this.next().show();
    }else if(status == 'warning'){
        $this.parent().parent().attr("class","has-warning");
        $(".tel-warning").show();
    }else{
        $this.parent().parent().attr("class","has-error");
        $(".tel-error").show();
    }
}
function hideTelCheck(){
    var $this = $("#adminTel");
    $this.parent().parent().removeClass();
    $this.next().hide();
    $(".tel-error").hide();
    $(".tel-warning").hide();
}
function justTelCheck(){
    var $this = $("#userTel");
    var adminTel = $this.val();
    if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(adminTel))){
        showTelCheck($this,'error');
    }else{
        showTelCheck($this,'ok');
    }
}
//===================检测密码一致性=====================//
function repsdCheck(){
    var password = $("#password").val();
    var repsd = $("#rePassword").val();
    if(password != repsd){
        $("#rePassword").parent().parent().attr('class','has-error');
        $(".psd-error").show();
    }else{
        $("#rePassword").parent().parent().attr("class","has-feedback");
        $("#rePassword").next().show();
    }
}
function hidePsdCheck(){
    var $this = $("#rePassword");
    $this.parent().parent().removeClass();
    $(".psd-error").hide();
}//===================检测支付密码一致性=====================//
function repsdCheck1(){
    var password = $("#paypsd").val();
    var repsd = $("#rePassword1").val();
    if(password != repsd){
        $("#rePassword1").parent().parent().attr('class','has-error');
        $(".psd-error1").show();
    }else{
        $("#rePassword1").parent().parent().attr("class","has-feedback");
        $("#rePassword1").next().show();
    }
}
function hidePsdCheck1(){
    var $this = $("#rePassword1");
    $this.parent().parent().removeClass();
    $(".psd-error1").hide();
}
//====================检测是否输入完成========================//
function allCheck(val){
    var status = $("#add_admin>div");
    var length = status.length;
    var value = 0;
    for(var i=0;i<length;i++){
        var statu = status.eq(i).hasClass('has-feedback');
        if(statu == true){
            value++;
        }
    }
    if(value == val){
        $("#addadmin").removeAttr('disabled');
    }else{
        $("#addadmin").attr('disabled','disabled');
    }
}
//===============检测身份证号码=============================//
function idCardCheck(){
    var $this = $("#ID_no");
    var ID_no = $this.val();
    if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(ID_no))){
        $this.parent().parent().attr("class","has-error");
        $this.parent().next().show();
    }else{
        $this.parent().parent().attr("class","has-feedback");
        $this.next().show();
    }
}
//===========================================end==================================================//
$(".usercheck").on('click',usercheck);
function usercheck(){
    var creditnum = $(this).parent().siblings().filter(".creditnum").val();
    var username = $(this).parent().siblings().filter(".username").val();
    var name = $(this).parent().siblings().filter(".name").val();
    var tel = $(this).parent().siblings().filter(".tel").val();
    var time = $(this).parent().siblings().filter(".time").val();
    var hour = $(this).parent().siblings().filter(".hour").val();
    var ID_no = $(this).parent().siblings().filter(".ID_no").val();
    var sex = $(this).parent().siblings().filter(".sex").val();
    var addr = $(this).parent().siblings().filter(".addr").val();
    var userid = $(this).parent().siblings().filter(".id").val();
    var html ='';
    html += '<div class="main-cont">';
    html += '  <div class=" mt10 bg_write w660">';
    html += '  <h3 class="red">用户信息<b class="status">(未审核)</b></h3>';
    html += '    <div><ul class=" clearfix"><li>银行账号：<em>'+creditnum+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>用户名：<em>'+username+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>申请时间：<em>'+time+' '+hour+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>姓名：<em>'+name+'</em></li><li>性别：<em>'+sex+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>联系电话：<em>'+tel+'</em></li><li>身份证号码：<em>'+ID_no+'</em></li></ul>';
    html += '         <div class="dash_underline"></div>';
    html += '         <ul class=" clearfix"><li>地址：<em style="word-break:break-all;">'+addr+'</em></li></ul></div>';
    html += '</div></div>';
	art.dialog({
        title : '用户审核',
        content : html,
        width:620,
        height:300,
        lock:true,
        button:[{
            name : "审核通过",
            callback : function(){
                var data = {"userid":userid,'state':0};
                var jsondata = JSON.stringify(data);
                $.ajax({
                    url : '/adminindex',
                    type : 'post',
                    data : jsondata,
                    contentType : 'application/json',
                    success : function(rel){
                        if(rel.data == 0) {
                            alert('审核通过！');
                            window.location.reload();
                        }
                    },
                    error : function(rel){
                        alert('操作失败！');
                        window.location.reload();
                    }
                });
            }
        },{
            name : "审核不通过",
            callback : function(){
                var data = {"userid":userid,'state':1};
                var jsondata = JSON.stringify(data);
                $.ajax({
                    url : '/adminindex',
                    type : 'post',
                    data : jsondata,
                    contentType : 'application/json',
                    success : function(rel){
                        if(rel.data == 0) {
                            alert('审核不通过！');
                            window.location.reload();
                        }
                    },
                    error : function(rel){
                        alert('操作失败！');
                        window.location.reload();
                    }
                });
            }
        },{
            name : "删除该用户",
            callback : function(){
                if(confirm("确定要删除吗？")){
                    var data = {"userid":userid,'state':2};
                    var jsondata = JSON.stringify(data);
                    $.ajax({
                        url : '/adminindex',
                        type : 'post',
                        data : jsondata,
                        contentType : 'application/json',
                        success : function(rel){
                            if(rel.data == 0) {
                                alert('删除成功！');
                                window.location.reload();
                            }
                        },
                        error : function(rel){
                            alert('操作失败！');
                            window.location.reload();
                        }
                    });
                }
            }
        },{
            name : "返回",
            callback : function(){
                return true;
            }
        }]
    })
}
$(".userlook").on('click',userlook);
$(".userlookno").on('click',userlook);
function userlook(content){
    var limit = $(this).parent().siblings().filter(".limit").val();
    var content ="";
    if(limit == 1){
        content = "已审核通过";
    }else if(limit == 2){
        content = "审核未通过";
    }
    var creditnum = $(this).parent().siblings().filter(".creditnum").val();
    var username = $(this).parent().siblings().filter(".username").val();
    var name = $(this).parent().siblings().filter(".name").val();
    var tel = $(this).parent().siblings().filter(".tel").val();
    var time = $(this).parent().siblings().filter(".time").val();
    var hour = $(this).parent().siblings().filter(".hour").val();
    var ID_no = $(this).parent().siblings().filter(".ID_no").val();
    var sex = $(this).parent().siblings().filter(".sex").val();
    var addr = $(this).parent().siblings().filter(".addr").val();
    var userid = $(this).parent().siblings().filter(".id").val();
    var html ='';
    html += '<div class="main-cont">';
    html += '  <div class=" mt10 bg_write w660">';
    html += '  <h3 class="red">用户信息<b class="status">('+content+')</b></h3>';
    html += '    <div><ul class=" clearfix"><li>银行账号：<em>'+creditnum+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>用户名：<em>'+username+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>申请时间：<em>'+time+' '+hour+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>姓名：<em>'+name+'</em></li><li>性别：<em>'+sex+'</em></li></ul>';
    html += '         <ul class=" clearfix"><li>联系电话：<em>'+tel+'</em></li><li>身份证号码：<em>'+ID_no+'</em></li></ul>';
    html += '         <div class="dash_underline"></div>';
    html += '         <ul class=" clearfix"><li>地址：<em style="word-break:break-all;">'+addr+'</em></li></ul></div>';
    html += '</div></div>';
    art.dialog({
        title : '查看信息',
        content : html,
        width:620,
        height:300,
        lock:true,
        button:[{
            name : "删除该用户",
            callback : function(){
                if(confirm("确定要删除吗？")){
                    var data = {"userid":userid,'state':2};
                    var jsondata = JSON.stringify(data);
                    $.ajax({
                        url : '/adminindex',
                        type : 'post',
                        data : jsondata,
                        contentType : 'application/json',
                        success : function(rel){
                            if(rel.data == 0) {
                                alert('删除成功！');
                                window.location.reload();
                            }
                        },
                        error : function(rel){
                            alert('操作失败！');
                            window.location.reload();
                        }
                    });
                }
            }
        },{
            name : "返回",
            callback : function(){
                return true;
            }
        }]
    })
}
function withdraw(){
    var property = $('.property').text();
    var userid = $('#userid').val();
    var html ='';
    html += '<div class="art-balance">当前的余额:';
    html += '  <a href="javascript:;" class="red">'+ property +'</a>';
    html += '元</div>';
    html += '<div>';
    html += '  <div class="">';
    html += '    <input type="text" class="form-control" id="withdrawAmount" placeholder="请输入金额">';
    html += '    <span class="glyphicon glyphicon-ok form-control-feedback gl" style="display: none;"></span>';
    html += '  </div>';
    html += '  <label class="control-label withdraw" for="inputError">输入错误！</label>';
    html += '</div>';
    html += '<div id="pay">';
    html += '  <div>';
    html += '    <input type="text" class="form-control" id="payPassword" placeholder="请输入支付密码">';
    html += '    <span class="glyphicon glyphicon-ok form-control-feedback gl" style="display: none;"></span>';
    html += '  </div>';
    html += '  <label class="control-label withdraw" for="inputError">密码错误！</label>';
    html += '</div>';
    html += '<script src="/js/checkWithdraw.js"></script>';
    art.dialog({
        title : '取款',
        content : html,
        width:400,
        height:200,
        lock:true,
        button:[{
            name : '确定取款',
            callback : function(){
                var amountStatus = $("#withdrawAmount").parent().parent().hasClass("has-feedback");
                var psdStatus = $("#payPassword").parent().parent().hasClass("has-feedback");
                if(amountStatus && psdStatus){
                    var amount = $("#withdrawAmount").val();
                    var paypsd = $("#payPassword").val();
                    var data = {'amount':amount,'userid':userid};
                    var jsondata = JSON.stringify(data);
                    $.ajax({
                        url : '/user/withdraw',
                        type : 'post',
                        data : jsondata,
                        contentType : 'application/json',
                        success : function(rel){
                            if(rel.data == 0){
                                alert('取款成功！当前余额为：'+rel.sum);
                                window.location.reload();
                            }else{
                                alert('取款失败！');
                                return true;
                            }
                        },
                        error : function(){
                            alert("服务器请求错误！");
                            document.location.href='/404';
                        }
                    });
                }else{
                    alert('输入错误！');
                    return false;
                }
            }
        },{
            name : '取消',
            callback : function(){
                return true;
            }
        }]
    })
}
function recharge(){
    var userid = $('#userid').val();
    var html ='';
    html += '<div>';
    html += '  <div class="">';
    html += '    <input type="text" class="form-control" id="rechargeAmount" placeholder="请输入金额">';
    html += '    <span class="glyphicon glyphicon-ok form-control-feedback gl" style="display: none;"></span>';
    html += '  </div>';
    html += '  <label class="control-label withdraw" for="inputError">输入错误！</label>';
    html += '</div>';
    html += '<script src="/js/checkWithdraw.js"></script>';
    art.dialog({
        title : '充值',
        content : html,
        width:400,
        height:200,
        lock:true,
        button:[{
            name : '确定充值',
            callback : function(){
                var status = $("#rechargeAmount").parent().parent().hasClass("has-feedback");
                if(status){
                    var amount = $('#rechargeAmount').val();
                    var data = {'amount':amount,'userid':userid};
                    var jsondata = JSON.stringify(data);
                    $.ajax({
                        url : '/user/recharge',
                        type : 'post',
                        data : jsondata,
                        contentType : 'application/json',
                        success : function(rel){
                            if(rel.data == 0){
                                alert('存款成功！当前余额为：'+rel.sum);
                                window.location.reload();
                            }else{
                                alert('存款失败！');
                                return true;
                            }
                        },
                        error : function(){
                            alert("服务器请求错误！");
                            document.location.href='/404';
                        }
                    });
                }else{
                    alert('输入错误！');
                    return false;
                }
            }
        },{
            name : '取消',
            callback : function(){
                return true;
            }
        }]
    })
}
$('.delete').on('click',deleteNote);
function deleteNote(){
    if(confirm("确定要删除吗？")) {
        var hisid = $(this).next().val();
        var data = {'hisid': hisid};
        var jsondata = JSON.stringify(data);
        $.ajax({
            url: '/user/delete',
            type: 'post',
            data: jsondata,
            contentType: 'application/json',
            success: function (rel) {
                if(rel.data == 0){
                    alert('删除成功！');
                    window.location.reload();
                }else{
                    alert('删除失败！');
                    return true;
                }
            },
            error : function(){
                alert("服务器请求错误！");
                document.location.href='/404';
            }
        });
    }
}
//================================================================================================//
function adminlogin(){
    var admintel = $("#admintel").val();
    var adminpsd = $("#adminpsd").val();
    var data = {"admintel":admintel,"adminpsd":adminpsd};
    var jsondata = JSON.stringify(data);
    $.ajax({
        url : '/login/admin',
        type : 'post',
        data : jsondata,
        contentType : 'application/json',
        success : function(rel){
            if(rel.data == 0){
                window.location.href = '/adminindex/0';
                return;
            }else if(rel.data == 1){
                alert("用户名和密码不符！");
                window.location.href = '/login';
            }else{
               alert("输入错误！");
                window.location.href = '/login';
            }
        },
        error : function(){
            alert("登录失败！");
            window.location.href = '/login';
        }
    });
}
function userlogin(){
    var username = $("#username").val();
    var userpsd = $("#userpsd").val();
    var data = {"username":username,"userpsd":userpsd};
    var jsondata = JSON.stringify(data);
    $.ajax({
        url : '/login/user',
        type : 'post',
        data : jsondata,
        contentType : 'application/json',
        success : function(rel) {
            if (rel.data == 0) {
                window.location.href = '/userindex';
                return;
            } else if (rel.data == 1) {
                alert("用户名不存在或用户名和密码不符！");
                window.location.href = '/login';
            } else if (rel.data == 2) {
                alert("该用户未审核！");
                window.location.href = '/login';
            } else if (rel.data == 3) {
                alert("该用户未通过审核！");
                window.location.href = '/login';
            } else {
                alert("输入错误！");
                window.location.href = '/login';
            }
        },
        error : function(){
            alert("登录失败！");
            window.location.href = '/login';
        }
    });
}
//=======================================检测确定键====================================================//
function enterkey(){
    if(event.keyCode == 13){
        return true;
    }else{
        return false;
    }
}
