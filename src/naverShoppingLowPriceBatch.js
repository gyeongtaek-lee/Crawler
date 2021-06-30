/**
 * http://usejsdoc.org/
 */
const moment = require('moment');

const cron  = require('node-cron');

const naver = require('./main/startNaverShoppingLowPrice');

(async () => {
	
	cron.schedule('30 13 * * *', function(){
		
		const currentDate = moment().add('0', 'd').format('YYYYMMDD');
		
		console.info(`naver shopping low price start : ${currentDate}`);
		
		naver.start();
		
		console.info(`naver shopping low price end : ${currentDate}`);
		
	});
	
})();