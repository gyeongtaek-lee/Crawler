/**
 * naver shopping Crawling Class
 */

const { logger }	= require('../log');

const Crawler 	= require('./crawler');

const global 		= require('../db/GlobalVariable');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

// 네이버 쇼핑 크롤링
const naverCrawler = require('./naverCrawler');

// 상품 collection schema model
const product	= require('../db/schema/product');


class Naver extends Crawler {
	
	constructor(options) {
		
		super(options);
		
	}
	
	/**
	 * 크롤링 처리 Method
	 */
	async processCrawling(page, data) {
		
		// page evaluate 내부의 노드에 전달하고 페이지를 평가하는 동안 콘솔 출력하는 방법 
		//	page.on('console', (log) => console[log._type](log._text));
		
		await page.waitFor(2000);
		
		// 네이버 쇼핑 페이지 로딩 여부 확인
		try {
			
			  const temp = await page.waitForSelector('.list_basis', { timeout: 5000 });
			  
		} catch (error) {
			
			throw new TargetNotAccessError('[naver.js]');
		  
		}
		
		let result	= 'FAIL';
		
		let records	= new Array();
		
		try {
			
			// Run scraping method
			const contents = await naverCrawler.scraping(page);
			
			if (contents == null) throw new Error('[naver.js] Naver scraping Error');
			
			await Promise.all(contents.map(async (c) => {
				
				let _data = {site: 'naver', itemNo: c.goodNo, itemNm: c.title, itemPrc: c.price, prcReloadDt: c.priceReloadDt, category: c.categories, itemImg: c.imgPath, itemDesc: c.description, itemEvent: c.event, reviewPnt: c.review_point, reviewCnt: c.review_cnt, buyCnt: c.buy_cnt, keepCnt: c.keep_cnt, createDt: c.creation_date};
				
				// db connection check
				if (global.isConnected) {
					
					// 이전 크롤링 처리 대상 여부 체크
					try {
						
						await product.updateOne({ site: 'naver', itemNo: c.goodNo, itemNm: c.title }, { $set: _data }, { upsert: true, setDefaultsOnInsert: true }, (err, item) => {
							
							if (err) {
								
								logger.error(`[naver.js] Crawler DB Upsert Error : ${err}`);
								
								throw new Error('[naver.js] DB Upsert Error!'); 
								
							}
							else if(item.upserted != undefined) {
								
								records.push(c);
								
							}
							
						});
						
					} catch (e) {
						
						logger.error(e);
						
						throw new Error('[naver.js] Error checking whether crawler target exists in db!'); 
						
					}
					
				}
				else {
					
					throw new Error('[naver.js] DB Connected Error!');
					
				}
				
			}));
			
			result = 'SUCCESS';
			
		} 
		catch (e) {
			
			if (e.name === 'ContentNotFoundError') {
				
				logger.error(e.message);
				
			}
			else{
				
				logger.error(`[naver.js] Crawler processCrawling ${e}`);
				
			}
			
		    result = 'FAIL';
		    
		} 
		finally {
			
			return result;
			
		}
		
	}
	
}

module.exports = Naver;