/**
 * 큐의 메세지를 처리하는 crawling job 프로세스
 */
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const { logger } 			= require('../log');

const config 					= require('../config');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

const rabbitmq 				= require('../rabbitmq');

const Cluster				= require('./cluster');

const ProxyPool 			= require('../proxy-pool/ProxyPool');

// 크롤러 팩토리
const crawlerFactory 		= require('../scraping/crawlerFactory');

let proxy;

let cluster;

class JobCrawler {
	
	constructor(options) {
		
		/*return (async () => {
			
			this.name 		= options.name;
			this.proxyIp	= options.proxyIp;
			
			logger.info(`Running Job name is ${this.name} | Proxy IP : ${this.proxyIp}`);
			
			this.value = await this._init(this.proxyIp);
			
			return this;
			
		})();*/
		
		this.name 					= options.name;
		this.proxyIp				= options.proxyIp;
		
	}
	
	/**
	 * 실행 Method
	 */
	static launch(options) {
		
		return __awaiter(this, void 0, void 0, function* () {
			
			logger.info('[jobCrawler.js] JobCrawler Launching.....');
			
			process.setMaxListeners(0);
			
            const jobCrawler = new JobCrawler(options);
            
            yield jobCrawler._init(options.proxyIp);
            
            return jobCrawler;
            
        });
		
	}
	
	/**
	 * 초기화 Method
	 */
	async _init(_proxyIp) {
		
		const sites = config.sites;
		
		// 프록시 pool 생성
		proxy		= await ProxyPool.launch();
		
		// 클러스터 생성
//		cluster	= await Cluster.create({'sites' : sites, 'proxyIp' : '111.222.333.444:80'});
		cluster	= await Cluster.create({'sites' : sites});
		cluster.on('destroy', this.proxyDisposal);
		
		sites.map((s) => {
			
			try {
				
				// 크롤러 모듈 require
				const crawler = require(`../scraping/${s.name}`);
				
				// 크롤러 팩토리에 모듈 등록
				crawlerFactory.addJob(s.name, crawler);
				
				logger.info(`[jobCrawler.js]${s.name} crawler add...`);
				
			}
			catch(e) {
				
				logger.error(`[jobCrawler.js] ${s.name} crawler is not exist. ${e}`);
				
			}
			
		});
		
	}
	
	
	/**
	 * 프록시 주소 폐기 callback Method
	 */
	async proxyDisposal(site) {
		
		await proxy.removeProxy(site);
		
	}
	
	
	/**
	 * 큐 처리 작업 Method
	 */
	async doWork(site, msg) {
		
		let result 			= false;
		let isSuccess	= 'FAIL';
		let crawler 		= null; 
		
		try {
			
			const _clusterIns = await cluster.getCluster(site);
			
			// 큐 처리 작업에 해당하는 크롤러 생성
			crawler = await crawlerFactory.create(site, {name : site, cluster : _clusterIns});
			
			if (crawler) {
				
				if (_clusterIns) {
					
					let data = { url : msg, site : site, crawler : crawler };
					
					isSuccess = await _clusterIns.execute(data);
					
					await _clusterIns.idle();
					
				}
				
			}
			
		}
		catch(e) {
			
			logger.error(`[jobCrawler.js] JobCrawler doWork ${e}`);
			
			if (e.message.includes('Protocol error') || e.message.includes('Timeout hit')) {
				
				cluster.destroyCluster(site);
				
			}
			
		}
		finally {
			
			result  = (isSuccess === 'SUCCESS') ? true : false;
			
			return result;
			
		}
		
	}
	
	/**
	 * 크롤러 work Method
	 */
	async work(site) {
		
		const siteName		= site.name;
		const queueName 	= site.data.queueName;
		
		rabbitmq.openChannel()
		.then( (channel)=> {
			
			rabbitmq.getMessage(
					channel,
					queueName,
					async (msg) => {
						
						let isSuccess = false;
						
						let message = msg.content.toString();
						
						logger.info(`[jobCrawler.js] =============Start ============== Consumer start work... | Queue Message : ${message}`);
						
						
						if (message) {
							
							try {
								
								if (!await cluster.getCluster(siteName)) {
									
									logger.info('[jobCrawler.js] =============> net::CHANGE_PROXY_CONNECTION');
									
									let newProxyIp = '';
									
									await proxy.getProxy(siteName).then(function (data) {
										
										newProxyIp = data;
										
									}).catch(function (err) {
										
										if (err.message.includes('No proxy that matches the pool')) process.exit(0);
										
										throw new Error(err.message);
										
									});
									
									await cluster.createCluster(siteName, newProxyIp);
									
								}
								
								isSuccess = await this.doWork(siteName, message);
								
							}
							catch(e) {
								
								logger.error(e);
								
								isSuccess = false;
								
							}
							
						}
						
						logger.info(`[jobCrawler.js] =============End ============== Consumer end work... | Result Value : ${isSuccess} | Queue Message : ${message}`);
						
						if (isSuccess) {
							
							rabbitmq.ack(channel, msg);
							
						}
						else {
							
							rabbitmq.reSendMessage( channel, config.failExchageNameSite, site.data.routingKey, msg);
							
						}
						
					}
			)
			
		});
		
	};
	
}

module.exports = JobCrawler;
