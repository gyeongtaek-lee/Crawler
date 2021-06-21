/**
 *  mongo DB connection module
 * */

const { logger }	= require('../log');

let global 			= require('./GlobalVariable');

function MongoDB(){
	
	this.config = require('../config');
	
	this.mongoose = require('mongoose');
	
	this.mongoose.set('useCreateIndex', true)
	
	this.mongoose.connection.once('open', () => {
		
		logger.info('mongodb connection OK.');
		
		global.isConnected = true;
		
	});
	
	this.mongoose.connection.on('error', () => {
		
		logger.info('mongodb connection Failed!');
		
		global.isConnected = false;
	    
	});
	
	this.mongoose.connection.on('disconnected', () => {
		
		logger.info('mongodb disconnected OK.');
		
		global.isConnected = false;
		
//		this.connect();
		
	});
	
}

MongoDB.prototype.connect = async function() {
	
	console.log(`mongodb://${this.config.mongodb.username}:${this.config.mongodb.password}@${this.config.mongodb.host}`);
	console.log(this.config.mongodb.database);
	
	// mongoose.connect('mongodb://아이디:비밀번호@주소:포트/admin', { dbName: '데이터베이스' }, function(err) {});
//	const db = await this.mongoose.connect(`mongodb://${this.config.mongodb.username}:${this.config.mongodb.password}@${this.config.mongodb.host}`, { dbName: this.config.mongodb.database }, function(err) {
//	const db = await this.mongoose.connect(`mongodb://${this.config.mongodb.host}`, { dbName: this.config.mongodb.database }, function(err) {
	
	const db = await this.mongoose.connect("mongodb://leegt80:oracle2806!@cluster0-shard-00-00.jn4nh.mongodb.net:27017,cluster0-shard-00-01.jn4nh.mongodb.net:27017,cluster0-shard-00-02.jn4nh.mongodb.net:27017/test?ssl=true&replicaSet=atlas-futvuw-shard-0&authSource=admin&retryWrites=true&w=majority"
			, { useNewUrlParser: true, useUnifiedTopology: true }
			, function(err) {
		
		if (err) {
			
			logger.error('mongodb connection error : ', err);
			
		}
		
	});
	
	return db;
	
};


MongoDB.prototype.disconnect = async function() {
	
	await this.mongoose.disconnect();
	
};

MongoDB.prototype.remove = async function() {
	
	await this.mongoose.connection.removeAllListeners();
	
};

module.exports = MongoDB;
