/**
 * 네이버 쇼핑 최저가 크롤링 main
 * 
 */
const MongoDB			= require('../db/mongoDB');

const puppeteer 		= require('puppeteer');

const crawlerFactory	= require('../scraping/crawlerFactory');

const NaverShoppingLowPrice = require('../scraping/naverShoppingLowPrice');

const modelArray = [
	{'name' : 'OLED77G1KNA', 	'itemNm' : 'LG 올레드 evo (벽걸이형)', 			'price' : '8426800'}
  , {'name' : 'FQ25LBNBA1M', 	'itemNm' : 'LG 오브제컬렉션 럭셔리 (매립배관형)', 	'price' : '5477400'}
  , {'name' : 'BWL1', 			'itemNm' : '더마 LED 마스크 플러스', 			'price' : '1200000'}
  , {'name' : 'S5DOC', 			'itemNm' : 'LG 트롬 스타일러 오브제컬렉션', 		'price' : '2096600'}
  , {'name' : '75UP8300MNA', 	'itemNm' : 'LG 울트라 HD TV (스탠드형)',	    'price' : '2257100'}
  , {'name' : '16Z90P-GA70K',   'itemNm' : 'LG 그램 16', 						'price' : '2096600'}
  , {'name' : 'AO9571WKT',   	'itemNm' : 'LG 코드제로 A9S 오브제컬렉션', 		'price' : '1534800'}
  , {'name' : 'F24EDE',   		'itemNm' : 'LG 트롬 스팀 펫', 					'price' : '1805700'}
];

const startNaverShoppingLowPrice = module.exports = {};

startNaverShoppingLowPrice.start = async () => {
	
	let mongoDB = null;
	
	if (!mongoDB) {
		mongoDB = new MongoDB();
	}
	
	// DB 연결
	await mongoDB.connect();
	
	let browser = await puppeteer.launch( { 
		
		headless : false,
		// 윈도우 크롬 자동 설치시 설치되는 경로
		executablePath : "C:/Program Files/Google/Chrome/Application/chrome.exe",
		// 실행될 브라우저의 화면 크기를 지정한다.
		defaultViewport : { width : 1920, height: 1080 },
		args : ['--window-size=1920,1080']

	} );
	
	let page = await browser.newPage();
	
	await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
	
	await page.goto('https://search.shopping.naver.com/search/all');

	await crawlerFactory.addJob('naverShoppingLowPrice', NaverShoppingLowPrice);
	
	let crawler = null;
	
	if (!crawler) {
		crawler = await crawlerFactory.create('naverShoppingLowPrice', {name : 'naverShoppingLowPrice', cluster : null});
	}
	
	// 크롤링 처리
	let _isSuccess = await crawler.processCrawling(page, modelArray);
	
	// 페이지 닫기
	await page.close();
	
	await browser.close();
	
	await mongoDB.disconnect();
	
	await mongoDB.remove();
	
	page	= null;
	browser = null;
	
};