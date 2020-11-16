/**
 * http://usejsdoc.org/
 */
const cron = require('node-cron');

(async () => {
	
	cron.schedule('*/1 * * * *', function(){
		
		console.log(new Date());
		
	});
	
})();