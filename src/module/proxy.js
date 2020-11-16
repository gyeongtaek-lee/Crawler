/**
 *  Out Proxy Server IP list Crawling
 * */

var proxy = {};

const { logger }		= require('../log');

const puppeteer	= require('puppeteer');

//crawler = async () => {
proxy.crawler = async () => {
	
	let result = new Array();
	let browser;
	let page;
	
	try {
		
		// puppeteer 실행 브라우저 객체 생성
		browser = await puppeteer.launch({
			headless	: true,
			// 윈도우 크롬 자동 설치시 설치되는 경로
		    executablePath : "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
		});
		
		// 페이지 객체 생성
		page = await browser.newPage();
		
		await page.goto('http://spys.one/free-proxy-list/KR/');
		
		const proxies = await page.evaluate(() => {
			
			const ips 			= Array.from(document.querySelectorAll('tr > td:first-of-type > .spy14')).map((v) => v.textContent.replace(/document\.write\(.+\)/, ''));	// ip
			const types 		= Array.from(document.querySelectorAll('tr > td:nth-of-type(2)')).slice(5).map((v) => v.textContent);														// protocol type
			const latencies = Array.from(document.querySelectorAll('tr > td:nth-of-type(6) .spy1')).map((v) => v.textContent);															// latency
			
			return ips.map((v, i) => {
				return {
					ip: v,
					type: types[i],
					latency: latencies[i],
				}
			});
		});
		
		const filtered = proxies.filter((v) => v.type.startsWith('HTTP')).sort((p, c) => p.latency - c.latency);
		
	    await Promise.all(filtered.map(async (v) => {
	    	
	    	result.push(v.ip);
	      
	    }));
	    
	} catch (e) {
		
		logger.error('proxy crawling error : ', e);
		
	} finally {
		
		// 페이지 닫기
		await page.close();
		
		// 브라우저 닫기
	    await browser.close();
	    
	    return result;
		
	}
	
};

/*(async () => {

let result = await crawler();

console.log(result);

})()*/


module.exports = proxy;