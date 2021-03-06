function vk() {
    var api_url = "https://api.vk.com/method/";
    var _self = this;
    this.getToken = function (callback) {
	var scope = 4096;
	var touken_url = 'https://oauth.vk.com/authorize?client_id=4640574&scope='+scope+'&redirect_uri=https://oauth.vk.com/blank.html&display=mobile&v=5.26&response_type=token';
	window.plugins.ChildBrowser.showWebPage(touken_url, {showLocationBar: false});

	window.plugins.ChildBrowser.onLocationChange = function (url) {
	    if (url.indexOf('//oauth.vk.com/blank.html#access_token') >= 0) {
		var params = url.split("#")[1];
		var _params = params.split('&');
		console.log(_params);
		params = [];
		for (var key in _params) {
		    var item = _params[key].split("=");
		    params[item[0]] = item[1];
		}
		var access_token = params['access_token'];
		localStorage.setItem('access_token', access_token);
		window.plugins.ChildBrowser.close();
		if(callback){
		    callback(access_token);
		}
	    }
	};
    };
    this.api = function (api, params,callback) {
	if(typeof (spinnerplugin) == 'undefined'){
	    spinnerplugin = {
		show:function(){},
		hide:function(){}
	    };
	}
	spinnerplugin.show();
	var paramStr = _self.getParamStr(params);
	var access_token = localStorage.getItem('access_token');
	console.log('access_token',access_token);
	if(!access_token){
	    _self.getToken(function(){
		_self.api(api,params);
	    });
	}
	var vk_url = api_url+api+'?v=5.26&'+paramStr+'&access_token=' + access_token;
	console.log(vk_url);
//	jx.load(vk_url, function (data) {
	$.post(vk_url, function (data) {
	    if(data.error){
		_self.getToken(function(){
		   _self.api(api.params,callback); 
		});
	    }
	    spinnerplugin.hide();
	    
	    if(callback){
		callback(data);
	    }
	}, 'json');
    };
    this.getParamStr = function(params){
	if(!params){
	    return '';
	}
	var res = '';
	for(var key in params){
	    res += key+"="+params[key]+"&";
	}
	res = res.substr(0,res.length - 1);
	return res;
    };
    this.getFriends = function(callback){
	var param = {
	    'fields':'uid,first_name,last_name,nickname,photo_50'
	};
	_self.api('friends.get',param,function(d){
	    if(callback){
		callback(d);
	    }
	});
    };
    this.getIm = function(callback){
	var params = {
	   count:200
	}
	_self.api('messages.getDialogs',params,function(d){
	    if(callback){
		callback(d.response);
	    }
	});
    };
}

var VK = new vk();