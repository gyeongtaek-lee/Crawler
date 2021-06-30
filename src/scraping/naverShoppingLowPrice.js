/**
 * naver shopping 최저가 Crawling Class
 */

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

const { logger }	= require('../log');

const moment 		= require('moment');

const Crawler 		= require('./crawler');

const global 		= require('../db/GlobalVariable');

// 네이버 쇼핑 크롤링
const naverCrawler 	= require('./naverShoppngLowPriceCrawler');

// 상품 collection schema model
const price			= require('../db/schema/price');


class NaverShoppngLowPrice extends Crawler {	
	
	constructor(options) {
		
		super(options);
		
	}
	
	/**
	 * 크롤링 처리 Method
	 */
	async processCrawling(page, data) {
				
		const currentDate = moment().add('0', 'd').format('YYYYMMDD');
		
		await page.waitFor(2000);
		
		// 네이버 쇼핑 페이지 로딩 여부 확인
		try {
			
			await page.waitForSelector('.searchInput_input_text__2AOjQ', { timeout: 5000 });
			  
		} catch (error) {
			
			throw new TargetNotAccessError('[naverShoppingLowPrice.js]');
		  
		}
		
		let result	= 'FAIL';
		
		let records	= new Array();
		
		console.log(data.length);
		
		try {
			
			for (let cnt = 0; cnt < data.length; cnt++) {
						
//			await Promise.all(data.map(async (model) => {
				
				let model = data[cnt];
				
				console.log(model.name);
				
				await page.waitFor(5000);
			
				// Run scraping method
				const contents = await naverCrawler.scraping(page, model);
									
				console.log(contents);
				
				if (contents == null) throw new Error('[naverShoppingLowPrice.js] Naver scraping Error');
				
				await Promise.all(contents.map(async (c) => {
					
//					console.log(c.price);
				
					// db connection check
					if (global.isConnected) {
						
						// 이전 크롤링 처리 대상 여부 체크 (사이트, 모델명, LGE 가격, 크롤링 가격)
						try {
							
							// 사전 역할을 하는 variable을 중복하여 사용할 경우 mongodb에 대한 패스는 항상 동일한 dictionary 객체 였으므로 mongo가 저장 될 때 "_id"중복 문제가 발생한다.
							const _data = {site: 'naver', modelNm: c.modelNm, itemNm: c.itemNm, lgeItemPrc: c.lgeItemPrc, itemPrc: c.price, category1: c.category1, category2: c.category2, category3: c.category3, category4: c.category4, itemImg: c.imgPath, itemDesc: c.description, itemEvent: c.event, reviewPnt: c.review_point, reviewCnt: c.review_cnt, buyCnt: c.buy_cnt, keepCnt: c.keep_cnt, createDt: currentDate};

							await price.updateOne({ site: 'naver', modelNm: c.modelNm, lgeItemPrc: c.lgeItemPrc, itemPrc: c.price, createDt: currentDate }, { $set: _data }, { upsert: true, setDefaultsOnInsert: true }, async (err, item) => {
								
								if (err) {
									
									if (err.code === 11000) {
										
										const _data2 = {site: 'naver', modelNm: c.modelNm, itemNm: c.itemNm, lgeItemPrc: c.lgeItemPrc, itemPrc: c.price, category1: c.category1, category2: c.category2, category3: c.category3, category4: c.category4, itemImg: c.imgPath, itemDesc: c.description, itemEvent: c.event, reviewPnt: c.review_point, reviewCnt: c.review_cnt, buyCnt: c.buy_cnt, keepCnt: c.keep_cnt, createDt: currentDate};
							            // Another upsert occurred during the upsert, try again. You could omit the
							            // upsert option here if you don't ever delete docs while this is running.
										await price.updateOne({ site: 'naver', modelNm: c.modelNm, lgeItemPrc: c.lgeItemPrc, itemPrc: c.price, createDt: currentDate }, { $set: _data2 }, { upsert: true, setDefaultsOnInsert: true }, (err, item) => {
											
											if (err) {
												
												logger.error(`[naverShoppingLowPrice.js] Crawler DB Upsert Error : ${err}`);
												
												throw new Error('[naverShoppingLowPrice.js] 1. DB Upsert Error!'); 
												
											}
											
										});
										
							        }
									else {
										
										logger.error(`[naverShoppingLowPrice.js] Crawler DB Upsert Error : ${err}`);
										
										throw new Error('[naverShoppingLowPrice.js] 2. DB Upsert Error!'); 
										
									}
								
								}
								else if(item.upserted != undefined) {
									
									records.push(c);
									
								}
								
							});
							
						} catch (e) {
							
							if (e.code === 11000) {
								
								const _data3 = {site: 'naver', modelNm: c.modelNm, itemNm: c.itemNm, lgeItemPrc: c.lgeItemPrc, itemPrc: c.price, category1: c.category1, category2: c.category2, category3: c.category3, category4: c.category4, itemImg: c.imgPath, itemDesc: c.description, itemEvent: c.event, reviewPnt: c.review_point, reviewCnt: c.review_cnt, buyCnt: c.buy_cnt, keepCnt: c.keep_cnt, createDt: currentDate};
					            // Another upsert occurred during the upsert, try again. You could omit the
					            // upsert option here if you don't ever delete docs while this is running.
								await price.updateOne({ site: 'naver', modelNm: c.modelNm, lgeItemPrc: c.lgeItemPrc, itemPrc: c.price, createDt: currentDate }, { $set: _data3 }, { upsert: true, setDefaultsOnInsert: true }, (err, item) => {
									
									if (err) {
										
										logger.error(`[naverShoppingLowPrice.js] Crawler DB Upsert Error : ${err}`);
										
										throw new Error('[naverShoppingLowPrice.js] 3. DB Upsert Error!'); 
										
									}
									
								});
								
					        }
							else {
								
								console.log(`???=> ${e}`);
								
								logger.error(e);
								
								throw new Error('[naverShoppingLowPrice.js] Error checking whether crawler target exists in db!'); 
								
							}
							
						}
						
					}
					else {
						
						throw new Error('[naverShoppingLowPrice.js] DB Connected Error!');
						
					}
					
				}));
			
//			}));
			}
				
			result = 'SUCCESS';
			
		} 
		catch (e) {
			
			if (e.name === 'ContentNotFoundError') {
				
				logger.error(e.message);
				
			}
			else{
				
				logger.error(`[naverShoppingLowPrice.js] Crawler processCrawling ${e}`);
				
			}
			
		    result = 'FAIL';
		    
		} 
		finally {
			
			return result;
			
		}
		
	}
	
}

module.exports = NaverShoppngLowPrice;