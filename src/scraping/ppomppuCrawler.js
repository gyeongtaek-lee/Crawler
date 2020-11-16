/**
 *  ppomppu scraping module (URL 게시판 페이지 크롤링)
 * */

const ppomppuCrawler = {};

const { logger } 	= require('../log');

const config			= require('../config');

const moment 		= require('moment');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

/**
 * 스크래핑Method
 */
ppomppuCrawler.scraping = async(page) => {
	
	let result = new Array();
	
	let bbsCnt = 0;
	
	try {
		
		const yesterDay = moment().add('-1', 'd').format('YY-MM-DD');
		
		const validationBoardTypes = JSON.parse(JSON.stringify(config.ppomppu_boardType.type));
		
		await page.waitFor(1000);
			
	    // 게시판 글 목록 수
	    bbsCnt = await page.$$eval('.bbsList > li', li => li.length);
		    
	//	    console.log(`bbsCnt=${bbsCnt}`);
		    
	    for (cnt = 0; cnt < bbsCnt; cnt++) {
	    	
			// 검색 페이지 크롤링
			const contents = await page.evaluate((validationBoardTypes) => {
				
				let item = {};
				
				const bbs = document.querySelector('.bbsList a:first-child');
				
				if (bbs) {
					
					const boardType	= bbs.querySelector('.b') && bbs.querySelector('.b').textContent;
					
					const url 				= bbs.href;	  // 게시판 url
					
					// 장터 게시판 제외
					if (!url.includes('market')) {
						
						// 유효한 게시판 유형 검색
						for (const [i, t] of validationBoardTypes.entries()) {
							
							if (boardType.includes(validationBoardTypes[i])) {
																
								const title 				= bbs.querySelector('strong') && bbs.querySelector('strong').textContent;									// 제목
								const commCnt 		= bbs.querySelector('.rp') && bbs.querySelector('.rp').textContent.replace(/[\[\]]/gi, '');			// 댓글 수
								const board 			= boardType.replace(/[\[\]]/gi, '')																						// 게시판 유형
								const otherInfo 		= bbs.querySelector('.hi') && bbs.querySelector('.hi').textContent.replace(/[\|\[\]\/]/gi, '');	// 기타정보
								
								const info				= otherInfo.trim().split('  ');
								const date			= info[0]; 
								const searchCnt	= info[1]; 
								const recCnt			= info[2]; 
								
								// 제목 제외
								if (!title.includes('하이마트')) {
									
									item = {url, title, commCnt, board, date, searchCnt, recCnt};
									
								}
								
							}
							
						};
						
					}
					
					bbs.parentElement.removeChild(bbs);
					
				}

				return item;
				
			}, validationBoardTypes);
			
			if (contents.url != undefined && contents.date >= yesterDay)	result.push(contents);
			
	    }
		    
	    await page.waitFor(1000);
	    
	} catch (e) {
		
	    logger.error(`[ppomppuCrawler.js] Ppomppu scraping ${e}`);
	    
	    result = null;
	    
	} finally {
		
		if (bbsCnt === 0 || bbsCnt == undefined) {
	    	
	    	throw new ContentNotFoundError('[ppomppuCrawler.js] board entry');
	    	
	    }
		
	    return result;
		
	}
	

};

module.exports = ppomppuCrawler;