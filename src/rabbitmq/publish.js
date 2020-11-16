const connect = require('./connect.js');
const { logger } = require('../log');

let publish = module.exports = {};

let failMessages;
let successCnt;

/**
 * 메시지 전송을 한다.
 * 
 * exchange 			: rabbitMQ exchange Name (String)
 * messages 			: rabbitMQ push Message  (Object or Array) {routingKey:'key', message:'message'}
 * options 			: rabbitMQ connect info
 */
publish.pushMessage_bak = ( exchange, messages, options ) => {
	
	successCnt = 0;
	failMessages = new Array();
	
	return new Promise( (resolve, reject) => {
		
		logger.info('[publish.js] start');
		
		// 1. Connection을 오픈한다.
		connect.openConnection(options)
		.then( (connection) => {
			
			// 2. Channel을 오픈한다.
			connect.openChannel(connection)
			.then( (channel) => {
				
				logger.debug('[publish.js] exchange > ' + exchange);
				
				// 2. Exchange가 존재하지 않으면 생성한다.
				channel.assertExchange( exchange, 'topic', {durable: true})
				.then( () => {
					
					logger.info('[publish.js] start message');
					
					// 메시지 전송
					if ( Array.isArray( messages )  ){
						// Array 일 경우
						for ( let i in messages ){
							logger.debug('[publish.js] messgae > ' + messages[i]);
							if ( messages[i].routingKey == null || messages[i].message == null ){
								failMessages.push( message )	;
							}else{
								channel.publish( exchange, messages[i].routingKey, Buffer.from(messages[i].message), {persistent:true}, sendCallback(messages[i]) );
							}
						}
					} else {
						logger.debug('[publish.js] messgae > ' + messages);
						if ( messages.routingKey == null || messages.message == null){
							failMessages.push( message )	;
						}else{
							channel.publish( exchange, messages.routingKey, Buffer.from(messages.message), {persistent:true}, sendCallback(messages) );
						}
					}
					
					channel.waitForConfirms()
					.then( () => {
						
						logger.info('[publish.js] All messages done');
						logger.info('[publish.js] successCnt => ' + successCnt);
						logger.info('[publish.js] failMessages => ' + failMessages);
						
						let result = {
							'successCnt' : successCnt,
							'failMessages' : failMessages
						}
						
						resolve(result);
						
					}).catch( (err) => {
						logger.error( '[publish.js] waitForConfirms error > ' + err );
						reject(err);
					})		

				}).catch((err) => {
					logger.error( '[publish.js] assertExchange error > ' + err );
					reject(err);
				})
				
			})
		})

	});
};


publish.pushMessage = async ( exchange, messages, options ) => {
	
	successCnt = 0;
	failMessages = new Array();
	
	logger.info('[publish.js] start');
		
	const connection = await connect.openConnection(options);
	const channel = await connect.openChannel(connection);
	
	logger.debug('[publish.js] exchange > ' + exchange);
	
	// 2. Exchange가 존재하지 않으면 생성한다.
	await channel.assertExchange( exchange, 'topic', {durable: true});
		
	logger.info('[publish.js] start message');
		
	// 메시지 전송
	if ( Array.isArray( messages )  ){
		// Array 일 경우
		for ( let i in messages ){
			logger.debug('[publish.js] messgae > ' + messages[i]);
			if ( messages[i].routingKey == null || messages[i].message == null ){
				failMessages.push( message )	;
			}else{
				channel.publish( exchange, messages[i].routingKey, Buffer.from(messages[i].message), {persistent:true}, sendCallback(messages[i]) );
			}
		}
	} else {
		logger.debug('[publish.js] messgae > ' + messages);
		if ( messages.routingKey == null || messages.message == null){
			failMessages.push( message )	;
		}else{
			channel.publish( exchange, messages.routingKey, Buffer.from(messages.message), {persistent:true}, sendCallback(messages) );
		}
	}
		
	await channel.waitForConfirms();
			
	logger.info('[publish.js] All messages done');
	logger.info('[publish.js] successCnt => ' + successCnt);
	logger.info('[publish.js] failMessages => ' + failMessages);
	
	let result = {
		'successCnt' : successCnt,
		'failMessages' : failMessages
	}
		
	return result;
	
};

function sendCallback( message ) {
	return (err) => {
	    if (err !== null) { 
	    	logger.error( '[publish.js] send failure message > ' +  JSON.stringify(message) );
	    	failMessages.push( message )	;
	    } else {
	    	logger.info( '[publish.js] send success message > ' +  JSON.stringify(message) );
	    	successCnt++;
	    }
	};
}

