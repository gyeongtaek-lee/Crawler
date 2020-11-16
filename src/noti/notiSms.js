const axios = require('axios');
const { logger } = require('../log');
const config = require('../config');

let notiSms = module.exports = {};

/**
 * 전화번호 존재 시 전화번호를 사용 없을 경우 사번으로 조회하여 가져와 전송한다.
 * 
 * @param
 * empNo 			: 사번
 * notiMsg 			: 메시지 내용
 * phoneNumber 	: 전화번호
 * 
 * @return
 * res.data			: 전송 결과 json
 */
notiSms.send = (empNo, notiMsg, phoneNumber) => {
	
	return new Promise( (resolve, reject) => {
	
		logger.info('[notiSms.js] start send');
		
		let params = {
			notiMsg : {
				type : "SMS", 
				userId : empNo,
				sendSystemId : config.noti.sms.systemId,
				receiverPhoneNumber : phoneNumber,
				notiMsg : notiMsg
			}
		};	
	
	    let axiosConfig = {
		      headers: {
		          'Content-Type': 'application/json;charset=UTF-8',
		          "Accept": "application/json",
		      }
	    };
		
	    logger.info('[notiSms.js] sms sned url > ' + config.noti.sms.url);
	    
		axios.post(
				config.noti.sms.url  
			,	params
			,	axiosConfig
		).then((res) =>{
			logger.info('[notiSms.js] send response > ' + JSON.stringify(res.data));
			resolve( res.data );
		}).catch((err) =>{
			logger.error('[notiSms.js] send error > ' + err);
			reject( err );
		});
		
	});
	
}
