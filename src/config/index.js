/**
 * http://usejsdoc.org/
 */
const _ = require('lodash');

const env = process.env.NODE_ENV || 'local';

const defaults 		= require('../../config/config_default.json');
const config 			= require(`../../config/config_${env}.json`);
const board_info 	= require(`../../config/board_info.json`);


module.exports = _.merge({}, _.merge({}, defaults, config), board_info);