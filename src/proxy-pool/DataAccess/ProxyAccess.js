const { logger } 	= require('../../log');

const global 			= require('../../db/GlobalVariable');

const config			= require('../../config');

const MongoDB	 	= require('../../db/mongoDB');

const ProxyList		= require('./schema/proxyList');

const util				= require('util');

const events_1 		= require("events");

const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class ProxyAccess extends events_1.EventEmitter {
	
	constructor(options) {
		
		super();
		
		this.name 	= options.name;
		
	};
	
	/**
	 * 실행 Method
	 */
	static launch(options) {
		
		return __awaiter(this, void 0, void 0, function* () {
			
            const mongo = new ProxyAccess(options);
            
            yield mongo._init();
            
            return mongo;
            
        });
		
	};
	
	/**
	 * 초기화 Method
	 */
	async _init() {
		
		const _mongoDB = new MongoDB();
		
		this.mongoDB = _mongoDB; 
		
		// connect DB.. 
		await _mongoDB.connect();
		
	};
	
	/**
	 * 종료 Method
	 */
	async finish() {
		
		this.mongoDB.disconnect();
		
		this.mongoDB = null;
		
	};
	
	// Type Guard for TypeScript
    isTaskFunction(data) {
        return (typeof data === 'function');
    }
	
	/**
	 * proxy address list 등록 Method
	 */
	async insertProxyList(_list) {
		
		let result = false;
		
		// db connection check
		if (global.isConnected) {
			
			try {
				
				// proxy address delete.
				await ProxyList.deleteMany({ activeYn: 'inactive' }, (err) => {
					
					if (err) {
						
						logger.error(`[ProxyAccess.js] Proxy address list DB delete Error : ${err}`);
						
						const message = '[ProxyAccess.js] Proxy address list DB delete Error';
						
						this.emit('error', err, message);
						
					}
					
					// deleted at most one tank document
				});
				
				let data = [];
				
				const sites = config.sites;
				
				_list.map(async(c) => {
					
					sites.map(async(s) => {
						
						data.push({
							processId: null,
						    site: s.name,
						    address: c.ip,
						    latency: c.latency,
						    useYn: 'unused',
						    maxLastUsedTime: 0,
						    activeYn: 'inactive' 
						});
						
					});
					
				});
				
				// proxy address insert.
				await ProxyList.insertMany(data, (err, docs) => {
					
					if (err) {
						
						logger.error(`[ProxyAccess.js] Proxy address list DB insert Error : ${err}`);
						
						const message = '[ProxyAccess.js] Proxy address list DB insert Error';
						
						tthis.emit('error', err, message);
						
					}
					else {
						
						logger.info('[ProxyAccess.js] Registered proxy address in db.');
						
						this.emit('success');
						
					}
					
				});
				
			} catch (e) {
				
				logger.error(`[ProxyAccess.js] ${e}`);
				
				const message = e.message;
				
				tthis.emit('error', e, message);
				
			}
			
		}
		else {
			
			tthis.emit('error', new Error('db connection error'));
			
		}
		
	};
	
	/**
	 * proxy address 조회 Method
	 */
	async getProxy(site, callback, executeCallbacks) {
		
		if (!this.isTaskFunction(callback)) throw new Error('Parameters must be functions');
		
	    return await this.getProxies(site, 1, executeCallbacks, function(err, proxies) {
	    	
	        if (err) {
	        	
	            return callback(err, executeCallbacks);
	            
	        }
	        
	        callback(err, executeCallbacks, proxies[0]);
	        
	    });
	    
	};
	
	/**
	 * multi proxy address 조회 Method
	 */
	async getProxies(site, cnt, executeCallbacks, callback) {
		
		const _ids = [];		// mongodb _id array
		const _ips = [];		// select proxy address array
		
		if (!this.isTaskFunction(callback)) throw new Error('Parameters must be functions');
		
	    /* Handles proxies find results */
	    const findCallback = function(err, docs) {
	    	
	        if (err) {
	        	
	            /* Failed to get proxy from db */
	        	logger.error(`[ProxyAccess.js] ${err}`);
	            
	            callback(err);
	            
	            return;
	            
	        }

	        if (docs !== null && docs.length >= 1) {
	        	
	        	const updateCallback = function(_err, _docs) {
	        		
	        		console.log(_docs);
	        		
	        		
	        		if (_err) {
	     	        	
	        			/* Failed to get proxy from db */
	     	            logger.error(`[ProxyAccess.js] ${_err}`);
	     	            
	     	            callback(_err);
	     	            
	     	            return;
	     	            
	        		}
	        		 
	        		if (_docs !== null && _docs.n == _docs.nModified) {
	        			 
	        			callback(null, _ips);
	        			 
	        		} 
	        		else {
	     	        	
	     	            const errorMessage = "Failed to modify pid of matching proxy in pool";
	     	            
	     	            const err = new Error(errorMessage);
	     	            logger.error(`[ProxyAccess.js] ${errorMessage}`);
	     	            
	     	            callback(err);
	        		}
	        			 
	        	}
	        	
	        	docs.map(async (c) => {
	    	    	
	        		_ids.push(c._id);
	        		_ips.push(c.address);
	    	      
	    	    });
	        	
	        	// 조회 프록시 리스트 사용 중 수정
	        	ProxyList.updateMany( { _id: { $in: _ids } }, { $set: { 'processId': process.pid, 'useYn': 'used', 'activeYn': 'active' } }, updateCallback);
	        	
	        } 
	        else {
	        	
	            const errorMessage = "No proxy that matches the pool";
	            
	            const err = new Error(errorMessage);
	            logger.error(`[ProxyAccess.js] ${errorMessage}`);
	            
	            callback(err);
	            
	        }
	        
	    };
	    
	    const d = new Date();
	    const currentTime = d.getTime();

	    // 프록시 리스트 조회
	    await ProxyList.find()
	    .where('processId').equals(null)
	    .where('site').equals(site)
	    .where('useYn').ne('used')
	    .where('maxLastUsedTime').lt(currentTime - 7200000)		// 10000000 < 17200001   - 7200000 
	    .where('activeYn').equals('inactive')
	    .sort('latency')
	    .limit(cnt)
	    .select('address')
	    .exec(findCallback);
	    
	};
	
	
	/**
	 * proxy address 폐기 Method
	 */
	async setProxyDisposal(site, callback, executeCallbacks) {
		
		if (!this.isTaskFunction(callback)) throw new Error('Parameters must be functions');
		
	    return await this.setProxiesDisposal(site, 1, executeCallbacks, function(err, proxies) {
	    	
	        if (err) {
	        	
	            return callback(err, executeCallbacks);
	            
	        }
	        
	        callback(err, executeCallbacks, proxies[0]);
	        
	    });
		
	};
	
	
	/**
	 * multi proxy address 조회 Method
	 */
	async setProxiesDisposal(site, cnt, executeCallbacks, callback) {
		
		const _ids = [];		// mongodb _id array
		const _ips = [];		// select proxy address array
		
		if (!this.isTaskFunction(callback)) throw new Error('Parameters must be functions');
		
	    /* Handles proxies update results */
	    const updateCallback = function(err, docs) {
	    	
	        if (err) {
	        	
	            /* Failed to get proxy from db */
	        	logger.error(`[ProxyAccess.js] ${err}`);
	            
	            callback(err);
	            
	            return;
	            
	        }

	        if (docs !== null && docs.n == docs.nModified) {
	        	
	        	callback(null, true);
	        	
	        } 
	        else {
	        	
	            const errorMessage = "No matching aborted proxy in the pool.";
	            
	            const err = new Error(errorMessage);
	            logger.error(`[ProxyAccess.js] ${errorMessage}`);
	            
	            callback(err);
	            
	        }
	        
	    };
	    
	    const d = new Date();
	    const currentTime = d.getTime();
	    
	    // 사용중인 프록시 리스트 중단 상태로 수정
	    ProxyList.updateOne( { 'processId': process.pid, 'site': site, 'useYn': 'used', 'activeYn': 'active' }, { $set: { 'processId': null, 'useYn': 'aborted', 'activeYn': 'inactive', 'maxLastUsedTime' :  currentTime} }, updateCallback);

	};
	
}

module.exports = ProxyAccess;