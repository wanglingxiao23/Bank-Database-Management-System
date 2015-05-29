

$("#withdrawAmount").on("blur",function(){
    var property = $('.property').text();
    checkAmount(property,$(this));
});
$("#withdrawAmount").on("focus",function(){hide($(this));});
$("#payPassword").on("blur",function(){
    var userid = $('#userid').val();
    checkPayPsd(userid,$("#payPassword").val(),$(this));
});
$("#payPassword").on("focus",function(){hide($(this));});
$("#rechargeAmount").on("blur",function(){check($(this));});
$("#rechargeAmount").on("focus",function(){hide($(this));});
function checkPayPsd(userId,paypsd,$this){
    var value = $this.val();
    if(value == ""||value == null){
        $this.parent().parent().attr('class','has-error');
        $this.parent().next().show();
    }else{
        var data = {'userid':userId,'paypsd':paypsd};
        var jsondata = JSON.stringify(data);
        $.ajax({
            url : '/user/checkPaypsd',
            type : 'post',
            data : jsondata,
            contentType : 'application/json',
            success : function(rel){
                if(rel.data == 0){
                    $this.parent().parent().attr("class","has-feedback");
                    $this.next().show();
                }else if(rel.data == 1) {
                    $this.parent().parent().attr('class','has-error');
                    $this.parent().next().show();
                }
            }
        });
    }
}
function checkAmount(property,$this){
    var value = $this.val();
    if(value == ""||value == null||value == "0" ||value > property){
        $this.parent().parent().attr('class','has-error');
        $this.parent().next().show();
    }else{
        $this.parent().parent().attr("class","has-feedback");
        $this.next().show();
    }
}
//==================检测各项输入是否为空========================//
function check($this){
    var value = $this.val();
    if(value == ""||value == null||value == "0"){
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