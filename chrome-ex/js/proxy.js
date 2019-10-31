var server = {
	mode: "fixed_servers",
	rules: {
		proxyForHttp: {
			scheme: "socks5",
			host: "103.101.207.165",
			port: 24105
		},
		proxyForHttps: {
			scheme: "socks5",
			host: "103.101.207.165",
			port: 24105
		},
		bypassList: ["baidu.com"]
	}
}

function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

setInterval(function(){
	httpRequest('http://127.0.0.1:8081/api/proxylist', function(result){
		var data = JSON.parse(result)
		server["rules"]["proxyForHttp"]["host"] = data["data"]["host"];
		server["rules"]["proxyForHttp"]["port"] = data["data"]["port"];
		server["rules"]["proxyForHttps"]["host"] = data["data"]["host"];
		server["rules"]["proxyForHttps"]["port"] = data["data"]["port"];
	});
}, 60000);


setInterval(function(){
   chrome.proxy.settings.set(
        {value: server},
        function(){}
    );
}, 61000);





/*
var config = [
    {
        mode: "fixed_servers",
        rules: {
            proxyForHttp: {
                scheme: "socks5",
                host: "103.101.207.165",
                port: 24105
            },
            proxyForHttps: {
                scheme: "socks5",
                host: "103.101.207.165",
                port: 24105
            },
        }
    },
    {
        mode: "fixed_servers",
        rules: {
            proxyForHttp: {
                scheme: "socks5",
                host: "167.88.176.151",
                port: 6134
            },
            proxyForHttps: {
                scheme: "socks5",
                host: "167.88.176.151",
                port: 6134
            },
        }
    },
    {
        mode: "fixed_servers",
        rules: {
            proxyForHttp: {
                scheme: "socks5",
                host: "66.42.43.209",
                port: 8899
            },
            proxyForHttps: {
                scheme: "socks5",
                host: "66.42.43.209",
                port: 8899
            }
        }
    }
];


setInterval(function(){
   chrome.proxy.settings.set(
        {value: config[index++ % 3]},
        function(){}
    );
}, 10000);
*/
