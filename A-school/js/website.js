var schoolCode, dataUrl, imgUrl, website, clientId, loginUrl, clientSecret, config, serviceHall;
//获取配置参数
ITSOFT.dataAjax({
	url: "webconfig.json",
	type: "get",
	contentType: "application/json; charset=utf-8",
	cache: false,
	async: false,
	success: function (res) {
		schoolCode = res.schoolCode;
		dataUrl = res.ipAddress;
		imgUrl = res.imgUrl;
		website = res.website;
		clientId = res.clientId;
		loginUrl = res.loginUrl;
		clientSecret = res.clientSecret;
		config = res.config;
		repairHall = res.repairHall;
		serviceHall = res.serviceHall;
	},
	error: function (res) {}
});
/**** ajax获取用户登录状态****/
var TokenKey = ITSOFT.cookie.getCookie('ITSOFT-WILAB-SESSION');
// var TokenKey = '955e5002d2f54cd4a4b8dfe96af681e7';
var token = getToken();

function getToken() {
	var tokenBody = {}
	tokenBody.tokenKey = TokenKey;
	tokenBody.clientId = clientId;
	tokenBody.timestamp = (new Date()).valueOf();
	let strTokenBody = JSON.stringify(tokenBody);
	//加密
	strTokenBody = Encrypt(strTokenBody, clientSecret, clientId)
	return strTokenBody
}
//遍历所有模版
var loadAllTmpl = function () {
	$("script[type='text/x-dot-template']").each(function (i, o) {
		loadTmpl("#" + $(this).attr("id"));
	});
};

//加载模版
var loadTmpl = function (tmpl) {
	//获取数据地址
	var Data = eval('(' + $(tmpl).attr("data") + ')');
	var strurl = dataUrl + Data.url;
	var dataVal;
	var ispage = Data.isPage;
	//schoolCode
	dataVal = {
		schoolCode: schoolCode,
		website: website
	}
	// 失物招领加参数
	if(Data.url == "micro/frontendManager/lostList" && tmpl == "#loadData11") {
		dataVal.condition = JSON.stringify([{andOr: 'and',searchField: 'status',operator: '=',searchValue: '1'},{andOr: 'and',searchField: 'type',operator: '=',searchValue: '1'}])
	}
	if(Data.url == "micro/frontendManager/lostList" && tmpl == "#loadData12") {
		dataVal.condition = JSON.stringify([{andOr: 'and',searchField: 'status',operator: '=',searchValue: '1'},{andOr: 'and',searchField: 'type',operator: '=',searchValue: '2'}])			// 招领
	}
	//加上传递的参数	
	if (!!Data.data) {
		if (Data.data.length > 0) {
			$.each(Data.data, function (i, res) {
				var temp = res.split('=')[0];
				dataVal[temp] = res.split('=')[1]
			})
		}
	}
	var tmplHtml = $(tmpl).html();
	var tmplParent = $(tmpl).parent();
	if ($(tmpl).attr("parentid") != undefined) {
		tmplParent = $("#" + $(tmpl).attr("parentid"));
		console.log(tmplParent)
	}
	ITSOFT.dataAjax({
		url: strurl,
		data: dataVal,
		type: "post",
		'Content-Type': "application/x-www-form-urlencoded",
		cache: false,
		async: true,
		beforeSend: function () {
			// tmplParent.html("<p>加载中...</p>");
		},
		success: function (res) {
						// console.log(res);
			var errorcode = res.errorCode;
			switch (errorcode) {
				case 0: 
					var tempFn = doT.template(tmplHtml);
					tmplParent.html(tempFn(res.data));
					if (ispage == "1") {
						if (!!res.data.page) {
							var rowstotal = res.data.page;
							if (typeof (rowstotal) != "undefined") {
								page(rowstotal);
							}
						}
					}
					break;
					default:
					break;
			}
		},
		error: function (res) {

		}
	});
	
    // 调用layui的相册
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.photos({
            photos: '.layer-photos'
            , anim: 5
        });
	});
};