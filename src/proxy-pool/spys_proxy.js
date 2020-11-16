/**
 *  Out Proxy Server IP list Crawling
 * */

var spys_proxy = {};

const { logger }		= require('../log');

const puppeteer	= require('puppeteer');

//crawler = async () => {
spys_proxy.crawler = async () => {
	
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
		
		// 브라우저 User Agent 설정 (navigator.userAgent)
		await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
		
		await page.goto('http://spys.one/free-proxy-list/KR/');
		
		const proxies = await page.evaluate(() => {
			
			const ips 				= Array.from(document.querySelectorAll('tr > td:first-of-type > .spy14')).map((v) => v.textContent.replace(/document\.write\(.+\)/, ''));	// ip
			const types 			= Array.from(document.querySelectorAll('tr > td:nth-of-type(2)')).slice(5).map((v) => v.textContent);														// protocol type
			const latencies 		= Array.from(document.querySelectorAll('tr > td:nth-of-type(6) .spy1')).map((v) => v.textContent);															// latency
			const uptimes 		= Array.from(document.querySelectorAll('tr > td:nth-of-type(8) .spy1 acronym')).map((v) => v.getAttribute('title'));										// Uptime
			const checkDates 	= Array.from(document.querySelectorAll('tr > td:nth-of-type(9) .spy1 .spy5')).map((v) => v.textContent);													// Check date
			
			return ips.map((v, i) => {
				return {
					ip: v,
					type: types[i],
					latency: latencies[i],
					uptime: uptimes[i],
					ckDate: checkDates[i]
				}
			});
		});
		
		const filtered = proxies.filter((v) => {
			
			let flag = false;
			
			const uptimeArr = String(v.uptime).split(' ');
			const uptime = (Number(uptimeArr[0]) / Number(uptimeArr[2]));
			
			if (v.type.startsWith('HTTP') && Number(v.latency) < 3.0 && (v.ckDate.includes('mins') || v.ckDate.includes('hours') || v.ckDate.includes('1 days')) && uptime >= 0.7) {
				
				flag = true;
				
			}
			
			return flag;
			
		}).sort((p, c) => p.latency - c.latency);
		
	    await Promise.all(filtered.map(async (v) => {
	    	
	    	result.push({ip : v.ip, latency : Number(v.latency)});
	      
	    }));
	    
	} catch (e) {
		
		logger.error('spys_proxy crawling error : ', e);
		
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


module.exports = spys_proxy;