const rabbitmqManager = require('./management');
const { logger } = require('../log');

let manager = module.exports = {};

/**
 * rabbitmq management api에 호출을 위해 client 생성을 한다. (로그인)
 * @ref : https://github.com/cosmincav/node-rabbitmq-manager
 */
manager.openConnection = ( pHost, pPort, pUseId, pPassword )=>{
	
	return new Promise( (resolve, reject) => {
	
		logger.info('[manager.js] openConnection start ');
		
		try {
			
			client = rabbitmqManager.client({
				host 			: pHost,
			 	port 			: pPort,
			 	timeout 		: 25000,
			 	user			: pUseId,
			 	password 	: pPassword
			});
			logger.info('[manager.js] openConnection success ');
			resolve(client);
			
		} catch (err) {
			logger.error( '[manager.js] openConnection error => ' + JSON.stringify(err) );
			reject(err);
		}
		
	});
	
}	

/**
 * rabbitmq management api를 호출하여 queue 정보를 가져온다.
 * @ref : https://github.com/cosmincav/node-rabbitmq-manager
 */
manager.getQueue = ( client, vhostName, queueName )=>{
	
	return new Promise( (resolve, reject) => {
		
		logger.info('[manager.js] getQueue start');
		
		client.getQueue(
				{
					vhost : vhostName,
					queue : queueName
				}, function (err, res) {
					if (err) {
						logger.error( '[manager.js] getQueue error => ' + JSON.stringify(err) );
						reject(err);
					}else{
						logger.info('[manager.js] getQueue success');
						resolve(res);
					}
				}
		);
	});
	
}

/**
 * rabbitmq management api를 호출하여 queue 정보를 가져온다.
 * @ref : https://github.com/cosmincav/node-rabbitmq-manager
 */
manager.moveQueue = ( client, vhostName, queueName, destQueuName )=>{
	
	return new Promise( (resolve, reject) => {
		
		logger.info('[manager.js] getQueue start');
		
		client.moveQueue(
				{
					vhost 			: vhostName,
					srcQueue 	: queueName,
					destQueue 	: destQueuName 
				}, function (err, res) {
					if (err) {
						logger.error( '[manager.js] getQueue error => ' + JSON.stringify(err) );
						reject(err);
					} else {
						logger.info('[manager.js] getQueue success');
						resolve(res);
					}
				}		
		);
	});
	
}

/**
 * rabbitmq management api를 호출하여 queue 정보를 가져온다.
 * @ref : https://github.com/cosmincav/node-rabbitmq-manager
 */
manager.deleteShovel = ( client, vhostName, queueName, destQueuName )=>{
	
	return new Promise( (resolve, reject) => {
		
		logger.info('[manager.js] getQueue start');
		
		client.deleteShovel(
				{
					vhost 			: vhostName,
					srcQueue 	: queueName,
					destQueue 	: destQueuName 
				}, function (err, res) {
					if (err) {
						logger.error( '[manager.js] getQueue error => ' + JSON.stringify(err) );
						reject(err);
					} else {
						logger.info('[manager.js] getQueue success');
						resolve(res);
					}
				}		
		);
	});
	
}


manager.searchQueue = ( config ) => {
	
	return new Promise( (resolve, reject) => {

		// 1. api 접속한다.
		manager.openConnection( config.host, config.port, config.userId, config.password )
		.then( (client)=>{
			
			// 2. queue 정보를 가져온다.
			manager.getQueue( client, config.vhost, config.queueName )
			.then( (queue)=>{
				resolve(queue);
			})
			.catch( (err)=>{
				reject(err);	
			});
			
		})
		.catch( (err)=>{
			reject(err);
		});
			
	});
	
}