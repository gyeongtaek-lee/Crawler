/**
 *  naver shopping low price Schema definition module
 * */
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	
	site: { type: String, required: true },						// 사이트
	modelNm: { type: String, required: true },					// 모델명
	itemNm: { type: String, required: true },					// 상품명
	lgeItemPrc: { type: Number, required: true, default: 0 },	// LGE 상품가격
	itemPrc: { type: Number, required: true, default: 0 },		// 상품가격
	category1: String,											// 카테고리1(대)
	category2: String,											// 카테고리2(증)
	category3: String,											// 카테고리3(소)
	category4: String,											// 카테고리4(세)
	itemImg: String,											// 상품이미지
	itemDesc: [String], 										// 상품 기타 정보
	itemEvent: String,											// 상품관련 이벤트
	reviewPnt: String,											// 리뷰점수
	reviewCnt: { type: Number, default: 0 },					// 리뷰건수
	buyCnt: { type: Number, default: 0 },						// 구매건수
	keepCnt: { type: Number, default: 0 },						// 찜건수
	createDt: String,											// 등록일자
	regDate:{
	    type:Date,
	    default:Date.now
	   }
  
});

//Enable beautifying on this schema
productSchema.plugin(beautifyUnique);

productSchema.index({ site: 1, modelNm: 1 });

module.exports = mongoose.model('Price', productSchema);