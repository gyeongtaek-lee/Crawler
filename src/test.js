const noti = require('./noti');
const rabbitmq = require('./rabbitmq');
const { logger } = require('./log');
const path = require('path');

const config = require('./config');

const rabbitmqManage = require('./rabbitmq/manager');

main();
 
function main(){
	
//	basic();					// Promise 테스트 
	
//	asyncTest();				// async 테스트 (적용)
//	noAsyncTest();			// async 테스트	(미적용)
	
//	getConfig();				// config 확인용
//	getFileName()			// Path 테스트
	
//	testLog();					// LOG 테스트
//	noAsyncTest()
	
//	testSms();					// SMS 전송 테스트
//	testTgram();				// Telegram 전송 테스트
	
//	testPublish();				// RabbitMQ Push 테스트
//	testFailConsumer();		// RabbitMQ Consumer 테스트
//	testNewConsumer1();	// RabbitMQ Consumer 테스트
//	testNewConsumer2();	// RabbitMQ Consumer 테스트
//	testNewConsumer3();	// RabbitMQ Consumer 테스트
	
	
//makeExchange();
	
//	testRePublish();
	testPublish();

}


async function testRePublish(){
	 
	var client = await require('./rabbitmq/management').client({
		 host : '10.203.7.214',
		 port : 12672,
		 timeout : 25000,
		 user : 'test',
		 password : 'test'
	});

//	// 1. 실패 Queue 정보를 가져온다.
//	let beforeQueue = await 	client.getQueue(
//			{
//				vhost : '/',
//				queue : 'test'
//			}, function (err, res) {
//				if (err) {
//					logger.error( '[manager.js] getQueue error => ' + JSON.stringify(err) );
//				}else{
//					logger.info('[manager.js] getQueue success');
//					let beforeQueueCount = res.messages;
//					logger.info ( '[startRetry.js] beforeQueueCount => ' + beforeQueueCount );					
//				}
//			}
//	);
	
	

	
	
	client.moveQueue(
			{
				vhost 			: '/',
				srcQueue 	: 'movetest1',
				destQueue 	: 'movetest' 
			}, function (err, res) {
				if (err) {
					console.log(err);
				} else {
					console.log(res.messages);
				}
			}		
		)
		
		;

//	var queue = await rabbitmqManage.searchQueue(
//			{
//				host 			: '10.203.7.214',
//				port 			: 15672,
//				userId 		: 'test',
//				password 	: 'test',
//				vhost			: '/',
//				queueName	: 'test.ppomppuFailQ'
//			}
//	);
//	console.log( queue.messages );

//	let index = 5;
//	while( index > 0 ){
//		await test111(index);
//		index--;
//		console.log(index);
//	}
}

function test111( input ){
	setTimeout(
			()=>{
				console.log( 'play ' + input );
			}
	,'1000');
}


/**
 * RabbitMQ Push 테스트
 */
async function testPublish(){
	
//	var testArr = '11111';

	let testArr = new Array();
	
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=1'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=2'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=3'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=4'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=1'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=2'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=3'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=4'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=1'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=2'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=3'});
	testArr.push({'routingKey' : 'ppomppu', 'message' : 'http://m.ppomppu.co.kr/new/search_result.php?search_type=sub_memo&bbs_cate=1&page_size=20&keyword=ssg&page_no=4'});
	
	
	//	rabbitmq.pushMessage('test', '2', testArr)
		
//	for ( var i = 0; i <= 100; i++ ){
//		await rabbitmq.pushMessage( 'test.site.topic' , testArr); 

		let successCnt = 0;
	
		let result = await rabbitmq.pushMessage(  'test.site.topic' , testArr);
		successCnt += result.successCnt;
		
		const resultLog	=	{
				'targetPageCnt'		: testArr.length,
				'pushSuccessCnt' 	: successCnt,
		}
		
		logger.info('[Publisher] Main : ' + 'target : ' + resultLog.targetPageCnt + ' success : ' + resultLog.pushSuccessCnt);
		
//	}
	
	
	

}
 

