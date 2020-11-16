const publish = require('./publish.js');
const consumer = require('./consumer.js');
const make = require('./make.js');
const manager = require('./manager.js');

const rabbitmq = module.exports = {};
rabbitmq.pushMessage = publish.pushMessage;

rabbitmq.openChannel = consumer.openChannel;
rabbitmq.getMessage = consumer.getMessage;
rabbitmq.ack = consumer.ack;
rabbitmq.noack = consumer.noack;
rabbitmq.reSendMessage = consumer.reSendMessage

rabbitmq.makeExchange = make.makeExchange;

rabbitmq.searchQueue = manager.searchQueue;
rabbitmq.openApiConnection = manager.openConnection;
rabbitmq.getQueue = manager.getQueue;
rabbitmq.moveQueue = manager.moveQueue;
rabbitmq.deleteShovel = manager.deleteShovel;
