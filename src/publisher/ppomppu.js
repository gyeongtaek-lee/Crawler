const { logger }	= require('../log');
const puppeteer = require('puppeteer');
const moment = require('moment');

const ppomppu = module.exports = {};


ppomppu.getPageURLs = async () => {
	
	try {
		
//		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		const browser = await puppeteer.launch({executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});
		
		const page = await browser.newPage();
		
		// 브라우저 User Agent 설정 (navigator.userAgent)
		await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
		
		//설정된 검색 페이지 URL들을 가져온다.
		let searchPageURLs = await getSearchPageURLs(page, {waitUntil: 'networkidle2'});
		
		//설정된 검색 페이지 URL들을 가져온다.
		//searchPageURLs = await getSearchPageURLs(page);
		
		//검색 페이지에서 게시글에 해당하는 URL들을 가져온다.
		//searchPageURLs = await getBbsURLs(page, searchPageURLs);
		
		//URL 필터링 (게시판종류)
		//searchPageURLs = await filteringUrls(searchPageURLs); 
		
		await browser.close();
		
		return searchPageURLs;
	}
	catch(e) {
		logger.error('[Publisher] getPageURLs : '+ e);
		throw new Error('--getPageURLs Error');
	}
};



//검색 페이지URL 가져오기
const getSearchPageURLs = async (page) => {
	
	//URL DB에서 가져오게
	const baseUrl = 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=';
	
	//검색어 DB에서 가져오게
	//const searchStringList = ['ssg'];
	const searchStringList = ['이마트몰', '신세계몰', 'ssg', '옥션', '지마켓'];
	
	const searchUrlList = [];
	
	//검색어 리스트 수 만틈 루프
	for(const searchString of searchStringList) {
		
		let pageNum = 1;
		let currentDateCnt = 0;
		let isCurrentDate = true;
		
		try{
			while(isCurrentDate) {
				//검색어와 페이지를 결합하여 URL생성
				const searchUrl = baseUrl + searchString + '&page_no=' + pageNum;
				await page.goto(searchUrl);
				
				//날짜기준으로 게시글리스트 추출
				let bbsList = await page.evaluate(() => document.getElementsByClassName('bbsList')[0].innerHTML);
				bbsList = bbsList.split('<span class=\"hi\"> | ');
				bbsList.splice(0, 1);
				
				
				//리스트중 오늘날짜 이전 존재여부 확인
				for(bbsDate of bbsList) {
					
					//날짜부분만 추출
					bbsDate = await moment('20' + bbsDate.substr(0, 8), 'YYYY-MM-DD');
					
					const compareDate = await moment().diff(bbsDate, 'day');
					
					//추출한 날짜중 금일이 아닌 날이 마지막 페이지
					if(compareDate >= 4) {
						isCurrentDate = false;
					}
					else {
						currentDateCnt++;
					}
				}
				
				if(currentDateCnt > 0){
					logger.info('[Publisher] getSearchPageURLs - ppomppu : ' + searchUrl);
					await searchUrlList.push({'routingKey' : 'ppomppu', 'message' : searchUrl});
				}
				await pageNum++;
			}
		}
		catch(e) {
			logger.error('[Publisher] getSearchPageURLs : '+ e);
			throw new Error('--getSearchPageURLs Error');
		}
	}
	return searchUrlList;
};



/*========================================== TEST SOURCE ================================================*/

//검색페이지의 상세게시물URL 가져오기
const getBbsURLs = async (page, searchPageURLs) => {
	
	//제목 제외단어 DB에서 가져오게
	//const searchIgnoreTitles = ['하이마트'];
	
	const bbsUrls = [];
	
	for(pageURL of searchPageURLs) {
		
		await page.goto(pageURL);
		
		const pageContent = await page.content();
		
		let bbsList = await page.evaluate(() => document.getElementsByClassName('bbsList')[0].innerHTML);
		
		if(bbsList.length > 0) {
			
			bbsList = bbsList.split('href=\"');
			bbsList.splice(0, 1);
			
			if(bbsList.length > 0) {
				
				for(bbsStr of bbsList) {
					
					bbsStr = 'http://m.ppomppu.co.kr' + await bbsStr.substr(0, await bbsStr.indexOf('\">'));
					bbsStr = await bbsStr.replace(/amp;/g, '');
					
					await bbsUrls.push(bbsStr);
				}
			}
		}
	}
	return bbsUrls;
};




//검색된 페이지에서 특정 URL주소 제거
const filteringUrls = async (bbsUrls) => {
	
	//URL주소 제외단어 DB에서 가져오게
	const searchFilteringURLs = ['onmarket', 'cmarket', 'card_market', 'market_social', 'pmarket', 'relay'];

	const filteredBbsUrls = [];
	
	let checker = 0;
	
	for(bbsUrl of bbsUrls) {
		
		for(let i=0; i<searchFilteringURLs.length; i++) {
			
			checker = await bbsUrl.indexOf(searchFilteringURLs[i]);
			
			if(checker != -1) {
				break;
			}
		}
		
		if(checker == -1){
			await filteredBbsUrls.push(bbsUrl);
		}
	}
	logger.info(filteredBbsUrls);
	return filteredBbsUrls;
};
