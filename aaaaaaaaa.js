const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');


(async () => {
	
//	const server = new proxyChain.Server({
//		 port: 8088,
//		  verbose: true,
//		  prepareRequestFunction: ({request}) => {
//			  const userAgent = request.headers['user-agent'];
////			  const proxy = proxies[userAgent];
//			  return {
//				  upstreamProxyUrl: `http://bob:password123@proxy.example.com:3128`,
//			  };
//		  },
//		  customResponseFunction: () => {
//              return {
//                  statusCode: 200,
//                  body: `My custom response to ${request.url}`,
//              };
//          }
//	  });
//	  
//	  server.listen(() => console.log(`Proxy server is listening on port ${server.port}`));
	  
	  const oldProxyUrl = 'http://bob:TopSecret@proxy.example.com:8000';
	  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

	  // Prints something like "http://127.0.0.1:45678"
	  console.log(newProxyUrl);
	
	
  const browser = await puppeteer.launch({headless : false, args: [`--proxy-server=${newProxyUrl}`],executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});
//  const browser = await puppeteer.launch({headless : false,executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});
  const proxies = {
		  'useragent1': '112.168.11.170:808',
		  'useragent2': '220.149.25.33:80'
  };
  
  const page = await browser.newPage();
  console.log('Starting navigation');
  
	
//  server.on('connection', handleConnection);

//  server.listen(8088, function () {
//      console.log('server listening to %j', server.address());
//  });

  function handleConnection(conn) {
      var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
      console.log('new client connection from %s', remoteAddress);

      conn.setEncoding('utf8');  

      conn.on('data', onConnData);
      conn.once('close', onConnClose);
      conn.on('error', onConnError);

      function onConnData(d) {
          console.log('connection data from %s: %j', remoteAddress, d);
          conn.write(d);
      }

      function onConnClose() {
          console.log('connection from %s closed', remoteAddress);
      }

      function onConnError(err) {
          console.log('Connection %s error: %s', remoteAddress, err.message);
      }
  }
  
  page.on('response', async response => {
    const url = response.url();
    try {
      /*const req = response.request();
      const orig = req.url();
      const text = await response.text();
      const status = response.status();
      console.log({orig, status, text: text.length});
      
      */
      let status;
      let text;
      
      console.log(`status =================> ${response.status()}`);
      
      if(response.status) {
        status = response.status();
        console.log('1');
      }
      if(
        status // we actually have an status for the response
        && !(status > 299 && status < 400) // not a redirect
        && !(status === 204) // not a no-content response
//        && !(resourceType === 'image') // not an image
      ) {
        text =  await response.text();
        console.log('2');
      }
      else if(status == 404) {
    	  text = 'error';
    	  console.log('3');
      }
      
//      console.log(`text ====>${text}`);
      
      
    } catch (err) {
      console.error(`Failed getting data from: ${url}`);
      console.error(err);
    }
  });
  await page.goto('http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=shinsegae&page_no=1', {waitUntil: 'domcontentloaded', timeout: 60000});
//  await page.close();
//  await browser.close();
})();