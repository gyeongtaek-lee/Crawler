const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
//const { configuredFormatter } = require('winston-json-formatter');
const moment = require('moment');
const config = require('../config');

// 한국 시간 사용을 위해서 다음과 같이 처리한다.
require('moment-timezone');				  
moment.tz.setDefault("Asia/Seoul");

// 로그를 저장하기 위한 경로
const logBaseDir = config.logBaseDir;
const logLevelFile = config.logLevel.file;
const logLevelConsole = config.logLevel.console;

const pm_id = process.env.pm_id || '0';			// pm으로 시작할 경우 pm_id를 가져온다.

const log = module.exports = {};

log.logger = winston.createLogger({
    format: winston.format.combine(
    		winston.format.timestamp({
    	      format: "YYYY-MM-DD HH:mm:ss:SSS"
    	    }),
    	    winston.format.json()
    	  ),	
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            filename: `${logBaseDir}/info_${pm_id}_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: logLevelFile,
            showLevel: true,
            json: false,
            timestamp: timeStampFormat,
            format: winston.format.combine(
            		winston.format.colorize(),
            		winston.format.printf(
            			info => `${info.timestamp} ${info.level}: ${info.message}`
                    )
                  )                    
        }),
        new (winstonDaily)({
            name: 'error-file',
            filename: `${logBaseDir}/err_${pm_id}_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat,
            format: winston.format.combine(
            		winston.format.colorize(),
            		winston.format.printf(
            			info => `${info.timestamp} ${info.level}: ${info.message}`
                    )
                  )                    
        }),        
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: logLevelConsole,
            showLevel: true,
            json: false,
            timestamp: timeStampFormat,
            format: winston.format.combine(
            		winston.format.colorize(),
            		winston.format.printf(
            			info => `${info.timestamp} ${info.level}: ${info.message}`
                    )
                  )            
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            filename: `${logBaseDir}/exception_${pm_id}_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            timestamp: timeStampFormat,
            format: winston.format.combine(
            		winston.format.colorize(),
            		winston.format.printf(
            			info => `${info.timestamp} ${info.level}: ${info.message}`
                    )
                  )                    
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat,
            format: winston.format.combine(
            		winston.format.colorize(),
            		winston.format.printf(
            			info => `${info.timestamp} ${info.level}: ${info.message}`
                    )
                  )                    
        })
    ]
});


function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');                            
};

/*
const options = { 
	    service: 'crawler', 
	    logger: 'jsonlogger',
	    version: '1.0.0', 
	    typeFormat: 'console'
	};
 
log.logger.format = configuredFormatter(options);
*/