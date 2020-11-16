/**
 * 프록시 주소 가져오는 예제
 */
const ProxyAccess	= require('./DataAccess/ProxyAccess');

const ProxyPool 		= require('./ProxyPool');

(async () => {
	
	// insert proxy address list in Mongo DB
//	const proxyAccess = await ProxyAccess.launch({name:'proxy job'});
	
//	await proxyAccess.getProxy('naver', callbackGetProxy);
//	await proxyAccess.getProxies('naver', 2, callbackGetProxy);
	
	/*cnt = 0
	
	while(true) {
		
		cnt++;
		
		console.log(cnt);
		
		if (cnt == 1000) break;
		
	}
	
	setTimeout(function() {
		  console.log('Works!');
		}, 100000);
	
	console.log('1');
	
	const result = await execute('naver', callbackGetProxy);
	
	
	setTimeout(function() {
		  console.log('Works!');
		}, 10000);
	
	console.log('2');
	
	console.log(result);*/
	
	const proxy = await ProxyPool.launch();
	
	const proxyIp = await proxy.getProxy('ppomppu')
	
	console.log(proxyIp);
	
})();


function callbackGetProxy(err, callbacks, docs) {
	
	console.log('err = '+err);
	console.log('succ = ' + docs);
	
	callbacks.resolve(docs);
	
}

async function execute(data, taskFunction) {
	
	const proxyAccess = await ProxyAccess.launch({name:'proxy job'});
	
    return new Promise((resolve, reject) => {
        const callbacks = { resolve, reject };
        
        proxyAccess.getProxy(data, taskFunction, callbacks);
        
    });
}