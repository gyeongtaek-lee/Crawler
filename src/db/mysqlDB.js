/**
 *  mongo DB connection module
 * */

const { logger }	= require('../log');

let global 			= require('./GlobalVariable');

function MysqlDB(){
	
	this.config = require('../config');
	
	this.mysql = require('mysql');
	
	this.db_info = {
	    host: 'localhost',
	    port: '3306',
	    user: 'user_name',
	    password: 'password',
	    database: 'db_name'
	}
	
}

MysqlDB.prototype.init = async function() {
	
	return this.mysql.createConnection(this.db_info);
	
}

MysqlDB.prototype.connect = async function(conn) {
	
	 conn.connect(function(err) {
		 
         if(err) console.error('mysql connection error : ' + err);
         else console.log('mysql is connected successfully!');
         
     });
	
}

MysqlDB.prototype.disconnect = async function(conn) {
	
	 conn.end(function(err) {
		 
        if(err) console.error('mysql disconnection error : ' + err);
        else console.log('mysql is disconnected successfully!');
        
    });
	
}

module.exports = MysqlDB;
