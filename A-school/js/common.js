function KeywordSearch(send_url, divTgs) {
    var strwhere = "";
    var str = $.trim($(divTgs).val());
    if (str.length > 0) {
        strwhere += "?keyword=" + encodeURI($(divTgs).val());
    }
    window.location.href = send_url + strwhere;
    return false;
}

function KeshiSearch(send_url, keshi) {
    var strwhere = "";
    if (keshi.length > 0) {
        strwhere += "?keyword=" + keshi;
    }
    window.location.href = send_url + strwhere;
    return false;
}

function validatemobile(mobile) {
    if (mobile.length != 11) {
        alert('请输入有效的手机号码，需是11位！');
        return false;
    }

    var myreg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;;
    if (!myreg.test(mobile)) {
        alert('请输入有效的手机号码！');
        return false;
    }
    return true;
}

//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}

//产生随机数函数
function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}



/*检测浏览器方法
------------------------------------------------*/
var pageurl = window.location.search;
if (pageurl == '?m2w') {
    addCookie('m2wcookie', '1', 0);
}
if (getCookie('m2wcookie') != '1' && browserRedirect()) {
    location.href = 'http://www.xianqixia.com/mobile/index.aspx';
}


/*工具类方法
------------------------------------------------*/
//检测是否移动设备来访
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    } else {
        return false;
    }
}

// 图片放大：Dom是要绑定的节点, 该img节点需要有可以获取的src属性值
function imgBig(Dom) {
    $(document).on("click", Dom, function () {
        let url = $(this).attr("src")
        window.open(url)
        return false
    })
}