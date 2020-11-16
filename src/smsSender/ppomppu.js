const moment		= require('moment');
const { logger }	= require('../log');
const noti	 		= require('../noti');
const global 		= require('../db/GlobalVariable');
const schema 		= require('../db/schema/ppomppuBoard.js');

const ppomppu = module.exports = {};

ppomppu.sendSms = async () => {

	const receiverList =	[
	                    	 	/*
								{'empNo' : '131084', 'phoneNumber' : '01035630813'} //이경택
						  	  , {'empNo' : '153535', 'phoneNumber' : '01071533106'} //이원진
							  , {'empNo' : '157374', 'phoneNumber' : '01035643956'} //오경원
						  	  , {'empNo' : '191425', 'phoneNumber' : '01032143044'} //김하균
						  	  
						  	  , {'empNo' : '072027', 'phoneNumber' : '01091152648'} //송기종
						  	  , {'empNo' : '117622', 'phoneNumber' : '01026471062'} //신정훈
						  	  , {'empNo' : '132519', 'phoneNumber' : '01028470831'} //조혜미
						  	  , {'empNo' : '114465', 'phoneNumber' : '01096100823'} //박희주
						  	  , {'empNo' : '110650', 'phoneNumber' : '01077707112'} //이은주
						  	  
						  	  , {'empNo' : '121834', 'phoneNumber' : '01026015711'} //구현아
						  	  , {'empNo' : '132894', 'phoneNumber' : '01020608995'} //이광욱
						  	  , {'empNo' : '117944', 'phoneNumber' : '01033875172'} //박남현
						  	  , {'empNo' : '043076', 'phoneNumber' : '01090214702'} //이용석
						  	  , {'empNo' : '146665', 'phoneNumber' : '01052554555'} //김동욱
						  	 	*/
							];

	const currentDate		= await moment().format('YY-MM-DD');
	const yesterdayDate 	= await moment().add(-1, 'days').format('YY-MM-DD');

	const smsSuccessList	= [];

//	DB Connection 확인
	if(global.isConnected) {

		try{
//			DB에서 전송 대상 가져오기
			const resultList = await schema.find()
			.exists('sendMsg', false)
			.and([
			      { $or: [{createDate: currentDate}, {createDate: yesterdayDate}]}
			      ]);


			logger.info('[SmsSender] sendSms - count : ' + resultList.length);


			for(const result of resultList) {

				const notiMsg	= '[SSG 뽐뿌 모니터링]\n' + '[제목] ' + result.title + '\n' + '[URL] ' + result.url; 

				//텔레그램 전송
				const smsResult = await noti.tgramSend('ppomppuGroup', notiMsg);
				
				if(smsResult.resultCode == 'Success') {
					smsSuccessList.push({'_id' : result._id, 'boardId' : result.boardId, 'boardType' : result.boardType});
				}
			}
			
			let updateSuccessCnt = 0;

//			SMS 전송 성공 대상 전송성공으로 UPDATE
			if(smsSuccessList.length > 0) {

				for(const smsSuccess of smsSuccessList) {

					const result = await schema.updateOne({'_id' : smsSuccess._id}, {$set:{'sendMsg' : true}});

					if(result != undefined) {
						updateSuccessCnt += result.ok;
					}
				}
			}

			logger.info('[SmsSender] sendSms : \n'
					  + 'Total Url target : ' + resultList.length + '\n'
					  + 'SMS send Success : ' + smsSuccessList.length + '\n'
					  + 'update Sucess : ' + updateSuccessCnt
			);
			
			return	{
						'targetCnt'		: resultList.length,
					    'smsSuccessCnt' : smsSuccessList.length,
						'updSuccessCnt' : updateSuccessCnt
					};
		}
		catch(e) {
			logger.error('[SmsSender] sendSms : ' + e);
		}
	}
	else {
		throw new Error('DB Connected Error!');
	}
}