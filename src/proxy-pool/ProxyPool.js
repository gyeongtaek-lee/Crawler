
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const { logger } 		= require('../log');

const ProxyAccess	= require('./DataAccess/ProxyAccess');

class ProxyPool {
	
	constructor() {
		
	};
	
	/**
	 * 실행 Method
	 */
	static launch() {
		
		return __awaiter(this, void 0, void 0, function* () {
			
            const proxyPool = new ProxyPool();
            
            yield proxyPool._init();
            
            logger.info(`[ProxyPool.js] Proxy-Pool Instance creation complete.`);
            
            return proxyPool;
            
        });
		
	};
	
	/**
	 * 초기화 Method
	 */
	async _init() {
		
		this.proxyAccess = await ProxyAccess.launch({name:'proxy job'});
		
	};
	
	/**
	 * get Proxy Method
	 */
	async getProxy(data) {
		
	    return new Promise((resolve, reject) => {
	    	
	        const callbacks = { resolve, reject };
	        
	        this.proxyAccess.getProxy(data, this.callbackGetProxy, callbacks);
	        
	    });
		
	};
	
	/**
	 * get Proxies Method
	 */
	async getProxies(data, cnt) {
		
		return new Promise((resolve, reject) => {
			
			const callbacks = { resolve, reject };
			
			this.proxyAccess.getProxies(data, cnt, this.callbackGetProxy, callbacks);
			
		});
		
	};
	
	//callback proxy address task Function
	callbackGetProxy(err, callbacks, docs) {
		
		if (err) {
			callbacks.reject(err);
		}
		
		callbacks.resolve(docs);
		
	}
	
	/**
	 * dispose Proxy Method
	 */
	async removeProxy(data) {
		
	    return new Promise((resolve, reject) => {
	    	
	        const callbacks = { resolve, reject };
	        
	        this.proxyAccess.setProxyDisposal(data, this.callbackRemoveProxy, callbacks);
	        
	    });
		
	};
	
	/**
	 * dispose Proxies Method
	 */
	async removeProxies(data, cnt) {
		
		return new Promise((resolve, reject) => {
			
			const callbacks = { resolve, reject };
			
			this.proxyAccess.setProxiesDisposal(data, cnt, this.callbackRemoveProxy, callbacks);
			
		});
		
	};
	
	//callback proxy address disposal task Function
	callbackRemoveProxy(err, callbacks, docs) {
		
		if (err) {
			callbacks.reject(err);
		}
		
		callbacks.resolve(docs);
		
	}
	
}

module.exports = ProxyPool;