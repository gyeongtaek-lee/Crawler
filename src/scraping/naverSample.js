/**
 * 네이버 쇼핑 크롤링 예제
 */
const MongoDB	 	= require('../db/mongoDB');

const puppeteer = require('puppeteer');

const Naver = require('./naver');

const crawlerFactory 		= require('./crawlerFactory');

(async () => {
	
	const mongoDB = new MongoDB();
	
	console.log('0')
	
	// DB 연결
	await mongoDB.connect();
	
	console.log('1');
	
	const browser = await puppeteer.launch( { 
		headless : false,
		// 윈도우 크롬 자동 설치시 설치되는 경로
		executablePath : "C:/Program Files/Google/Chrome/Application/chrome.exe",
		// 실행될 브라우저의 화면 크기를 지정한다.
		defaultViewport : { width : 1920, height: 1080 },
//		args : ['--window-size=1920,1080', '--proxy-server=106.10.55.212:3128']
		args : ['--window-size=1920,1080']
//		args : ['--proxy-server=socks5://175.204.248.213:1080', '--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 175.204.248.213:1080"']
		
	} );
	
	const page = await browser.newPage();
	
	const version = await page.browser().version();
	console.log(version);
	
	await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
//	page.on('console', (log) => console[log._type](log._text));
	
//	await page.goto('https://search.shopping.naver.com/search/all.nhn?origQuery=%EC%97%AC%EC%84%B1%EA%B2%BD%EB%9F%89%ED%8C%A8%EB%94%A9&pagingIndex=1&pagingSize=80&viewType=list&sort=rel&query=%EC%97%AC%EC%84%B1%EA%B2%BD%EB%9F%89%ED%8C%A8%EB%94%A9');
	await page.goto('https://search.shopping.naver.com/search/all.nhn?origQuery=%EB%A1%B1%ED%8C%A8%EB%94%A9&pagingIndex=1&pagingSize=80&viewType=list&sort=rel&frm=NVPGLET&query=%EB%A1%B1%ED%8C%A8%EB%94%A9');
	
	console.log('2');
	
//	const crawler = new Naver({'name':'naver', cluster: null});
	
	await crawlerFactory.addJob('naver', Naver);
	
	const crawler = await crawlerFactory.create('naver', {name : 'naver', cluster : null});
	
	console.log(crawler);
	
	// 크롤링 처리
	let _isSuccess = await crawler.processCrawling(page);
	
//	console.log(_isSuccess);
	
	mongoDB.disconnect();
	
	process.exit(0);
	
})();

