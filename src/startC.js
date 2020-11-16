/**
 * Consumer Start APP
 */
const { logger } 	= require('./log');

// configuration file
const config			= require('./config');

// mongo db connection module
const MongoDB	 	= require('./db/mongoDB');

// job is crawler module
const JobCrawler	= require('./consumer/jobCrawler');

//const cron = require('node-cron');

const events = require('events');

//const heapdump = require('heapdump');


(async () => {
	
	try {
		
	//	cron.schedule('*/1 * * * *', function(){
	//		
	//		console.log('making memory leak. Current memory usage :'+(process.memoryUsage().rss / 1024 / 1024) + 'MB');
	//		
	//	});
		
	//	cron.schedule('*/1 * * * *', function(){
	//		
	//		var filename = '/Users/terry/heapdump' + Date.now() + '.heapsnapshot';
	//
	//	    heapdump.writeSnapshot(filename);
	//
	//	    console.log('Heapdump has been generated in '+filename);
	//
	//		
	//	});
		
		console.log(`=================${process.pid}================`);
		
		const mongoDB = new MongoDB();
		
		// DB 연결
		await mongoDB.connect();
		
		// 프록시 
		
		
		// 크롤링 실행.
		const job = await JobCrawler.launch({name:'crawling job'});
		
		console.log('=================Start================');
		
		const sites = config.sites;
		
		sites.forEach(async(s) => {
			
			await job.work(s);
			
		});
		
		['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'].forEach(signal => process.on(signal, async() => {
			
			// DB 연결 해제
			mongoDB.disconnect();
			
			process.exit(0);
			
		}));
		
		process.on('exit', function() {
			
			// DB 연결 해제
			mongoDB.disconnect();
			
			console.log('=================End================');
			
		});
	
	} catch (e) {
        
    	logger.error(`[consumer] ${e}`);
    	
    }
	
})()