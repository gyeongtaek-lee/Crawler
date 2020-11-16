/**
 * Crawling Abstract Class
 */

class Crawler {
	
	constructor(options) {
		
		this._name 	= options.name;
		this._cluster	= options.cluster;
		
	}
	
	get name() {
		
		return this._name;
		
	}
	
	set name(newName) {
		
		this._name;
		
	}
	
	get cluster() {
		
		return this._cluster;
		
	}
	
	set cluster(newCluster) {
		
		this._cluster = newCluster;
		
	}
	
	// Abstract 크롤링 처리 method
	async processCrawling(page, data) {
		
		throw new Error('processCrawling() must be implement.');
		
	}
	
}

module.exports = Crawler;