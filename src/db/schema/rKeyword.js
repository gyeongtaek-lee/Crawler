/**
 *  Naver shopping Related Keyword Schema definition module
 * */

const mongoose = require('mongoose');

const rKeywordSchema = new mongoose.Schema({
	
	site: { type: String, required: true },				// 사이트
	tgtKeyword: { type: String, required: true },	// 검색어
	category: String,											// 카테고리 경로
	rKeyword: [String], 									// 연관검색어
	createDt: String											// 등록일자
});

rKeywordSchema.index({ site: 1, tgtKeyWord: 1, createDt:1 });

module.exports = mongoose.model('RKeyword', rKeywordSchema);