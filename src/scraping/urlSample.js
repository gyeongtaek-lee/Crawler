const moment 	= require('moment');
const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

const config		= require('../config');

const util = require('../util');

//console.log(Math.round(Date.now() / 60000));
	
console.log(util.utils.minute());


//(async () => {
//
//	for(let i = 1; i<= 50; i++) {
//		
//		console.log(`https://search.shopping.naver.com/search/all.nhn?origQuery=래핑차일드&pagingIndex=${i}&pagingSize=80&viewType=list&sort=rel&frm=NVBT100&query=래핑차일드`);
//		console.log(`https://search.shopping.naver.com/search/all.nhn?origQuery=키즈경량패딩&pagingIndex=${i}&pagingSize=80&viewType=list&sort=rel&frm=NVBT100&query=키즈경량패딩`);
//		console.log(`https://search.shopping.naver.com/search/all.nhn?origQuery=노트북&pagingIndex=${i}&pagingSize=80&viewType=list&sort=rel&frm=NVBT100&query=노트북`);
//		console.log(`https://search.shopping.naver.com/search/all.nhn?origQuery=공기청정기&pagingIndex=${i}&pagingSize=80&viewType=list&sort=rel&frm=NVBT100&query=공기청정기`);
//		
//	}
//	
//});

const currentDate = moment().add('0', 'd').format('YYYYMMDD');

console.log(currentDate);

console.log(puppeteer);

console.log(proxyChain);

const array = ["-렌탈", "-대여", "-충전", "-거치대", "-전시", "-중고", "-해외", "-임직원"];

console.log(array.join(" "));

const exptWords = config.expt_word.word.join(" ");

console.log(exptWords);