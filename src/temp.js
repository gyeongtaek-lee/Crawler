/**
 * http://usejsdoc.org/
 */
const cron  = require('node-cron');

const naver = require('./main/startNaverShoppingLowPrice');

(async () => {
	
	cron.schedule('*/1 13 * * *', function(){
		
//		console.log(new Date());
		
		naver.start();
		
	});
	
})();