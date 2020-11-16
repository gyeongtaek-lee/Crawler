/**
 *  naver shopping scraping module (URL 쇼핑 페이지 크롤링)
 * */

const naverCrawler = {};

const { logger } 	= require('../log');

const config			= require('../config');

const fs 				= require('fs');

const axios 			= require('axios');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

/**
 * 스크래핑Method
 */
naverCrawler.scraping = async(page) => {
	
	let result = new Array();
	
	let goodCnt = 0;
	
	try {
		
	    // 상품 목록 수
	    goodCnt = await page.$$eval('.goods_list > li', li => li.length);
	    
		    
	    for (cnt = 0; cnt < goodCnt; cnt++) {
	    	
			// 검색 페이지 크롤링
			const contents = await page.evaluate(() => {
				
				let item = {};
				
				const good = document.querySelector('.goods_list li:first-child');
				
				if (good) {
					
					const advertising	= good.querySelector('.ad_stk') && good.querySelector('.ad_stk').textContent;	// 광고 상품
					
					// 광고상품  제외
					if (!advertising) {
						
						const goodNo			= good.getAttribute('data-nv-mid'); 																											// 상품 번호
						const org_image_url	= good.querySelector('._productLazyImg').getAttribute('data-original').replace(/\?.*$/, '');							// 이미지 url
						const title 					= good.querySelector('.tit a') && good.querySelector('.tit a').textContent; 													// 상품 명
						let price 					= good.querySelector('.price .num') && good.querySelector('.price .num').textContent;									// 상품 가격
						let priceReloadDt		= null; 																																					// 상품 가격 변경 일자
						if (good.querySelector('.price .num').hasAttribute('data-reload-date')) {	
							priceReloadDt = good.querySelector('.price ._price_reload').getAttribute('data-reload-date')	;											
						}
						
						const categoryDepth	= good.querySelectorAll('.depth a');																											// 상품 카테고리 info
						let categories = '';																																									// 카테고리 hierarchy 
						categoryDepth.forEach((c) => {
							const name	= c.textContent;
							categories 		= `${categories} > ${name}`;
						});
						
						const goodDetailInfo	= good.querySelectorAll('.detail a');																											// 상품 detail info
						const description = [];																																							// 상품 detail info array																			
						goodDetailInfo.forEach((d) => {
							const name	= d.textContent;
							description.push(name);
						});
						
						const event				= good.querySelectorAll('.event') && good.querySelectorAll('.event').textContent;											// 이벤트
						const review_point		= good.querySelector('.etc .star_graph > span') && good.querySelector('.etc .star_graph > span').style.width;// 별점(평점)
						
						const etcInfo 			= good.querySelectorAll('.etc .graph');																				
						let review_cnt 	= '';																																								// 리뷰 건 수																									
						let buy_cnt			= '';																																								// 구매 건 수
						etcInfo.forEach((e) => {
							
							if (e.textContent.includes('리뷰')) {
								review_cnt = e.querySelector('em').textContent;
							}
							else if (e.textContent.includes('구매건수')) {
								buy_cnt 		= e.querySelector('em').textContent;
							}
							
						});
						
						let creation_date			= good.querySelector('.etc .date') && good.querySelector('.etc .date').textContent;										// 상품 등록일
						if (creation_date)	creation_date = creation_date.replace('등록일', '').trim();
						
						let keep_cnt				= good.querySelector('.etc ._keepCount') && good.querySelector('.etc ._keepCount').textContent;					// 찜하기 건 수
						
						price 		= (price == null || price === '') ? 0 : parseInt(price.replace(/,/g,"")); 
						review_cnt = (review_cnt == null || review_cnt === '') ? 0 : parseInt(review_cnt.replace(/,/g,"")); 
						buy_cnt 		= (buy_cnt == null || buy_cnt === '') ? 0 : parseInt(buy_cnt.replace(/,/g,"")); 
						keep_cnt 	= (keep_cnt == null || keep_cnt === '') ? 0 : parseInt(keep_cnt.replace(/,/g,"")); 
						
						// 이미지 파일 확장자 명
						const ext_name 		= org_image_url.split('.').slice(-1)[0];
						const imgPath			= `image/naver/${goodNo.substr(goodNo.length-2, 2)}/${goodNo.substr(goodNo.length-4, 2)}/${goodNo.substr(goodNo.length-6, 2)}/${goodNo}.${ext_name}`;
						const dirPath				= `image/naver/${goodNo.substr(goodNo.length-2, 2)}/${goodNo.substr(goodNo.length-4, 2)}/${goodNo.substr(goodNo.length-6, 2)}`;
						
							
						item = {goodNo, org_image_url, imgPath, dirPath, title, price, priceReloadDt, categories, description, event, review_point, review_cnt, buy_cnt, creation_date, keep_cnt};
							
						
					}
					
					// 상품 element 삭제
					good.parentElement.removeChild(good);
					
					// 이미지 로딩 이슈로 스크롤 이동 처리
					window.scrollBy(0, 100);
					
				}

				return item;
				
			});
			
			if (contents.title != undefined) {
				
				
				// 폴더 읽기 및 생성
				await checkDir(contents.dirPath).then(async function (data) {
					
					// axios를 사용하여 이미지 파일을 buffer 형식으로 얻어옴.
					const imgResult = await axios.get(contents.org_image_url, {
						
						responseType: 'arraybuffer'	// 이미지 데이터는 buffer 형식으로 가져와야 함
						
					});
					
					// 이미지를 폴더에 저장
					fs.writeFileSync(contents.imgPath, imgResult.data);
					
					result.push(contents);
					
				}).catch(function (err) {
					
					throw new Error(err.message);
					
				});
				
			}
			
	    }
	    
	    await page.waitFor(1000);
	    
	} catch (e) {
		
	    logger.error(`[naverCrawler.js] Naver scraping ${e}`);
	    
	    result = null;
	    
	} finally {
		
		if (goodCnt === 0 || goodCnt == undefined) {
	    	
	    	throw new ContentNotFoundError('[naverCrawler.js] board entry');
	    	
	    }
		
	    return result;
		
	}
	

};

async function checkDir(path) {
	
	return new Promise((resolve, reject) => {
		
		const callbacks = { resolve, reject };
		
		try {
			
			// 폴더 읽기 및 생성
			if (!fs.existsSync(path)) {
				
				fs.mkdirSync(path, { recursive: true });
				
			}
			
			callbacks.resolve(true);
			
		}
		catch (e) {
			
			callbacks.reject(e);
			
		}
		
	});
	
};

module.exports = naverCrawler;