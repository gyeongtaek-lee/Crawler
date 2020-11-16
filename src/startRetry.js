const rabbitmq = require('./rabbitmq');
const { logger } = require('./log');
const config = require('./config');
const noti = require('./noti');
const env = process.env.NODE_ENV || 'dev';

(async () => {
			
	let client = await rabbitmq.openApiConnection(
			config.rabbitmq.host,
			config.rabbitmq.manageport,
			config.rabbitmq.username,
			config.rabbitmq.password
	);

	const vhost = config.rabbitmq.vhost;
	
	for ( var site of config.sites ){
		
		// 1. 실패 Queue 정보를 가져온다.
		let beforeQueue = await rabbitmq.getQueue(
				client,
				vhost,
				site.data.failQueueName
		)
		.catch( (err) =>{
			logger.error('[startRetry.js] error failQueue.getQueue ['+site.data.failQueueName+'] => ' + JSON.stringify(err));
		});		
	
		let beforeQueueCount = beforeQueue.messages;
		logger.info ( '[startRetry.js] beforeQueueCount ['+site.data.failQueueName+'] => ' + beforeQueueCount );
		
		
		// 2. 실패 Queue > 기존 Queue로 데이터를 이관한다.
		await rabbitmq.moveQueue(
				client,
				vhost,
				site.data.failQueueName,
				site.data.queueName
		)
		.catch( (err) =>{
			logger.error('[startRetry.js] error moveQueue ['+site.data.failQueueName+'] => ' + JSON.stringify(err));
		});		
	
		await sleep(5000);
		
		// 3. 실패 Queue 정보를 다시 가져온다. 
		let tobeQueue = await rabbitmq.getQueue(
				client,
				vhost,
				site.data.failQueueName
		)
		.catch( (err) =>{
			logger.error('[startRetry.js] error tobeQueue.getQueue ['+site.data.failQueueName+'] => ' + JSON.stringify(err));
		});		
	
		let tobeQueueCount = tobeQueue.messages;
		logger.info ( '[startRetry.js] tobeQueueCount ['+site.data.failQueueName+'] => ' + tobeQueueCount );
		
		if ( tobeQueueCount != 0 ){
			await noti.smsSend('151535','큐 이관 실패 [name=>'+site.data.failQueueName+',count=>' + tobeQueueCount +']');
		}
		
		if ( env === 'local' ){
			// TODO : 추후 버전을 동기화 시킨다.
			// dev (http://10.203.7.214:12672/)  : rabbitmq 3.8.0
			// local (http://10.203.7.214:15672/) : rabbitmq 3.6.0
			// 4. 이관에 사용했던 Shovel을 삭제 처리 한다.
			if ( beforeQueueCount == 0 ){
				await rabbitmq.deleteShovel(
						client,
						vhost,
						site.data.failQueueName,
						site.data.queueName
				)
				.catch( (err) =>{
					logger.error('[startRetry.js] error deleteShovel ['+site.data.failQueueName+'] => ' + JSON.stringify(err));
				});
			}
		}
	
	}
	
})();

sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}