const connect = require('./connect.js');
const { logger } = require('../log');
const config = require('../config');

let make = module.exports = {};

make.makeExchange = () => {

	// 1. Connection을 오픈한다.
	connect.openConnection()
	.then( (connection) => {
		// 2. Channel을 오픈한다.
		connect.openChannel(connection)
		.then( async (channel) => {

			await channel.assertExchange( config.failExchageNameSite, 'topic', {durable: true});
			await channel.assertExchange( config.exchageNameSite, 'topic', {durable: true} );
			
			for ( var i = 0; i < 3; i++ ){
			
				await channel.assertQueue( config.sites[i].data.queueName , {durable: true} );
				await channel.bindQueue( config.sites[i].data.queueName, config.exchageNameSite, config.sites[i].data.routingKey );

				await channel.assertQueue( config.sites[i].data.failQueueName , {durable: true} );
				await channel.bindQueue( config.sites[i].data.failQueueName, config.failExchageNameSite, config.sites[i].data.routingKey );
				
			}
			 
			connection.close();

		});	
		
	}).catch ( (err) => {
		logger.error( err.message );
	})
}
