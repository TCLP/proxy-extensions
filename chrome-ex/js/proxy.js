var index = 0;

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

