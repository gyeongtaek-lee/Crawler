const ppomppu		= require('./ppomppu.js');

const smsSender = module.exports = {};

smsSender.sendSms = async (siteName) => {
	
	return eval(siteName + '.sendSms();');
}