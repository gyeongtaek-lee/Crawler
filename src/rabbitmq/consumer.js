const connect = require('./connect.js');
const { logger } = require('../log');
const config = require('../config');

const consumer = module.exports = {};

consumer.openChannel = ( options ) =>{

	return new Promise( (resolve, reject) => {
		
		let connectOptions;
		if ( options != null ){
			connectOptions = options;
			connectOptions.autoRetry = true;
		}else{
			connectOptions = {
				autoRetry : true
			};
		}
		
		connect.openConnection(options)
		.then( (connection) => {
			// 2. Channel을 오픈한다.
			connect.openChannel(connection)
			.then( (channel) => {
				this.connectChannel = channel;
				resolve( this.connectChannel );
			})
			.catch( (err) => {
				logger.error( err );
			})
		})
		.catch( (err) => {
			logger.error( err );
		})
	});
}


consumer.getMessage = ( channel, queueName, work, fetchCount, options ) => {
	
	if ( fetchCount == null ){
		fetchCount = config.rabbitmq.fetchCount;
	}
	
	channel.prefetch(fetchCount);
	
	logger.info('[consumer.js] start');
	
	if ( typeof work !== 'function' ){
		throw new Error('Parameters can only be function');
	}
	
	channel.consume( queueName, work, {noAck: false} );	
};

/**
 * 전송 완료 메시지를 보낸다.
 * 
 * msg 				: work function에 전달받은 msg Parameter
 */
consumer.ack = ( channel, msg ) => {
	channel.ack(msg);
}

/**
 * 전송 실패 메시지를 보낸다.
 * 
 * msg 				: work function에 전달받은 msg Parameter
 */
consumer.noack = ( channel, msg ) => {
	channel.nack(msg);
}	


/**
 * 전송 실패 시 다른 exchange로 메시지를 보낸다.
 * 
 * exchange 			: rabbitMQ exchange Name (String)
 * routingKey 		: rabbitMQ exchange routingKey  (String)	
 * msg 				: work function에 전달받은 msg Parameter
 */
consumer.reSendMessage = ( channel, exchange, routingKey, msg ) => {
	channel.assertExchange( exchange, 'topic', {durable: true}).then(
		(param) => {
			channel.publish( exchange, routingKey, Buffer.from(msg.content.toString()), {persistent:true}, reSendCallback(channel,msg) );
		}
	)
}

function reSendCallback(channel,msg) {
	return (err) => {
	    if (err !== null) { 
	    	channel.nack(msg);
	    } else {
	    	channel.ack(msg);
	    }
	};
}
