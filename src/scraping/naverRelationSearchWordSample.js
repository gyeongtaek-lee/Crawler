/**
 * 네이버 쇼핑 크롤링 예제
 */
const MongoDB	 	= require('../db/mongoDB');

const puppeteer = require('puppeteer');

const NaverRelationSearchWord = require('./naverRelationSearchWord');

const crawlerFactory 		= require('./crawlerFactory');

(async () => {
	
	const mongoDB = new MongoDB();
	
	// DB 연결
	await mongoDB.connect();
	
	const browser = await puppeteer.launch( { 
		headless : false,
		// 윈도우 크롬 자동 설치시 설치되는 경로
		executablePath : "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
		// 실행될 브라우저의 화면 크기를 지정한다.
		defaultViewport : { width : 1920, height: 1080 },
		args : ['--window-size=1920,1080']
//		args : ['--window-size=1920,1080', '--proxy-server=106.10.55.212:3128']
//		args : ['--proxy-server=socks5://175.204.248.213:1080', '--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 175.204.248.213:1080"']
		
	} );
	
	const page = await browser.newPage();
	
	await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
	page.on('console', (log) => console[log._type](log._text));
	
//	const url = 'https://search.shopping.naver.com/search/all.nhn?query=%EC%9A%B0%EC%9C%A0&cat_id=&frm=NVSHATC|category=식품|tgtKeyword=우유';
//	const url = 'https://search.shopping.naver.com/search/all.nhn?query=아기분유물&cat_id=&frm=NVSHATC|category=식품|tgtKeyword=아기분유물';
	const url = 'https://msearch.shopping.naver.com/search/all?query=마약베개&cat_id=&frm=NVSHATC|category=식품|tgtKeyword=아기분유물';
	
	const urlArr = url.split('|');
	
	await page.goto(urlArr[0]);
	
//	const crawler = new Naver({'name':'naver', cluster: null});
	
	await crawlerFactory.addJob('naverRelationSearchWord', NaverRelationSearchWord);
	
	const crawler = await crawlerFactory.create('naverRelationSearchWord', {name : 'naverRelationSearchWord', cluster : null});
	
	console.log(crawler);
	
	// 크롤링 처리
	let _isSuccess = await crawler.processCrawling(page, urlArr);
	
	console.log(_isSuccess);
	
	mongoDB.disconnect();
	
	process.exit(0);
	
})();

