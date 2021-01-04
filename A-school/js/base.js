var ITSOFT = {
	// 封装ajax请求
	dataAjax: function(item) {
		var _default = {
			"url": null, //发送请求的地址。
			"async": false, //是否设置为异步  false 同步，true 异步
			"cache": false, //是否缓存
			"data": null, //数据
			"contentType": "application/x-www-form-urlencoded; charset=utf-8",
			"dataType": "json", // (默认: Intelligent Guess (xml, json, script, or html))
			"timeout": "1200000", //设置请求超时时间（毫秒）
			"type": item.type, //请求类型 (比如i "POST", "GET", "PUT");， 默认为 "GET"
			"beforeSend": function() {},
			"success": function(result) {}, //请求成功后的回调函数。
			"error": function() {}, //请求失败时调用此函数。
			"complete": function(XMLHttpRequest, textStatus) {}, //请求完成后回调函数 (请求success 和 rror之后均调用)。
			"loading": null //加载中  相对面板
		};
		$.extend(true, _default, item);
		var sendData = _default.data;
		var _url = _default.url;
		if(!sendData) {
			_default.data = {};
		}
		$.extend(true, _default.data, sendData);
		var plObj;
		_default.beforeSend = function(result) {
			if(!!_default.loading) {
				plObj = _default.loading.pageLoading();
				plObj.Init();
			}
			if(typeof item.beforeSend == "function") {
				item.beforeSend(result);
			}
		};
		_default.success = function(result) {
			if(typeof item.success == "function") {
				item.success(result);
			}
		};
		_default.complete = function(XMLHttpRequest, textStatus) {
			try {
				var rtext = JSON.parse(XMLHttpRequest.responseText);
				if(rtext.code == "0") {
					top.location = rtext.redirectUrl;
				}
			} catch(e) {
				//TODO handle the exception
			}
			if(!!_default.loading) {
				plObj.Close();
			}
			if(typeof item.complete == "function") {
				item.complete(XMLHttpRequest, textStatus);
			}
		};
		return $.ajax(_default);
	},
	getUrlParam: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	},
	dateFormat: function(dateTime, type, isHour) {
		if(typeof(dateTime) == "string") {
			dateTime = new Date(dateTime.split(" ")[0]);
		} else if(typeof(dateTime) == "number") {
			dateTime = parseInt(dateTime) > 10000000000 ? parseInt(dateTime) : parseInt(dateTime) * 1000;
			dateTime = new Date(dateTime);
		}
		var strDate = "";
		if(!!dateTime) {
			var year = dateTime.getFullYear();
			var month = dateTime.getMonth() + 1;
			var day = dateTime.getDate();
			if(type == 1) {
				strDate = year + '年' + ((month > 9) ? month : '0' + month) + '月' + ((day > 9) ? day : '0' + day) + "日";
			} else {
				strDate = year + '-' + ((month > 9) ? month : '0' + month) + '-' + ((day > 9) ? day : '0' + day);
			}
			if(!!isHour) {
				var oh = time.getHours();
				var omi = time.getMinutes();
				var os = time.getSeconds();
				strDate += " " + (oh > 9 ? oh : "0" + oh) + ":" + (omi > 9 ? omi : "0" + omi) + ":" + (os > 9 ? os : "0" + os);
			}
		}
		return strDate;
	},
	cookie: {
		//TODO 取得cookie   
		getCookie: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';'); //把cookie分割成组    
			// console.log(document.cookie)
			for(var i = 0; i < ca.length; i++) {
				var c = ca[i]; //取得字符串    
				while(c.charAt(0) == ' ') { //判断一下字符串有没有前导空格    
					c = c.substring(1, c.length); //有的话，从第二位开始取    
				}
				if(c.indexOf(nameEQ) == 0) { //如果含有我们要的name    
					console.log(unescape(c.substring(nameEQ.length, c.length)))
					return unescape(c.substring(nameEQ.length, c.length)); //解码并截取我们要值    
				}
			}
			return false;
		},
		//TODO 清除cookie    
		clearCookie: function(name) {
			ITSOFT.cookie.setCookie(name, "");
		},
		//TODO 设置cookie    
		setCookie: function(name, value, seconds) {
			seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个根php不一样。    
			var expires = "";
			if(seconds != 0) { //设置cookie生存时间    
				var date = new Date();
				date.setTime(date.getTime() + (seconds * 1000));
				expires = "; expires=" + date.toGMTString();
			}
			document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值    
		}
		//调用一下上面方法：  
		//ITSOFT.tools.cookiesetCookie("test","tank",1800);         //设置cookie的值，生存时间半个小时    
		//alert(ITSOFT.tools.cookiegetCookie('test'));                     //取得cookie的值，显示tank    
		//ITSOFT.tools.cookieclearCookie("test");                           //删除cookie的值    
		//alert(ITSOFT.tools.cookiegetCookie('test'));                     //test对应的cookie值为空，显示为false.就是getCookie最后返的false值。   
	},
};
// 下拉框
(function($) {
	$.fn.dropdownlist = function(_option) {
		var _this = this;
		var _default = {
			"heightBody": "200px", //最大高度
			"width": "120px", //宽度
			"data": null, //静态数据
			"dataurl": null, //远程数据
			"page": false, //远程调用是否分页，主要是解决检索，不过不分页本地过滤，否则远程检索数据
			"url": null, //远程调用地址load页面加载
			"contentType": "application/json; charset=utf-8",
			"type": "GET", //远程调用方法
			"queryParams": {}, //发送参数
			"selectValue": "", //选中的值
			"selectText": "", //选中的值
			"placeholder": "", //默认，比如“请选择”
			'upOrDown': "down", //指定弹出层弹出方向down,up
			'autoLoad': false, //是否自动加载，如果不自动加载，需要点击下拉时加载数据
			'allowinput': false, // 是否允许输入
			"changeEvent": function(value, text) {
				return false;
			} //回调改变事件,返回 选中的value, text
		};
		$.extend(true, _default, _option);
		_this.init = function() {
			var parentname = $(_this).attr("name");
			//console.warn(parentname)
			var $ddHeader = $("<div class='ddHeader'/>");
			var $inputtext = $("<input/>");
			var $inputvalue = $("<input/>");
			$inputtext.addClass("select-input")
				.attr("name", parentname + "text")
				.attr("id", parentname + "text");
			$inputvalue.attr("type", "hidden")
				.attr("name", parentname + "value")
				.attr("id", parentname + "value");
			//是否允许输入(加载面板是不允许输入)
			if(!_default.allowinput || !!_default.url) {
				$inputtext.attr("readonly", true);
			}
			$inputtext.val(_default.selectText);
			$inputtext.attr("data", _default.selectText);
			$inputvalue.val(_default.selectValue);
			$ddHeader.append($inputtext).append($inputvalue);
			var $delicon = $("<span/>");
			$delicon.addClass("caret");
			$ddHeader.append($delicon);
			$(_this).append($ddHeader);
			$ddHeader.width(_default.width);
			var $ddbody = $("<div class='ddbody'/>").css({
				"max-height": _default.heightBody,
				"min-height": "40px",
				"width": _default.width
			});
			$(_this).append($ddbody);
			$inputtext.width($ddHeader.width() - 35);
			$ddHeader.on("click", function(e) {
				if(showOrHideDropdown($(_this))) {
					if(!!_default.url) {
						_this.loadPanel();
					} else {
						_this.loadData();
					}

				}
				e.stopPropagation();
			});
			if(_default.placeholder.length > 0) {
				$inputtext.attr("placeholder", _default.placeholder);
			}
		};
		_this.loadData = function(queryParams) {
			$.extend(true, _default.queryParams, queryParams);
			var $loading = $("<div class='loading'>加载中...</div>");
			var $ddbody = $(this).children(".ddbody");
			var $datalist = $ddbody.children("ul");
			if($datalist.length > 0) {
				return false;
			}
			$ddbody.append($loading);
			var data = _default.data;
			if(!!_default.dataurl) {
				ITSOFT.dataAjax({
					url: _default.dataurl,
					type: _default.type,
					async: false,
					data: JSON.stringify(_default.queryParams),
					contentType: _default.contentType,
					beforeSend: function() {},
					success: function(res) {
						var errorcode = res.errorCode;
						switch(errorcode) {
							case 3: //nologin
								top.location.href.reload();
							case 0: //ok
								data = res.data;
								break;
							default:
								var winoption = {
									type: 1,
									area: ['400px', '300px'],
									title: "<span style='color:red'>出错了</span>",
									shift: 2, //打开动画效果
									content: '<div class="pd-10 pageerror">' + res.message + '</div>'
								};
								ITSOFT.itWin.open(winoption);
								break;
						}
					},
					complete: function() {

					},
					error: function() {
						data = null;
						ITSOFT.tools.showMsg("error", "数据加载失败")
					}
				});
			}
			var listHTML = "";
			var pname = $(_this).attr("name");
			if(_default.placeholder.length > 0 && !_default.allowinput) {
				listHTML += '<li text="" value="">' + _default.placeholder + '</li>';
			}
			if(!!data) {
				var id, text;
				$.each(data, function(i, o) {
					id = o.id, text = o.text;
					if(_default.autoLoad && _default.selectValue.length == 0 && i == 0) {
						$("#" + pname + "value").val(id);
						$("#" + pname + "text").val(text);
					}
					listHTML += '<li text="' + text + '" value="' + id + '">' + text + '</li>';
				});
				if(listHTML.length > 0) {
					$ddbody.append($("<ul class='dropdownul'/>"));
					$ddbody.children("ul").html(listHTML);
					this.each(function() {
						$(this).on("click", "li", function(event) {
							$(this).addClass("selectedrow").siblings().removeClass("selectedrow");
							_this.valueChange();
						});
					});
				}
			}
			$ddbody.children(".loading").remove();
			if(_default.upOrDown == "up") {
				$ddbody.css("top", -$ddbody.height() - 3);
				$ddbody.addClass("up");
			}
		};
		//失去焦点blur
		$(_this).on("blur", ".select-input", function(event) {
			var pname = $(_this).attr("id");
			if(typeof(pname) != "undefined") {
				var value = $("#" + pname + "value").val();
				var text = $("#" + pname + "text").val();
				if(value.length > 0) {
					//判断文本是否一样
					var data = $("#" + pname + "text").attr("data");
					if(text != data) {
						$("#" + pname + "text").val(data);
					}
				} else {
					$("#" + pname + "text").val("");
				}
			}
		});
		var _time;
		//键盘操作
		$(_this).on("keyup", ".select-input", function(event) {
			var key = event.which;
			if(key >= 119 && key <= 121) return false; //F功能键盘
			if(key >= 16 && key <= 20) return false; //shift组合键盘
			if(key == 37 || key == 39) return false; //左右键盘
			switch(key) {
				case 13: //回车
					//选中数据
					var curmenurow = $(_this).find(".selectedrow");
					if(curmenurow.length > 0) {
						_this.valueChange();
					}
					break;
				case 38: //上箭头
				case 40: //下箭头
					if($(_this).find(".ddbody").is(":hidden")) {
						showOrHideDropdown($(_this), true);
						return false;
					}
					var $rows = $(_this).find("li:visible");
					if($rows.length == 0) return;
					var curmenurow = $(_this).find(".selectedrow");
					var selectrow = -1;
					if(curmenurow.length > 0) {
						selectrow = $rows.index(curmenurow);
					}
					if(selectrow == 0 && key == 38) return;
					if(selectrow == $rows.length - 1 && key == 40) return;
					if(key == 40) selectrow++;
					if(key == 38) selectrow--;
					$(_this).find(".selectedrow").removeClass("selectedrow");
					curmenurow = $rows.eq(selectrow);
					$(curmenurow).addClass("selectedrow");
					var tp = selectrow * 50 - $(_this).find(".dropdownul").height();
					$(_this).find(".ddbody").scrollTop(tp);
					break;
				default:
					$(_this).find(".selectedrow").removeClass("selectedrow");
					if($(_this).find(".ddbody").is(":hidden")) {
						showOrHideDropdown($(_this), true);
					}
					var val = $(this).val().replace(/^\s+|\s+$/g, "");
					if(_default.page) {
						//远程过滤
						var sv = {
							"search": val
						};
						_this.loadData(sv);

					} else {
						var trs = $(_this).find("li");
						if(val.length > 0) {
							trs.hide().filter(":contains('" + val + "')").show();
						} else {
							trs.filter(":hidden").show();
						}
					}
					break;

			}
		});
		//改变事件
		_this.valueChange = function() {
			var pname = $(_this).attr("id");
			var $selectrow = $(_this).find(".selectedrow");
			if($selectrow.length > 0) {
				var value = $selectrow.attr("value");
				var text = $selectrow.attr("text");
				$("#" + pname + "value").val(value);
				$("#" + pname + "text").val(text);
				$("#" + pname + "text").attr("data", text);

			} else {
				$("#" + pname + "value").val("");
				$("#" + pname + "text").val("");
				$("#" + pname + "text").attr("data", "");
			}
			$("#" + pname + "text").focus();
			showOrHideDropdown($(_this), false);
			return _option.changeEvent(value, text);
		};
		//设置值
		_this.setValueText = function(value, text) {
			var pname = $(_this).attr("id");
			$("#" + pname + "value").val(value);
			$("#" + pname + "text").val(text);
			$("#" + pname + "text").attr("data", text);
		};
		//取值
		_this.getValueText = function() {
			var pname = $(_this).attr("id");
			var selectitem = {
				value: $("#" + pname + "value").val(),
				text: $("#" + pname + "text").val()
			};
			return selectitem;
		};
		//获取值
		//加载面版
		_this.loadPanel = function() {
			var $loading = $("<div class='loading'>加载中...</div>");
			var $ddbody = $(this).children(".ddbody");
			var $datalist = $ddbody.children("ul");
			if($datalist.length > 0) {
				return false;
			}
			$ddbody.append($loading);
			$ddbody.load(_default.url);
			$ddbody.children(".loading").remove();
		};
		/*展开、关闭面板
		 * $dropdownlist: 面板
		 * isShow：是否展开面板  bool类型  true 展开  false 闭合 
		 * 		      未设置此参数时自动判断面板当前状态
		 * ********************************************************/
		function showOrHideDropdown($dropdownlist, isShow) {
			if(!$dropdownlist || $dropdownlist.length == 0) {
				return false;
			}
			var $ddbody;
			if(isShow == undefined) {
				$ddbody = $dropdownlist.find(".ddbody");
				isShow = $ddbody.is(":hidden");
			} else if(!!isShow) {
				$ddbody = $dropdownlist.find(".ddbody:hidden");
			} else {
				$ddbody = $dropdownlist.find(".ddbody:not(:hidden)");
			}
			if(!!isShow) { //如果为展开面板，先关闭其他面板
				var $ddbodyh = $(".dropdownlist>.ddbody:not(:hidden)");
				if(!!$ddbodyh && $ddbodyh.length > 0) {
					$ddbodyh.hide();
					$(".caret-up").removeClass("caret-up");
				}
			}
			var $fa = $dropdownlist.find("span");
			if(isShow) {
				$ddbody.show();
				$fa.addClass("caret-up");
			} else {
				$ddbody.hide();
				$fa.removeClass("caret-up");
			}
			return isShow;
		};
		_this.init(); //初始化
		//自动加载数据
		if(_default.autoLoad) {
			_this.loadData();
		}
		return _this;
	};
})(jQuery);