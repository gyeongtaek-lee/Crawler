/**
 *  ppomppu Board Schema definition module
 * */

const mongoose = require('mongoose');

const ppomppuBoardSchema = new mongoose.Schema({
	
	boardId: String,			// 게시글 id
	boardType: String,		// 게시판 유형
	title: String,				// 게시글 제목
	url: String,					// 게시글 url
	createDate: String,		// 게시글 생성일자 
	searchCnt: Number,	// 게시글 조회 수
	recCnt: Number, 		// 게시글 댓글 수
	sendMsg: Boolean,	// 메세지 전송 여부
	regDate:{
	    type:Date,
	    default:Date.now
	   }
  
});

ppomppuBoardSchema.index({ boardId: 1, boardType: 1 });

module.exports = mongoose.model('Ppomppuboard', ppomppuBoardSchema);