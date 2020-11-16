/**
 * ppomppu Crawling Class
 */

const { logger }	= require('../log');

const Crawler 	= require('./crawler');

const global 		= require('../db/GlobalVariable');

const { ContentNotFoundError, TargetNotAccessError, InternalError } = require('../errors/CrawlerError');

// 뽐뿌 모바일 게시판 크롤링
const ppomppuCrawler = require('./ppomppuCrawler');

// 뽐뿌 게시판 collection schema model
const Board 		= require('../db/schema/ppomppuBoard');		


class Ppomppu extends Crawler {
	
	constructor(options) {
		
		super(options);
		
	}
	
	/**
	 * 크롤링 처리 Method
	 */
	async processCrawling(page, data) {
		
		// page evaluate 내부의 노드에 전달하고 페이지를 평가하는 동안 콘솔 출력하는 방법 
		//	page.on('console', (log) => console[log._type](log._text));
		
		// 뽐뿌 페이지 로딩 여부 확인
		try {
			
			  const temp = await page.waitForSelector('.result-tab', { timeout: 5000 });
			  
		} catch (error) {
			
			throw new TargetNotAccessError('[ppomppu.js]');
		  
		}
		
		let result	= 'FAIL';
		
		let records	= new Array();
		
		try {
			
			// Run scraping method
			const contents = await ppomppuCrawler.scraping(page);
			
			if (contents == null) throw new Error('[ppomppu.js] Ppomppu scraping Error');
			
			await Promise.all(contents.map(async (c) => {
				
				const queryParams = ['id', 'no'];	// 게시판 url 의 게시판 종류, 게시판 번호query parameter name
				
				let _boardType	= '';
				let _boardId		= '';
				
				queryParams.map(async (v) => {
					
					v = v.replace(/[\[\]]/g, '\\$&');
					
					const regex = new RegExp('[?&]' + v + '(=([^&#]*)|&|#|$)'),
					
					params = regex.exec(c.url);
					
					if (!params || !params[2]) {
						
						_boardType	= '';
						_boardId		= '';
						
					} 
					else {
						
						if (v === 'id') _boardType = params[2];
						else if (v === 'no') _boardId = params[2];
						
					}
					
				});
				
//				console.debug(`test=${_boardType},${_boardId}`);
				
				let _data = {boardId: _boardId, boardType: _boardType, title: c.title, url: c.url, createDate: c.date, searchCnt: c.searchCnt, recCnt: c.recCnt};
				
				// db connection check
				if (global.isConnected) {
					
					// 이전 크롤링 처리 대상 여부 체크
					try {
						
						//					Board.findOne({boardId: _boardId, boardType: _boardType}, (err, board) => {
						await Board.updateOne({ boardId: _boardId, boardType: _boardType }, { $set: _data }, { upsert: true, setDefaultsOnInsert: true }, (err, board) => {
							
							if (err) {
								
								logger.error(`[ppomppu.js] Crawler DB Upsert Error : ${err}`);
								
								throw new Error('[ppomppu.js] DB Upsert Error!'); 
								
							}
							else if(board.upserted != undefined) {
								
								records.push(c);
								
							}
							
						});
						
					} catch (e) {
						
						logger.error(e);
						
						throw new Error('[ppomppu.js] Error checking whether crawler target exists in db!'); 
						
					}
					
				}
				else {
					
					throw new Error('[ppomppu.js] DB Connected Error!');
					
				}
				
			}));
			
			result = 'SUCCESS';
			
		} 
		catch (e) {
			
			if (e.name === 'ContentNotFoundError') {
				
				logger.error(e.message);
				
			}
			else{
				
				logger.error(`[ppomppu.js] Crawler processCrawling ${e}`);
				
			}
			
		    result = 'FAIL';
		    
		} 
		finally {
			
			return result;
			
		}
		
	}
	
}

module.exports = Ppomppu;