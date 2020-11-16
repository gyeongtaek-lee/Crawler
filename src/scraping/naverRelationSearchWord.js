/**
 * naver shopping relation searchKeywords Crawling Class
 */

const { logger }	= require('../log');

const Crawler 	= require('./crawler');

const global 		= require('../db/GlobalVariable');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

// 네이버 쇼핑 연관검색어 크롤링
const naverRelationSearchWordCrawler = require('./naverRelationSearchWordCrawler');

// 연관검색어 schema model
const rKeyword = require('../db/schema/rKeyword');

const moment 	= require('moment');


class NaverRelationSearchWord extends Crawler {
	
	constructor(options) {
		
		super(options);
		
	}
	
	/**
	 * 크롤링 처리 Method
	 */
	async processCrawling(page, data) {
		
		// page evaluate 내부의 노드에 전달하고 페이지를 평가하는 동안 콘솔 출력하는 방법 
		//	page.on('console', (log) => console[log._type](log._text));
		
		// 네이버 쇼핑 페이지 로딩 여부 확인
		try {
			
//			await page.waitFor(5000);
			
			console.log('1');
			
			const temp = await page.waitForSelector('#common_srch', { timeout: 5000, waitUntil: 'domcontentloaded' });
			
			  
		} catch (error) {
			
			await page.waitFor(50000);
			
			throw new TargetNotAccessError('[naverRelationSearchWord.js]');
		  
		}
		
		let result	= 'FAIL';
		
		let records	= new Array();
		
		try {
			
			const currentDate = moment().add('0', 'd').format('YYYYMMDD');	// 현재 일자
			
			const regexCategory 		=	/category=(.*)/;		// 카테고리 정규식
			const regexTgtKeyword 	=	/tgtKeyword=(.*)/;	// 검색어 정규식
			
			let categoryInfo		= "";	// 카테고리
			let tgtKeywordInfo 	= "";	// 검색어
			
			data.forEach((e) => {
				 
				const _category 		= regexCategory.exec(e);
				 const _tgtKeyword		= regexTgtKeyword.exec(e);
				 
				 if (_category)
					 categoryInfo = _category[1];
				 
				 if (_tgtKeyword)
					 tgtKeywordInfo = _tgtKeyword[1];
				 
			 });
			
			// Run scraping method
			const contents = await naverRelationSearchWordCrawler.scraping(page);
			
			if (contents == null) throw new Error('[naverRelationSearchWord.js] Naver relation searchword scraping Error');
			
			await Promise.all(contents.map(async (c) => {
				
				// 사이트, 카테고리, 검색어, 연관 검색어, 생성일자
				let _data = {site: 'naver', category: categoryInfo, tgtKeyword: tgtKeywordInfo, rKeyword: c.rKeyword, createDt: currentDate};
				
				// db connection check
				if (global.isConnected) {
					
					// 이전 크롤링 처리 대상 여부 체크
					try {
						
						await rKeyword.updateOne({ site: 'naver', tgtKeyword: tgtKeywordInfo, createDt: currentDate }, { $set: _data }, { upsert: true }, (err, item) => {
							
							if (err) {
								
								logger.error(`[naverRelationSearchWord.js] Crawler DB Upsert Error : ${err}`);
								
								throw new Error('[naverRelationSearchWord.js] DB Upsert Error!'); 
								
							}
							else if(item.upserted != undefined) {
								
								records.push(c);
								
							}
							
						});
						
					} catch (e) {
						
						logger.error(e);
						
						throw new Error('[naverRelationSearchWord.js] Error checking whether crawler target exists in db!'); 
						
					}
					
				}
				else {
					
					throw new Error('[naverRelationSearchWord.js] DB Connected Error!');
					
				}
				
			}));
			
			result = 'SUCCESS';
			
		} 
		catch (e) {
			
			if (e.name === 'ContentNotFoundError') {
				
				logger.error(e.message);
				
			}
			else{
				
				logger.error(`[naverRelationSearchWord.js] Crawler processCrawling ${e}`);
				
			}
			
		    result = 'FAIL';
		    
		} 
		finally {
			
			return result;
			
		}
		
	}
	
}

module.exports = NaverRelationSearchWord;