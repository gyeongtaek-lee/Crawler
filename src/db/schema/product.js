/**
 *  ppomppu Board Schema definition module
 * */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	
	site: { type: String, required: true },							// 사이트
	itemNo: { type: String, required: true },					// 상품번호
	itemNm: { type: String, required: true, index: true },	// 상품명
	itemPrc: { type: Number, required: true, default: 0 },// 상품가격
	prcReloadDt: String,												// 상품가격변경일자
	category: String,														// 카테고리 경로 
	itemImg: String,														// 상품이미지
	itemDesc: [String], 												// 상품 기타 정보
	itemEvent: String,													// 상품관련 이벤트
	reviewPnt: String,													// 리뷰점수
	reviewCnt: { type: Number, default: 0 },					// 리뷰건수
	buyCnt: { type: Number, default: 0 },						// 구매건수
	keepCnt: { type: Number, default: 0 },						// 찜건수
	createDt: String,														// 상품등록일자
	regDate:{
	    type:Date,
	    default:Date.now
	   }
  
});

productSchema.index({ site: 1, itemNo: 1 });

module.exports = mongoose.model('Product', productSchema);