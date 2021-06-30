/**
 * test connect MongoDB
 */
const { logger }	= require('../log');

// mysqlDB db connection module
const MysqlDB	 	= require('./mysqlDB');


(async () => {
	
	try {
		
		/*var MongoClient = require('mongodb').MongoClient;
		var uri = "mongodb://leegt80:oracle2806!@cluster0-shard-00-00.jn4nh.mongodb.net:27017,cluster0-shard-00-01.jn4nh.mongodb.net:27017,cluster0-shard-00-02.jn4nh.mongodb.net:27017/sample_airbnb?ssl=true&replicaSet=atlas-futvuw-shard-0&authSource=admin&retryWrites=true&w=majority";
		MongoClient.connect(uri, function(err, client) {
			
//			console.log(client);
			
		  const collection = client.db("sample_airbnb").collection("listingsAndReviews");
		  // perform actions on the collection object
		  
		  collection.count({}, function(error, numOfDocs) {
			    console.log('I have '+numOfDocs+' documents in my collection');
			    // ..
			});
		  
		  client.close();
		});*/
		
		console.log(`=================${process.pid}================`);
		
		const mysqlDB = new MysqlDB();
		
		const conn = await mysqlDB.init();
		
		// DB 연결
		await mysqlDB.connect(conn);
		
		const sql = 'SELECT 1 FROM BOARD';
		
		conn.query(sql, function (err, rows, fields) {
	        if(err) console.log('query is not excuted. select fail...\n' + err);
	        else console.log(rows);
	    });
		
		
//		['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'].forEach(signal => process.on(signal, async() => {
//			
//			// DB 연결 해제
//			mongoDB.disconnect();
//			
//			process.exit(0);
//			
//		}));
//		
//		process.on('exit', function() {
//			
//			// DB 연결 해제
//			mongoDB.disconnect();
//			
//			console.log('=================End================');
//			
//		});
	
	} catch (e) {
        
    	logger.error(`[consumer] ${e}`);
    	
    }
	
})()