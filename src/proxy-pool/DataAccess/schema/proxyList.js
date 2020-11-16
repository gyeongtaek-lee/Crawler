/**
 *  proxy list Schema definition module
 * */

const mongoose = require('mongoose');

const proxyListSchema = new mongoose.Schema({
	
	processId: String,				// PID (process id)
	site: String,						// 크롤링 사이트
	address: String,					// PROXY IP
	latency: Number,				// 지연시간
	useYn: String,					// 사용가능여부
	maxLastUsedTime: Number,	// 마지막 사용 시간
	activeYn: String,					// 활성화여부 
	regDate:{
	    type:Date,
	    default:Date.now
	   }
  
});

module.exports = mongoose.model('ProxyList', proxyListSchema);