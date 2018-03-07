var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
if( !wechatInfo ) {
    $("body").html('<img style="width: 100px;margin: 100px auto 0 auto;display: block;" src="images/icon80_smile.2x181c98.png"></br><p style="text-align: center;">请在微信客户端打开链接</p>');
} else if ( wechatInfo[1] < "5.0" ) {
    $("body").html('<img style="width: 100px;margin: 100px auto 0 auto;display: block;" src="images/icon80_smile.2x181c98.png"></br><p style="text-align: center;">本活动仅支持微信5.0以上版本</p>');
}

var appId;
var timestamp;
var nonceStr;
var signature;
var params;
$(function() {
params = parseQueryString(location.href);
$.ajax({
        url:myurl.jsconfigurl,
        type:'get',
        dataType:'json',
        data:{
            url:location.href
        },
        success:function(data, status){
            if (data.code == 0){
				appId = data.data.appId;
				timestamp = data.data.timestamp;
				nonceStr = data.data.nonceStr;
				signature = data.data.signature;
                wx.config({
					debug: config.debug,
                    appId: appId, 
                    timestamp: timestamp, 
                    nonceStr: nonceStr, 
                    signature: signature,
                    jsApiList: [
                    'chooseWXPay'
                    ]
                });
            }else{
                tips(null,data.desc);
            }
        },
        error:function(xhr, str, e){
            tips(e,error.system);
        }
    });


    $.ajax({
        url: myurl.oidurl.replace(myurl.token.oid, params.oid),
        type: 'get',
        dataType: 'json',
        success: function(data, status) {
            if (data.code == 0) {
                var pricesum = (data.data.price * data.data.quantity / 100).toFixed(2);
                $(".mycontainer").append("<div class='item'><div class='itemtop clearfix'><span class='showoid'>订单号："+data.data.oid+"</span><span class='status'>待付款</span></div><div class='itemcenter clearfix'><div class='centerleft'><img src='images/d2.jpg'></div><div class='centerright'><div class='inf'>"+data.data.productName+"</div><div class='infcount'><span>&times;"+data.data.quantity+"</span><span class='heji'><em>合计：</em>&yen;"+pricesum+"</span></div></div></div></div>");
                $("#receivername").html(data.data.receiverName);
                $("#receivercontact").html(data.data.receiverContact);
                $("#receiveraddress").html(data.data.receiverAddress);
                $("#pricesum").html(pricesum);
            } else {
                tips(null,data.desc);
            }
        },
        error: function(xhr, str, e) {
            tips(e,error.system);
        },
        complete: function() {
            hideLoading();
        }
    });
});

$(".wcallpay").bind("click",function(){
    showLoading();
    $.ajax({
        url:myurl.payurl.replace(myurl.token.oid, params.oid),
        type:'post',
        dataType:'json',
        data:{
            pay_type:0,
            out_user_id:params.openid
        },
        success:function(data, status){
            if (data.code == 0){
                wx.chooseWXPay({
                    timestamp: data.data.timeStamp,
                    nonceStr: data.data.nonceStr, 
                    package: data.data.package, 
                    signType: 'MD5', 
                    paySign: data.data.paySign, 
                    success: function (res) {
                        window.location.href = myurl.curl.replace(myurl.token.openid, params.openid);
                    },
                    fail:function(res){
                        window.location.href = myurl.aurl.replace(myurl.token.openid, params.openid);
                    },
                    cancel:function(res){
                        window.location.href = myurl.aurl.replace(myurl.token.openid, params.openid);
                    }
                });
            }else{
                tips(null,data.desc);
            }
        },
        error: function(xhr, str, e) {
            tips(e,error.system);
        },
        complete: function() {
            hideLoading();
        }
    });
});
$(".otherpay").bind('click', function() {
    tips(null,error.otherpay);
});
