var access_token = '';
$(function () {
    var touken_url = 'https://oauth.vk.com/authorize?client_id=4640574&scope=6&redirect_uri=https://oauth.vk.com/blank.html&display=mobile&v=5.26&response_type=token';
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
	    alert('childBrowser has loaded ' + url);
	    alert('childBrowser has loaded ' + params['access_token']);
//			localStorage.setItem('access_token',params['access_token']);
	    access_token = params['access_token'];

//			var vk_url = 'https://api.vk.com/method/users.get?user_id=66748&v=5.26&access_token=' + params['access_token'];
//			$.get(vk_url, function (d) {
//			    console.log(d);
//			}, 'json');
	}
    };

//		window.plugins.ChildBrowser.showWebPage(touken_url, {showLocationBar: true});
    $(document).on('touchstart', '.get_token', function () {
	window.plugins.ChildBrowser.showWebPage(touken_url, {showLocationBar: true});
	return false;
    });
    $(document).on('touchstart', '.get_fr', function () {
	var vk_url = 'https://api.vk.com/method/friends.get?v=5.26&access_token=' + access_token;
	console.log('vk_url', vk_url);
	$.get(vk_url, function (d) {
	    console.log(d);
	}, 'json');
	return false;
    });

});