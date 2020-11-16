const puppeteer = require('puppeteer');

const naver = module.exports = {};

//MAIN
naver.getPageURLs = async (dbConnection) => {
	
	try {
		const browser = await puppeteer.launch({executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});
		
		const page = await browser.newPage();
		
		let searchPageURLs = [];
		
		//설정된 검색 페이지 URL들을 가져온다.
		searchPageURLs = await getSearchPageURLs();
		
		//검색 페이지에서 게시글에 해당하는 URL들을 가져온다.
		searchPageURLs = await getBbsURLs(page, searchPageURLs);
		
		//URL 필터링 (게시판종류)
		searchPageURLs = await filteringUrls(searchPageURLs); 
		
		await browser.close();
		
		return searchPageURLs;
	}
	catch(err) {
		console.log(err);
	}
	
};