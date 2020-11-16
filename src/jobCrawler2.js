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

// 크롤러 팩토리
const crawlerFactory 		= require('../scraping/crawlerFactory');

//Chrome브라우저 제어 Nodejs 라이브러리 모듈
const puppeteer 			= require('puppeteer');
const { Cluster } 			= require('puppeteer-cluster');


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
		this.clusterInstance	= null;
		
	}
	
	/**
	 * 실행 Method
	 */
	static launch(options) {
		
		return __awaiter(this, void 0, void 0, function* () {
			
			logger.info('[jobCrawler.js] JobCrawler Launching.....');
            
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
		
//		await this._createCluster('183.111.25.67:8080');
//		await this._createCluster('183.111.26.15:8080');
//		await this._createCluster('211.115.97.137:80');
//		await this._createCluster('203.246.112.133:3128');
//		await this._createCluster('119.192.195.83:443');
		
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
	 * 클러스터 생성 Method
	 */
	async _createCluster(_proxyIp) {
		
		// puppeteer cluster 생성
		const _cluster = await Cluster.launch({
//			timeout 					: 30000,
		    concurrency			: Cluster.CONCURRENCY_CONTEXT,
		    maxConcurrency		: 2,
		    puppeteer,
		    puppeteerOptions	: {
//		    	headless			: false,
//	            args					: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox', _proxyIp ? `--proxy-server=${_proxyIp}` : '' ]
	            args					: ['--disable-notifications', _proxyIp ? `--proxy-server=${_proxyIp}` : '' ],
		    	executablePath 	: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
		    }
		});
		
		this.clusterInstance = _cluster;
		
		// Unlimit the number of event listener connections
		await this.clusterInstance.setMaxListeners(0);
		
		// Event handler to be called in case of problems
		this.clusterInstance.on('taskerror', (err, data) => {
			logger.info(`[jobCrawler.js] Error crawling ${data}: ${err.message}`);
	    });
		
		// Event handler to be called crawling task
		await this.clusterInstance.task(async ({ page, data }) => {
			
			const { url, site, crawler } = data;
			
			let _isSuccess = 'FAIL';
			
			try {
				
				// 브라우저 User Agent 설정 (navigator.userAgent)
				await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
				
				// Intercept network requests.
				await page.setRequestInterception(true);
				
				page.on('request', req => {
					
					// Igore reqs that don't produce DOM (css/media).
					const whitelist = ['document', 'script', 'xhr', 'fetch', 'image'];
					
					if (!whitelist.includes(req.resourceType())) {
						return req.abort();
					}
					
					req.continue();	// Pass through all other requests.
					
				});
				
				/*page.on('requestfailed', request => {
				    const url = request.url();
				    logger.info(`[jobCrawler.js] request failed url: ${url}`);
				});*/
			
				/*page.on('response', response => {
				    const request = response.request();
				    const url = request.url();
				    const status = response.status();
				    logger.info(`[jobCrawler.js] response url: ${url}, status: ${status}`);
				});*/
				
				// kill window alert.
				page.on('dialog', async dialog => {
					
					logger.info(`[jobCrawler.js] dialog message: ${dialog.message()}`);
					
					await dialog.dismiss();
					
				});
				
				// Emitted when the page emits an error event (for example, the page crashes)
				page.on('error', error => console.error(`[jobCrawler.js] ${error}`));

				// Emitted when a script within the page has uncaught exception
				page.on('pageerror', error => console.error(`[jobCrawler.js] ${error}`));
				
				// Triggers `error` event
//				await page.emit('error', new Error('[jobCrawler.js] An error within the page'));
				
				// 페이지 이동
				await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 0});
				
				// 크롤링 처리
				_isSuccess = await crawler.processCrawling(page);
				
			}
			catch(e) {
				
				if (e.name === 'TargetNotAccessError' || e.message.includes('ERR_PROXY_CONNECTION_FAILED')) {
					
					this._destroyCluster();
					
				}
				
				logger.error(`[jobCrawler.js] crawler process ${e}`);
				
			}
			finally {
				
				logger.info(`[jobCrawler.js] ${site} is ${_isSuccess} : ${url}`);
				
				page.removeAllListeners(['request', 'requestfailed', 'response', 'dialog', 'error', 'pageerror']);
				
				// 페이지 닫기
				await page.close();
				
				return _isSuccess;
				
			}
			
		});
		
		logger.info('[jobCrawler.js] Cluster Instance creation complete!');
		
	}
	
	/**
	 * 클러스터 제거 Method
	 */
	async _destroyCluster() {
		
		if (this.clusterInstance) {
			
			await this.clusterInstance.close();
			
			this.clusterInstance = null;
			
			logger.info('[jobCrawler.js] Cluster Instance destruction complete!');
			
		}
			
	}
	
	/**
	 * 클러스터 getter Method
	 */
	get cluster() {
		
		return this.clusterInstance;
		
	}
	
	/**
	 * 클러스터 setter Method
	 */
	set cluster(newCluster) {
		
		this.clusterInstance = newCluster;
		
	}
	
	/**
	 * 큐 처리 작업 Method
	 */
	async doWork(site, msg) {
		
		let result 			= false;
		let isSuccess	= 'FAIL';
		let crawler 		= null; 
		
		try {
			
			// 큐 처리 작업에 해당하는 크롤러 생성
			crawler = await crawlerFactory.create(site, {name : site, cluster : this.clusterInstance});
			
			if (crawler) {
				
				if (this.clusterInstance) {
					
					let data = { url : msg, site : site, crawler : crawler };
					
					isSuccess = await this.clusterInstance.execute(data);
					
					await this.clusterInstance.idle();
					
				}
				
			}
			
		}
		catch(e) {
			
			logger.error(`[jobCrawler.js] JobCrawler doWork ${e}`);
			
			if (e.message.includes('Protocol error') || e.message.includes('Timeout hit')) {
				
				this._destroyCluster();
				
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
							
							if (!this.clusterInstance) {
								
								logger.info('[jobCrawler.js] =============> net::CHANGE_PROXY_CONNECTION');
								await this._createCluster('183.111.26.15:8080');
								
								/*if (count == 1) await this._createCluster('183.111.26.15:8080');
								else if (count == 2) await this._createCluster('183.111.26.17:8080');
								else if (count == 3) await this._createCluster('203.246.112.133:3128');
								else await this._createCluster();*/
								
							}
							
							isSuccess = await this.doWork(siteName, message);
							
						}
						
						logger.info(`[jobCrawler.js] =============End ============== Consumer end work... | Result Value : ${isSuccess} | Queue Message : ${message}`);
						
						isSuccess = true;
						
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
