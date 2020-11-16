const publisher = require('./publisher');
const rabbitmq = require('./rabbitmq');
const { logger } = require('./log');
const config = require('./config');


(async () => {
	
	try {
		const targetPageList = await publisher.excutePageScrap('ppomppu');
		
		let successCnt = 0;
		
		if(targetPageList != undefined && targetPageList.length > 0) {
			
			let result = await rabbitmq.pushMessage( config.exchageNameSite , targetPageList);
			successCnt += result.successCnt;
			
			const resultLog	=	{
					'targetPageCnt'		: targetPageList.length,
					'pushSuccessCnt' 	: successCnt,
			}
			
			logger.info('[Publisher] Main : ' + 'target : ' + resultLog.targetPageCnt + ' success : ' + resultLog.pushSuccessCnt);
		}
	}
	catch(e) {
		logger.error('[Publisher] Main : ' + e);
		throw new Error('--Main Function Error');
	}
	finally {
		logger.info('exit');
		process.exit(0);
	}
	
})(); 