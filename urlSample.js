const moment 	= require('moment');
	
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