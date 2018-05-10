//主网
var address = 'n1PQsNSpCGTtPq4WKvMAaFdWpahRMFwFLvA';

var author = "";
//测试网
//var address = 'n1JaRjxBM7HZDXEbmnPcNWt5hTyeykKCzfL';

/* 日期对象扩展 */
Date.prototype.format = function(format) {
	format = format || "yyyy-MM-dd";
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	};

	if(/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

//浏览器加载判断是否安装NAS钱包
$().ready(function() {
	$('#loading').css('display', 'none');
	setTimeout(function() {
		checkNebulasWallet();
	}, 500);
});

//检测浏览器是否安装星云钱包
function checkNebulasWallet() {
	try {
		var NebPay = require("nebpay");
		var nebpay = new NebPay();
		console.log('星云钱包环境运行成功');
	} catch(e) {
		console.log('星云钱包环境运行错误', e);
		$('#notice').css('display', 'block');
	}
}

function cre() {
	var NebPay = require("nebpay");
	var nebpay = new NebPay();

	window.postMessage({
		"target": "contentscript",
		"data": {
			"to": address,
			"value": "0",
		},
		"method": "neb_sendTransaction"
	}, "*");

	$('#loading').css('display', 'block');
}

//回调监听
window.addEventListener('message', function(e) {

	var neb_call = "";
	var neb_sendTransaction = "";
	var contract = ""
	var method = "";
	var execute_err = "";
	var aut = "";

	try {
		contract = e.data.data.contract;
		method = e.data.method;
		neb_call = e.data.data.neb_call.result;
		execute_err = e.data.data.neb_call.execute_err;
		neb_sendTransaction = e.data.data.neb_sendTransaction.result;
		aut = e.data.txhash.txhash;
	} catch(err) {

	}
	console.log('数据返回：', e);

	if(aut) {
		console.log('author：', aut);
		this.author = author;
	}
	
	
    if(neb_call && neb_call == "null"){
        createBall();
        alert("生成成功");
    }else if(neb_call && neb_call != "null"){
    		alert(e)
    }

	$('#loading').css('display', 'none');
});

function createBall(){
	var ball = new Array();
	while(true) {
		var num = parseInt(Math.random() * 33, 10);
		var length = ball.length;
		for(var i = 0; i < length; i++) {
			if(ball[i] == num) {
				continue;
			}
		}
		ball[length] = num;
		if(ball.length == 6) {
			break;
		}
	}

	ball[ball.length] = parseInt(Math.random() * 16, 10)

	var number = "";
	for(var i = 0; i < ball.length; i++) {
		if(i != ball.length - 1) {
			number += ball[i] + ","
		} else {
			number += ball[i]
		}

	}

	var callArgs = "[\"" + date + "\",\"" + number + "\",\"" + author + "\"]";

	//	 nebpay.call(address, 0.0001, "save", callArgs, {listener: "over"});

	window.postMessage({
		"target": "contentscript",
		"data": {
			"to": address,
			"value": "0",
			"function": "save",
			"args": "[\"" + date + "\",\"" + number + "\",\"" + author + "\"]"
		},
		"method": "neb_sendTransaction"
	}, "*");

	$('#loading').css('display', 'block');
}


function select(){
	var add = $("#address").val();
	if(!add){
		alert("请添加地址");
		return;
	}
	
	window.postMessage({
        "target": "contentscript",
        "data":{
            "to" : address,
            "value" : "0",
            "contract" : {
                "function" : "get",
                "args" : "[\"" + add + "\"]"
            }
        },
        "method": "neb_call"
    }, "*");

}
