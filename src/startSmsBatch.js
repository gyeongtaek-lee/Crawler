const { logger } 	= require('./log');
const MongoDB	 	= require('./db/mongoDB');
const global 		= require('./db/GlobalVariable');
const Ppomppu 		= require('./db/schema/ppomppuBoard.js');
const smsSender 	= require('./smsSender');

(async () => {
	
	try {
		const mongoDB = new MongoDB();
		await mongoDB.connect();
		
		const result = await smsSender.sendSms('ppomppu');
		
		if(result != undefined) {
			logger.info(result);
		}
		
		await mongoDB.disconnect();
	}
	catch(e) {
		logger.error('[SmsSender] Main : ' + e);
		throw new Error('--Main Function Error');
	}
	finally {
		process.exit(0);
	}
	
})();