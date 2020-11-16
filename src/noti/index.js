const noti = module.exports = {};

const notiSms = require('./notiSms.js');
noti.smsSend = notiSms.send;

const notiTgram = require('./notiTgram.js');
noti.tgramSend = notiTgram.send;