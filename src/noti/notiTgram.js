const { logger } = require('../log');
const config = require('../config');
const telegramBot = require('node-telegram-bot-api');

let bot = new telegramBot(config.token.ppomppuCrawlerBot);
let notiTgram = module.exports = {};

/**
 * Telegram 크롤러봇 그룹방에 메시지를 보낸다.
 * 
 * @param
 * notiMsg 			: 메시지 내용
 * 
 * @return
 * res.data			: 전송 결과 json
 */

notiTgram.send = async (chatNm, notiMsg) => {	
	
	let resultMsg = {'resultCode' : 'Fail', 'resultMsg' : 'Fail'};
	
	try{
		let chatId = 'config.noti.tgram.chatTgt.' + chatNm;
		
		resultMsg.resultMsg = await bot.sendMessage(eval(chatId), notiMsg);
		resultMsg.resultCode = 'Success';
		
		logger.info('[notiTgram.send()] - chatNm : ' + chatNm + ' chatId : ' + chatId + ' notiMsg : ' + notiMsg);
	}
	catch(e){
		
		logger.error('[notiTgram.send()] - Error : ' + e);
		resultMsg.resultMsg = e;
		resultMsg.resultCode = 'Fail';
	}
	finally{
		return resultMsg; 
	}
}