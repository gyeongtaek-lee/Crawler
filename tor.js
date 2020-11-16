
const puppeteer = require('puppeteer');
const colors = require('colors/safe');

(async () => {
	const args = ['--proxy-server=socks5://127.0.0.1:9050'];
	const browser = await puppeteer.launch({ args, timeout : 60000, executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' }	);
	const page = await browser.newPage();
	await page.goto('https://check.torproject.org/', {waitUntil: 'load', timeout: 0});
	const isUsingTor = await page.$eval('body', el =>
		el.innerHTML.includes('Congratulations. This browser is configured to use Tor')
	);

	if (!isUsingTor) {
		console.log(colors.red.bold('Not using Tor. Closing...'));
		return await browser.close();
	}

	console.log(colors.green.bold('Using Tor. Continuing... '));

	// Now you can go wherever you want
	await page.goto('https://naver.com/', {waitUntil: 'load', timeout: 0});

        // You would add additional code to do stuff... 

	// Then when you're done, just close
	await browser.close();
})();