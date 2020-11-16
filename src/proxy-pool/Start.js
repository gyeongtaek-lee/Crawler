const { logger } 		= require('../log');

const spys_proxy		= require('./spys_proxy');

const ProxyAccess	= require('./DataAccess/ProxyAccess');

let mongoAccess;

async function main() {
	
	try {
		
		// get PROXY IP list..
		const proxyList = await spys_proxy.crawler();
		
		// insert proxy address list in Mongo DB
		proxyAccess = await ProxyAccess.launch({name:'proxy job'});
		proxyAccess.on('success', callbackInsertProxy);
		proxyAccess.on('error', callbackFailProxy);
		
		
		await proxyAccess.insertProxyList(proxyList, callbackInsertProxy);
		
    } catch (e) {
        
    	logger.error(`[proxy-pool] ${e}`);
    	
    }
    
}

// success event handler : callback function of the `insert proxy address list in Mongo DB` 
function callbackInsertProxy() {
	
	proxyAccess.finish();
	
}

// error event handler 
function callbackFailProxy(e, msg) {
	
	logger.error(`[proxy-pool] ${msg}`);
	
}

(async () => {
	
	await main();
	
})();