/**
 * RabbitMQ Receive 테스트 (성공)
 */
function testNewConsumer1(){
	
	rabbitmq.openChannel()
	.then( (channel)=> {
		rabbitmq.getMessage(
				channel,
				config.sites[0].data.queueName,
				(msg) => {
					let body = msg.content.toString();
					
					
					logger.info("testNewConsumer1 Received '" + body);
					delay(1).then(()=>{
						logger.info("testNewConsumer11 Received '" + body);
						rabbitmq.ack(channel, msg);						
					})

				}
		)
	})
}

/**
 * RabbitMQ Receive 테스트 (성공)
 */
function testNewConsumer2(){
	
	rabbitmq.openChannel()
	.then( (channel)=> {
		rabbitmq.getMessage(
				channel,
				config.sites.ppompu.queueName,
				(msg) => {
					let body = msg.content.toString();
					logger.info("testNewConsumer2 Received '" + body);
					
					rabbitmq.ack(channel, msg);
				}
		)
	})
}


/**
 * RabbitMQ Receive 테스트 (성공)
 */
function testNewConsumer3(){
	
	rabbitmq.openChannel()
	.then( (channel)=> {
		rabbitmq.getMessage(
				channel,
				config.sites.ppompu.queueName,
				(msg) => {
					let body = msg.content.toString();
					logger.info("testNewConsumer3 Received '" + body);
					
					rabbitmq.ack(channel, msg);
				}
		)
	})
}

/**
 * RabbitMQ Receive 테스트 (실패)
 */
function testFailConsumer(){
	
	rabbitmq.openChannel()
	.then( (channel)=> {
		rabbitmq.getMessage(
				channel,
				config.sites.ppompu.queueName,
				function(msg){
					let body = msg.content.toString();
					logger.info("testNewConsumer3 Received '" + body);
					
					rabbitmq.reSendMessage( channel, config.failExchageNameSite, config.sites.ppompu.routingKey, msg);
				}
		)
	})
		
}

function makeExchange(){
	rabbitmq.makeExchange();
}



/**
 * async 테스트
 */ 
async function asyncTest(){
	
	await noti.smsSend('151535','test');
	await getConfig();
	
}

function noAsyncTest(){
	noti.smsSend('151535','test');
	getConfig();	
}


/**
 * Config 
 */
function getConfig(){
	
//	logger.info(config);
	
	logger.info( config.exchageNameSite );
	logger.info( config.failExchageNameSite );
	
}


/**
 * Path Test
 */
function getFileName(){
	logger.info(__filename);
	logger.info(path.basename(__filename));
}

/**
 * LOG Test
 */
function testLog(){
	

//	console.log( 'test' );
	
	logger.info('한글테스트');
	logger.error('test22222222222');
	noti.smsSend('151535','test').then( (a)=> { logger.info( '11 >' +  a);} )
	
//	logger.info( JSON.stringify( noti.smsSend('151535','test') ) );
}
 

/**
 * SMS 전송 테스트
 */
function testSms(){
	noti.smsSend('151535','test');
}

/**
 * Telegram 전송 테스트
 */
async function testTgram(){
	console.log(await noti.tgramSend('devCrawlerBotGroup','test'));
}



/**
 * Promise Test
 */
function delayCB(item) { 
	setTimeout(() => { logger.info(item)  }, 3000);
//	return new Promise(resolve => setTimeout(() => { logger.info(item); resolve(); }, 3000) ); 
} 


/**
 * Promise Test
 */
function delay(item) { 
//	setTimeout(() => { logger.info(item);  }, 30000);
	return new Promise(resolve => setTimeout(() => { logger.info(item); resolve(); }, 300000) ); 
} 

async function basic() { 
	await delay(1); logger.info("Done"); 
	return "basic"; 
}
