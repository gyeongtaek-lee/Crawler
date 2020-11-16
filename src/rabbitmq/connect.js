const amqp = require('amqplib');
const { logger } = require('../log');
const config = require('../config');

let connect = module.exports = {};

// rabbitmq connection 을 연결한다.
connect.openConnection = ( option ) => {
	
	return new Promise( (resolve, reject) => {

		logger.info('[connect.js] start openConnection');
		
		let connectUrl;
		if ( option != null && option.rabbitmqConfig != null ){
			let rabbitmqConfig = option.rabbitmqConfig;
			connectUrl = 'amqp://' + rabbitmqConfig.username + ':' + rabbitmqConfig.password + '@' + rabbitmqConfig.host + ':' + rabbitmqConfig.port  + rabbitmqConfig.vhost;
		} else {
			connectUrl = 'amqp://' + config.rabbitmq.username + ':' + config.rabbitmq.password + '@' + config.rabbitmq.host + ':' + config.rabbitmq.port  + config.rabbitmq.vhost;
		}
		
		logger.debug('[connect.js] rabbitmq connectUrl > ' + connectUrl);
		
		amqp.connect(connectUrl + "?heartbeat=60")
		.then(
			(connection) => {
				
				// 1. 접속 후 오류 발생 시 
				connection.on("error", (err) => {
					if (err.message !== "Connection closing") {
						logger.error("[connect.js] connection error" + err.message);
					}
			    });
			    
				if ( option != null && option.autoRetry === true ){
				
					// 2. 접속 후 종료 발생 시 
					connection.on("close", () => {
						// TODO : 문자 전송 로직 추가
						logger.info("[connect.js] connection reconnecting");
						return setTimeout(connect.openConnection(), 1000);
				    });
					
				}
				
				logger.info('[connect.js] success connect....');
				
				resolve(connection);
				
			}	
			
		)
		.catch(
			(err) => {
				logger.error( '[connect.js] openConnection error > ' + err );
				reject( err );
			}
		)	
		;
		
		logger.info('[connect.js] end openConnection');
	
	})
};

//rabbitmq channel을 오픈한다.
connect.openChannel = ( connection ) => {
	
	return new Promise( (resolve, reject) => {

		logger.info('[connect.js] start openChannel');
		
		connection.createConfirmChannel().then(
			(channel) => {

				// 1. 채널을 저장한다.
				connect.channel = channel;

				// 2. 접속 후 오류 발생 시 
				channel.on("error", (err) => {
					logger.error("[connect.js] channel error" + err.message);
			    });
			    
				// 3. 접속 후 종료 발생 시 
				channel.on("close", () => {
					logger.info("[connect.js] channel close");
			    });
				
				logger.info('[connect.js] success channel....');
				
				resolve( channel );
				
			}
		)
		.catch(
			(err) => {
				logger.error( '[connect.js] openChannel error > ' + err );
				reject( err );
			}
		)	
		;		
	
		logger.info('[connect.js] end openChannel');
	
	})
};