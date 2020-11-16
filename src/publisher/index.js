const ppomppu		= require('./ppomppu.js');
const naver 		= require('./naver.js');

const pageScrap = module.exports = {};

pageScrap.excutePageScrap = async (siteName) => {
	
	return eval(siteName + '.getPageURLs();');
}