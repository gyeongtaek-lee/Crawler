/**
 * Crawling Factory Class
 */
const abstractCrawlerFactory = (function() {
	
	let jobs = {};
	
	return {
		addJob: function(job, Crawler) {
			
			// getCrawling 메소드가 있어야만 등록 가능
			if (Crawler.prototype.processCrawling) { 
				
				jobs[job] = Crawler;
				
			}
		},
		// 등록한 직업을 바탕으로 실제 객체 생성
		create: function(job, options) { 
			
			let Crawler = jobs[job];
			
			return (Crawler ? new Crawler(options) : null);
			
		}
	};
	
})();

module.exports = abstractCrawlerFactory;
