/**
 *  naver shopping low price scraping module (URL 쇼핑 페이지 크롤링)
 * */

const naverCrawler 	= {};

const { logger } 	= require('../log');

const config		= require('../config');

const fs 			= require('fs');

const axios 		= require('axios');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

/**
 * 스크래핑 Method
 */
naverCrawler.scraping = async(page, model) => {
	
	// page evaluate 내부의 노드에 전달하고 페이지를 평가하는 동안 콘솔 출력하는 방법 
	page.on('console', (log) => console[log._type](log._text));
	
	let result = new Array();
		
	let goodCnt 	= 0;
	let goods		= [];
	
	const exptWords = config.expt_word.word.join(" ");
	
	
	try {
		
		// 검색 창 초기화
		await page.$eval('.searchInput_search_input__1Eclz', el => el.value = '');
		
		// 검색 창 등록
		await page.type('.searchInput_search_input__1Eclz', model.name.concat(" ", exptWords));
		
		await page.waitFor(500);
		
		// 검색 버튼 클릭
		await page.click('.searchInput_btn_search__2Jzpc');
		
		await page.waitForSelector('.list_basis', { timeout: 5000 });
		
		// 클릭이벤트(낮은 가격순)
//		await page.click('.subFilter_sort_box__1r06j > a:nth-of-type(2)');	
		
		await page.waitFor(500);
		
	    // 상품 목록 수
	    goodCnt = await page.$$eval('.list_basis li', li => li.length);
	 
	    if ( 0 < goodCnt ) {
	    	
	    	
			// 검색 페이지 크롤링
			const contents = await page.evaluate(({model}) => {			
				
				let item = {};
				
				const modelNm 	= model.name;
				const itemNm	= model.itemNm;
				const lgeItemPrc= model.price;
				
				const good = document.querySelector('.list_basis li:first-child');
				
//				console.log(good);
//				console.log(modelNm);
//				console.log(lgeItemPrc);
				
				if (good) {
					
					let price = good.querySelector('.price_num__2WUXn') && good.querySelector('.price_num__2WUXn').textContent;		// 상품 가격	
					
//					console.log(price);
																						
//					const org_image_url	= good.querySelector('._productLazyImg').getAttribute('data-original').replace(/\?.*$/, '');							// 이미지 url
//					const title 					= good.querySelector('.tit a') && good.querySelector('.tit a').textContent; 													// 상품 명
//												
//					let priceReloadDt		= null; 																																					// 상품 가격 변경 일자
//					if (good.querySelector('.price .num').hasAttribute('data-reload-date')) {	
//						priceReloadDt = good.querySelector('.price ._price_reload').getAttribute('data-reload-date')	;											
//					}
//					
					const categoryDepth	= good.querySelectorAll('.basicList_category__wVevj');																											// 상품 카테고리 info
					let category1 = '';																																									// 카테고리 hierarchy 
					let category2 = '';																																									// 카테고리 hierarchy 
					let category3 = '';																																									// 카테고리 hierarchy 
					let category4 = '';																																									// 카테고리 hierarchy 
					
					for (const [_i, _v] of categoryDepth.entries()) {
						switch ( _i ) {
						  case 1:
							  category1 = _v.textContent;
						    break;
						  case 2:
							  category2 = _v.textContent;
						    break;
						  case 3:
							  category3 = _v.textContent;
						    break;
						  case 4:
							  category4 = _v.textContent;
						    break;
						  default:
						    console.debug('none depth!!');
						}
					}
					
//					categoryDepth.forEach((c) => {
//						const name	= c.textContent;
//						categories 	= `${categories} > ${name}`;
//					});
//					
//					const goodDetailInfo	= good.querySelectorAll('.detail a');																											// 상품 detail info
//					const description = [];																																							// 상품 detail info array																			
//					goodDetailInfo.forEach((d) => {
//						const name	= d.textContent;
//						description.push(name);
//					});
//					
//					const event				= good.querySelectorAll('.event') && good.querySelectorAll('.event').textContent;											// 이벤트
//					const review_point		= good.querySelector('.etc .star_graph > span') && good.querySelector('.etc .star_graph > span').style.width;// 별점(평점)
//					
//					const etcInfo 			= good.querySelectorAll('.etc .graph');																				
//					let review_cnt 	= '';																																								// 리뷰 건 수																									
//					let buy_cnt			= '';																																								// 구매 건 수
//					etcInfo.forEach((e) => {
//						
//						if (e.textContent.includes('리뷰')) {
//							review_cnt = e.querySelector('em').textContent;
//						}
//						else if (e.textContent.includes('구매건수')) {
//							buy_cnt 		= e.querySelector('em').textContent;
//						}
//						
//					});
//					
//					let creation_date			= good.querySelector('.etc .date') && good.querySelector('.etc .date').textContent;										// 상품 등록일
//					if (creation_date)	creation_date = creation_date.replace('등록일', '').trim();
//					
//					let keep_cnt				= good.querySelector('.etc ._keepCount') && good.querySelector('.etc ._keepCount').textContent;					// 찜하기 건 수
//					
					price 		= (price == null || price === '') ? 0 : parseInt(price.replace(/,/g,"")); 
//					review_cnt = (review_cnt == null || review_cnt === '') ? 0 : parseInt(review_cnt.replace(/,/g,"")); 
//					buy_cnt 		= (buy_cnt == null || buy_cnt === '') ? 0 : parseInt(buy_cnt.replace(/,/g,"")); 
//					keep_cnt 	= (keep_cnt == null || keep_cnt === '') ? 0 : parseInt(keep_cnt.replace(/,/g,"")); 
//					
//					// 이미지 파일 확장자 명
//					const ext_name 		= org_image_url.split('.').slice(-1)[0];
//					const imgPath			= `image/naver/${goodNo.substr(goodNo.length-2, 2)}/${goodNo.substr(goodNo.length-4, 2)}/${goodNo.substr(goodNo.length-6, 2)}/${goodNo}.${ext_name}`;
//					const dirPath				= `image/naver/${goodNo.substr(goodNo.length-2, 2)}/${goodNo.substr(goodNo.length-4, 2)}/${goodNo.substr(goodNo.length-6, 2)}`;
//					
//						
//					item = {goodNo, org_image_url, imgPath, dirPath, title, price, priceReloadDt, categories, description, event, review_point, review_cnt, buy_cnt, creation_date, keep_cnt};
					
					item = {modelNm, itemNm, lgeItemPrc, price, category1, category2, category3, category4};
					
				}

				return item;
				
			}, {model});	
			
			if (contents.price != undefined) {
				
				result.push(contents);
				
			}
			
	    };
	    
	    await page.waitFor(1000);
	    
	} catch (e) {
		
	    logger.error(`[naverShoppingLowPriceCrawler.js] Naver scraping ${e}`);
	    
	    result = null;
	    
	} finally {
		
		if (goodCnt === 0 || goodCnt == undefined) {
	    	
	    	throw new ContentNotFoundError('[naverShoppingLowPriceCrawler.js] board entry');
	    	
	    }
		
	    return result;
		
	}
	

};

module.exports = naverCrawler;