const request = require("request");

request.get("https://api.proxyorbit.com/v1/?token=9qbnCz4pWttP8BMQAv53sY0BOdvaWJtqPTmZxXyAVw8&ssl=true&protocol=http", (err, resp, body) => {
    if(err) {
        console.log(err)    
    } else if(resp.statusCode != 200) {
        console.log("Token has expired");
    } else {
        json = JSON.parse(body);
        request({
            url:"https://api.proxyorbit.com/ip",
            method:"GET",
            proxy:json.curl
        }, (err, resp, body) => {
            console.log("Proxy IP is:", body);
        })
    }
});