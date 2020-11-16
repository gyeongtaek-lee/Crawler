/**
 *  naver shopping relation searchKeywords scraping module (URL 쇼핑 연관 검색어 페이지 크롤링)
 * */

const naverRelationSearchWordCrawler = {};

const { logger } 	= require('../log');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

/**
 * 스크래핑Method
 */
naverRelationSearchWordCrawler.scraping = async(page) => {
	
	let result 		= new Array();
	let rKeyword	= new Array();
	
	let keywordCnt = 0;
	
	try {
		
//		await page.waitFor(1000);
			
	    // 연관 검색어 목록 수
		keywordCnt = await page.$$eval('#taglist li', li => li.length);
		
		console.log(keywordCnt);
		
		let item = {};
		    
	    for (cnt = 0; cnt < keywordCnt; cnt++) {
	    	
			// 검색 페이지 크롤링
			const _relKeyword = await page.evaluate(() => {
				
				let relKeyword = "";	// 연관 검색어
				
				const keyword = document.querySelector('#taglist li:first-child');	// 연관 검색어 element
				
				if (keyword) {
					
					relKeyword	= keyword.querySelector('a') && keyword.querySelector('a').textContent;	// 연관 검색어
					
					// 상품 element 삭제
					keyword.parentElement.removeChild(keyword);
					
				}

				return relKeyword.trim();
				
			});
			
			// 스크랩핑 연관 검색어
			if (_relKeyword != undefined && _relKeyword !== "") {
				
				rKeyword.push(_relKeyword);
				
			}
			
	    }
	    
	    item = {rKeyword};
	    
	    result.push(item);
	    
//	    await page.waitFor(2000);
	    
	} catch (e) {
		
	    logger.error(`[naverRelationSearchWordCrawler.js] relation searchword scraping ${e}`);
	    
	    await page.waitFor(50000);
	    
	    result = null;
	    
	} finally {
		
		if (keywordCnt === 0 || keywordCnt == undefined) {
	    	
			logger.warn('[naverRelationSearchWordCrawler.js] relation keyword entry');
	    	
	    }
		
	    return result;
		
	}
	

};

module.exports = naverRelationSearchWordCrawler;