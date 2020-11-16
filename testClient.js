const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

(async() => {
    const oldProxyUrl = 'http://bob:TopSecret@proxy.m.ppomppu.co.kr:8000';
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    // Prints something like "http://127.0.0.1:45678"
    console.log(newProxyUrl);

//    const browser = await puppeteer.launch({
//        args: [`--proxy-server=${newProxyUrl}`],
//    });
    const browser = await puppeteer.launch({headless : false, args: [`--proxy-server=${newProxyUrl}`],executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});

    // Do your magic here...
    const page = await browser.newPage();
    await page.goto('http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=shinsegae&page_no=1');

    // Clean up
    await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
})();