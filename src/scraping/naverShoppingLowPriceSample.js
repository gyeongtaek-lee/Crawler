/**
 * 네이버 쇼핑 최저가 크롤링 예제
 * {"$and":[{"modelNm":"OLED77G1KNA"},{"createDt": "20210618"}]}
 */
const MongoDB			= require('../db/mongoDB');

const puppeteer 		= require('puppeteer');

const crawlerFactory	= require('./crawlerFactory');

const NaverShoppingLowPrice = require('./naverShoppingLowPrice');

const iPhone = puppeteer.devices['iPhone 6'];

(async () => {
	
	const modelArray = [
//		{'name' : 'OLED77G1KNA', 	'itemNm' : 'LG 올레드 evo (벽걸이형)', 			'price' : '8426800'}
//	  , {'name' : 'FQ25LBNBA1M', 	'itemNm' : 'LG 오브제컬렉션 럭셔리 (매립배관형)', 	'price' : '5477400'}
//	  , {'name' : 'BWL1', 			'itemNm' : '더마 LED 마스크 플러스', 			'price' : '1200000'}
//	  , {'name' : 'S5DOC', 			'itemNm' : 'LG 트롬 스타일러 오브제컬렉션', 		'price' : '2096600'}
//	  , {'name' : '75UP8300MNA', 	'itemNm' : 'LG 울트라 HD TV (스탠드형)',	    'price' : '2257100'}
//	  , {'name' : '16Z90P-GA70K',   'itemNm' : 'LG 그램 16', 						'price' : '2096600'}
//	  , {'name' : 'AO9571WKT',   	'itemNm' : 'LG 코드제로 A9S 오브제컬렉션', 		'price' : '1534800'}
//	  , {'name' : 'F24EDE',   		'itemNm' : 'LG 트롬 스팀 펫', 					'price' : '1805700'}
		{'name' : 'F-A201GDW',  'itemNm' : 'LG 냉동고',  'price' : '1000000'}
		,{'name' : 'F2WCS',  'itemNm' : 'LG 꼬망스 미니세탁기',  'price' : '1000000'}
		,{'name' : 'BP450',  'itemNm' : 'LG 스마트 3D 블루레이 플레이어 ',  'price' : '1000000'}
		,{'name' : 'W715B',  'itemNm' : 'LG DIOS 와인셀러',  'price' : '1000000'}
		,{'name' : 'W855B',  'itemNm' : 'LG DIOS 와인셀러',  'price' : '1000000'}
		,{'name' : 'A205S',  'itemNm' : 'LG 냉동고',  'price' : '1000000'}
		,{'name' : 'MW23BD',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'MW23CD',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'MW23GD',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'MW23WD',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'MW25B',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'MW25S',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}		
		,{'name' : 'MW23ED',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'F2WC',  'itemNm' : 'LG 트롬 미니워시',  'price' : '1000000'}
		,{'name' : 'W087B',  'itemNm' : 'LG DIOS 와인셀러 미니',  'price' : '1000000'}
		,{'name' : 'F2SC',  'itemNm' : 'LG 트롬 미니워시',  'price' : '1000000'}
		,{'name' : 'F4VC',  'itemNm' : 'LG 트롬 미니워시',  'price' : '1000000'}
		,{'name' : 'F4WC',  'itemNm' : 'LG 트롬 미니워시',  'price' : '1000000'}
		,{'name' : 'PF50KA',  'itemNm' : 'LG 시네빔',  'price' : '1000000'}
		,{'name' : 'MW23BP',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'MW25P',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'SPK8S',  'itemNm' : 'LG 사운드바',  'price' : '1000000'}
		,{'name' : 'BER3G1',  'itemNm' : 'LG 디오스 하이라이트 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'UBK80',  'itemNm' : 'LG 블루레이 플레이어',  'price' : '1000000'}
		,{'name' : 'B267SM',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'B057W',  'itemNm' : ' LG 일반 냉장고',  'price' : '1000000'}
		,{'name' : 'B057S',  'itemNm' : 'LG 일반 냉장고',  'price' : '1000000'}
		,{'name' : 'B107S',  'itemNm' : 'LG 일반 냉장고',  'price' : '1000000'}
		,{'name' : 'B107W',  'itemNm' : 'LG 일반 냉장고',  'price' : '1000000'}
		,{'name' : '27MK430H',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : '27MK600MW',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : '24MK600MW',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : 'F4KC',  'itemNm' : 'LG 트롬 미니워시',  'price' : '1000000'}
		,{'name' : 'DFB41P',  'itemNm' : 'LG DIOS 식기세척기',  'price' : '1000000'}
		,{'name' : 'M459M',  'itemNm' : 'LG 모던엣지 냉장고',  'price' : '1000000'}
		,{'name' : '32UL950',  'itemNm' : 'LG 울트라HD 모니터',  'price' : '1000000'}
		,{'name' : 'M459S',  'itemNm' : 'LG 모던엣지 냉장고',  'price' : '1000000'}
		,{'name' : 'BEH2GT',  'itemNm' : 'LG 디오스 하이브리드 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'UBK90',  'itemNm' : 'LG 블루레이 플레이어',  'price' : '1000000'}
		,{'name' : 'AP139MWA',  'itemNm' : 'LG 퓨리케어 미니 공기청정기',  'price' : '1000000'}
		,{'name' : 'SQ08M9JWAS',  'itemNm' : 'LG 휘센 일반 벽걸이',  'price' : '1000000'}
		,{'name' : '28TL430D',  'itemNm' : 'LG TV 모니터',  'price' : '1000000'}
		,{'name' : '27UL500',  'itemNm' : 'LG 울트라HD 모니터',  'price' : '1000000'}
		,{'name' : 'SQ06S9JWAS',  'itemNm' : 'LG 휘센 공기청정 벽걸이',  'price' : '1000000'}
		,{'name' : 'R76STM',  'itemNm' : 'LG 코드제로 로보킹',  'price' : '1000000'}
		,{'name' : 'SL4F',  'itemNm' : 'LG 사운드바',  'price' : '1000000'}
		,{'name' : 'J612SS34',  'itemNm' : 'LG DIOS 얼음정수기냉장고(세미빌트인)',  'price' : '1000000'}
		,{'name' : 'W089M',  'itemNm' : 'LG DIOS 와인셀러 미니',  'price' : '1000000'}
		,{'name' : 'W089MB',  'itemNm' : 'LG DIOS 와인셀러 미니',  'price' : '1000000'}
		,{'name' : 'M349SN',  'itemNm' : 'LG 모던엣지 냉장고',  'price' : '1000000'}
		,{'name' : 'PL2',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'HU70LA',  'itemNm' : 'LG 시네빔 4K',  'price' : '1000000'}
		,{'name' : '29WL50S',  'itemNm' : 'LG 울트라와이드 모니터',  'price' : '1000000'}
		,{'name' : '34GL750',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : '38GL950G',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : 'ML32AW1',  'itemNm' : 'LG 디오스 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML32BW1',  'itemNm' : 'LG 디오스 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML32PW1',  'itemNm' : 'LG 디오스 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML32WW1',  'itemNm' : 'LG 디오스 광파오븐',  'price' : '1000000'}
		,{'name' : 'FW17V9WWA1',  'itemNm' : 'LG 휘센 위너 냉난방 에어컨',  'price' : '1000000'}
		,{'name' : '27V70N-G',  'itemNm' : 'LG 일체형 PC',  'price' : '1000000'}
		,{'name' : 'AS120VELA',  'itemNm' : 'LG 퓨리케어 공기청정기',  'price' : '1000000'}
		,{'name' : 'AS120VSKA',  'itemNm' : 'LG 퓨리케어 공기청정기',  'price' : '1000000'}
		,{'name' : '27QN880',  'itemNm' : 'LG PC모니터 360',  'price' : '1000000'}
		,{'name' : '32QN600',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : '34GN850',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : '29WN600',  'itemNm' : 'LG 울트라와이드 모니터',  'price' : '1000000'}
		,{'name' : '38WN95C',  'itemNm' : 'LG 울트라와이드 모니터',  'price' : '1000000'}
		,{'name' : 'M970I',  'itemNm' : 'LG 코드제로 M9 ThinQ ',  'price' : '1000000'}
		,{'name' : '32UN880',  'itemNm' : 'LG 울트라HD 모니터 360',  'price' : '1000000'}
		,{'name' : 'OLED55CXFSG',  'itemNm' : 'LG 올레드 AI <sup>ThinQ</sup> (스탠드형)',  'price' : '1000000'}
		,{'name' : 'OLED65BXFSG',  'itemNm' : 'LG 올레드 AI <sup>ThinQ</sup> (스탠드형)',  'price' : '1000000'}
		,{'name' : 'OLED65CXFSG',  'itemNm' : 'LG 올레드 AI <sup>ThinQ</sup> (스탠드형)',  'price' : '1000000'}
		,{'name' : 'AP130MBKA',  'itemNm' : 'LG 퓨리케어 미니 공기청정기',  'price' : '1000000'}
		,{'name' : 'AP130MWKA',  'itemNm' : 'LG 퓨리케어 미니 공기청정기',  'price' : '1000000'}
		,{'name' : 'R76ITM',  'itemNm' : 'LG 코드제로 로보킹 ',  'price' : '1000000'}
		,{'name' : '27QN600',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : '38GN950',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : 'PH30N',  'itemNm' : 'LG 시네빔',  'price' : '1000000'}
		,{'name' : 'SW11BAKWAS',  'itemNm' : 'LG 휘센 일반 벽걸이',  'price' : '1000000'}
		,{'name' : 'F24VDD',  'itemNm' : 'LG 트롬<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : 'F873SS32',  'itemNm' : 'LG DIOS 매직스페이스',  'price' : '1000000'}
		,{'name' : 'F21WDD',  'itemNm' : 'LG 트롬<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : 'F24KDD',  'itemNm' : 'LG 트롬<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : 'F24WDD',  'itemNm' : 'LG 트롬<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : 'F21VDD',  'itemNm' : 'LG 트롬<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : '32GN500',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : 'SQ16BAKWAS',  'itemNm' : 'LG 휘센 일반 벽걸이',  'price' : '1000000'}
		,{'name' : 'SQ11BAKWAS',  'itemNm' : 'LG 휘센 일반 벽걸이',  'price' : '1000000'}
		,{'name' : 'GX',  'itemNm' : 'LG 사운드바',  'price' : '1000000'}
		,{'name' : 'PL5',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'PL7',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'BEF3MST',  'itemNm' : 'LG 디오스 인덕션 와이드존 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'S833SN35',  'itemNm' : 'LG DIOS 매직스페이스(메탈)',  'price' : '1000000'}
		,{'name' : 'S833SS32',  'itemNm' : 'LG DIOS 매직스페이스(메탈)',  'price' : '1000000'}
		,{'name' : 'B600SM',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'HBS-TFN5',  'itemNm' : 'LG TONE Free',  'price' : '1000000'}
		,{'name' : 'HBS-TFN5',  'itemNm' : 'LG TONE Free',  'price' : '1000000'}
		,{'name' : '27GN880',  'itemNm' : 'LG 울트라기어 게이밍모니터 360',  'price' : '1000000'}
		,{'name' : 'FQ18SADWG2',  'itemNm' : 'LG 휘센 듀얼 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ18SADWG2M',  'itemNm' : 'LG 휘센 듀얼 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : '34WN780',  'itemNm' : 'LG 울트라와이드 모니터 360',  'price' : '1000000'}
		,{'name' : 'M970P',  'itemNm' : 'LG 코드제로 M9 ThinQ ',  'price' : '1000000'}
		,{'name' : 'M970S',  'itemNm' : 'LG 코드제로 M9 ThinQ ',  'price' : '1000000'}
		,{'name' : 'M970V',  'itemNm' : 'LG 코드제로 M9 ThinQ ',  'price' : '1000000'}
		,{'name' : 'FQ17SADWP3',  'itemNm' : 'LG 휘센 듀얼 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ17SADWP3M',  'itemNm' : 'LG 휘센 듀얼 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FW17DADWA2',  'itemNm' : 'LG 휘센 듀얼 냉난방 에어컨',  'price' : '1000000'}
		,{'name' : 'FW17DADWA2M',  'itemNm' : 'LG 휘센 듀얼 냉난방 에어컨 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FW17SADWA2',  'itemNm' : 'LG 휘센 듀얼 냉난방 에어컨',  'price' : '1000000'}
		,{'name' : 'FW17SADWA2M',  'itemNm' : 'LG 휘센 듀얼 냉난방 에어컨 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FW17VADWA2',  'itemNm' : 'LG 휘센 듀얼 냉난방 에어컨',  'price' : '1000000'}
		,{'name' : 'FW17VADWA2M',  'itemNm' : 'LG 휘센 듀얼 냉난방 에어컨 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'RH16VT',  'itemNm' : 'LG 트롬 건조기 스팀<sup>ThinQ</sup> 듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : '27UN880',  'itemNm' : 'LG 울트라HD 모니터 360',  'price' : '1000000'}
		,{'name' : 'B600SEM',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'B600WMM',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'MH60G',  'itemNm' : 'LG 힐링미 안마의자',  'price' : '1000000'}
		,{'name' : '75UN7850GWG',  'itemNm' : 'LG 울트라 HD TV AI <sup>ThinQ</sup> (벽걸이형)',  'price' : '1000000'}
		,{'name' : '27MN430HW',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : 'F18VDP',  'itemNm' : 'LG 트롬',  'price' : '1000000'}
		,{'name' : 'DFB22MA',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'DUB22MA',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'DFB22DA',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'DFB22SA',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'DUB22DA',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'DUB22SA',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'PL2W',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'PL5W',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'PL7W',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'K410TS34E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K510MC18',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K510SN18',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K840TS34',  'itemNm' : 'LG DIOS 김치톡톡 프리스타일',  'price' : '1000000'}
		,{'name' : 'K410MB19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K410MC19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K410SN19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'RH9VV',  'itemNm' : 'LG 트롬 건조기 듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : 'RH9WV',  'itemNm' : 'LG 트롬 건조기 듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : 'K330MB19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K330MC19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K330SN19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K330SS19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K410SS19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K410W14E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K220AE12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K220LW12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K220MB13E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K225SS12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K225SS13E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'PL2B',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'PL2P',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'PL2S',  'itemNm' : 'LG 엑스붐 Go',  'price' : '1000000'}
		,{'name' : 'K510S14',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K130AE12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K130LW12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K130SS12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K83IGY1',  'itemNm' : 'LG 싸이킹 K8',  'price' : '1000000'}
		,{'name' : 'K83RG1',  'itemNm' : 'LG 싸이킹 K8',  'price' : '1000000'}
		,{'name' : 'K83VG1',  'itemNm' : 'LG 싸이킹 K8',  'price' : '1000000'}
		,{'name' : '75UN7000KSG',  'itemNm' : 'LG 울트라 HD TV AI <sup>ThinQ</sup> (스탠드형)',  'price' : '1000000'}
		,{'name' : 'X320GB',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'Y320GS',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'RH16VTN',  'itemNm' : 'LG 트롬 건조기 듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : 'ML39BW',  'itemNm' : 'LG 디오스 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML39GW',  'itemNm' : 'LG DIOS 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML39SW',  'itemNm' : 'LG DIOS 광파오븐',  'price' : '1000000'}
		,{'name' : 'K410TS14E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'K410S19E',  'itemNm' : 'LG DIOS 김치톡톡 스탠드형',  'price' : '1000000'}
		,{'name' : 'WD302AS',  'itemNm' : '슬림 스윙 정수기',  'price' : '1000000'}
		,{'name' : 'WD502AS',  'itemNm' : '슬림 스윙 정수기',  'price' : '1000000'}
		,{'name' : 'WD102AW',  'itemNm' : '슬림 스윙 정수기',  'price' : '1000000'}
		,{'name' : 'BM400RIR',  'itemNm' : 'LG 힐링미 안마의자',  'price' : '1000000'}
		,{'name' : 'W895BB',  'itemNm' : 'LG DIOS 와인셀러',  'price' : '1000000'}
		,{'name' : 'C40SGY1',  'itemNm' : 'LG 싸이킹 POWER',  'price' : '1000000'}
		,{'name' : 'K73BGY1',  'itemNm' : 'LG 슈퍼 싸이킹 Ⅲ 주니어',  'price' : '1000000'}
		,{'name' : 'K73RGY1',  'itemNm' : 'K73RGY',  'price' : '1000000'}
		,{'name' : 'T16MT',  'itemNm' : 'LG 통돌이 세탁기 (블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'T16MU',  'itemNm' : 'T16MU',  'price' : '1000000'}
		,{'name' : 'X320SSS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'AS480BWFR',  'itemNm' : 'LG 퓨리케어 공기청정기',  'price' : '1000000'}
		,{'name' : 'BEY3MST',  'itemNm' : 'LG 디오스 하이브리드 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'W16EE',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16EG',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16EP',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16GE',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'AS120VSKR',  'itemNm' : 'LG 퓨리케어 공기청정기',  'price' : '1000000'}
		,{'name' : 'Y320GB',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'Y320GM',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'Y320GP',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'F21KDDM',  'itemNm' : 'LG 트롬 트윈워시',  'price' : '1000000'}
		,{'name' : 'WD503ACB',  'itemNm' : 'LG 퓨리케어 상하좌우 정수기 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'F9WKBY',  'itemNm' : 'LG TROMM',  'price' : '1000000'}
		,{'name' : 'RH16VTR',  'itemNm' : 'LG 트롬 건조기 스팀<sup>ThinQ</sup>  듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : 'RH16WTR',  'itemNm' : 'LG 트롬 건조기 스팀<sup>ThinQ</sup> 듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : 'F18WDAPM',  'itemNm' : 'LG TROMM 트윈워시',  'price' : '1000000'}
		,{'name' : 'J813S35E-F1',  'itemNm' : 'LG DIOS 얼음정수기냉장고(양문형)',  'price' : '1000000'}
		,{'name' : 'F24KDDM',  'itemNm' : 'LG 트롬 트윈워시',  'price' : '1000000'}
		,{'name' : 'F24VDDM',  'itemNm' : 'LG 트롬 트윈워시',  'price' : '1000000'}
		,{'name' : 'F21WDDM',  'itemNm' : 'LG 트롬 트윈워시',  'price' : '1000000'}
		,{'name' : 'F21WDU',  'itemNm' : 'F21WDU',  'price' : '1000000'}
		,{'name' : 'F18WDAP',  'itemNm' : 'F18WDAP',  'price' : '1000000'}
		,{'name' : 'WU800AS',  'itemNm' : 'LG 퓨리케어 듀얼 정수기',  'price' : '1000000'}
		,{'name' : 'WU900AS',  'itemNm' : 'LG 퓨리케어 듀얼 정수기',  'price' : '1000000'}
		,{'name' : 'BB052S',  'itemNm' : 'LG 홈브루',  'price' : '1000000'}
		,{'name' : 'RH17ETE',  'itemNm' : 'LG 트롬 건조기 스팀 펫<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : 'M870FBS451',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션 ',  'price' : '1000000'}
		,{'name' : 'M870GBB451',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'M870GPB451',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션 ',  'price' : '1000000'}
		,{'name' : 'M870SGS451',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'M620FBS351',  'itemNm' : 'LG 디오스 빌트인 타입 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'M620SGS351',  'itemNm' : 'LG 디오스 빌트인 타입 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'S5MBR',  'itemNm' : 'LG 트롬 스타일러',  'price' : '1000000'}
		,{'name' : 'Z330GPB151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'M300S',  'itemNm' : 'LG 모던엣지 냉장고 ',  'price' : '1000000'}
		,{'name' : 'Z320AA',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'Z320GB',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'Z320GS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'M870MWW451S',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션 ',  'price' : '1000000'}
		,{'name' : 'Z330MBG151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GMS151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'BM401RGR',  'itemNm' : 'LG 힐링미 안마의자',  'price' : '1000000'}
		,{'name' : 'EWN1',  'itemNm' : 'LG 프라엘 아이케어',  'price' : '1000000'}
		,{'name' : 'DUBJ2EA',  'itemNm' : 'LG 오브제컬렉션 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'F17WDBP',  'itemNm' : 'F17WDBP',  'price' : '1000000'}
		,{'name' : 'J813S35ER',  'itemNm' : 'LG DIOS 얼음정수기냉장고(양문형)',  'price' : '1000000'}
		,{'name' : '32UN500',  'itemNm' : 'LG 울트라HD 모니터',  'price' : '1000000'}
		,{'name' : 'BM301RCR',  'itemNm' : 'LG 힐링미 안마의자',  'price' : '1000000'}
		,{'name' : 'WS502SW',  'itemNm' : '스탠드 정수기',  'price' : '1000000'}
		,{'name' : 'Z320GMS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'Z320MBS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'Z320MMS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'Z330GMM151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330MBB151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330MWW151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330FTS151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330SGS151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GBB151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330SMS151',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'T16BV',  'itemNm' : 'LG 통돌이 세탁기 (블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'Z330GBM151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GBP151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GBS151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GPP151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GSS151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330MGG151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z320GPS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'Z320MGS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'DUBJ2GA',  'itemNm' : 'LG 오브제컬렉션 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'Y320MBS',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'Y320MWS',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'Y320SSS',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'X320GMS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'X320GPS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'X320SGS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'X320GSS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'X320MBS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'X320MGS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'X320MWS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지(냉장전용고)',  'price' : '1000000'}
		,{'name' : 'F24EDE',  'itemNm' : 'LG 트롬 스팀 펫',  'price' : '1000000'}
		,{'name' : 'FC480SWSC',  'itemNm' : 'LG WHISEN 실링팬<br/>(낮은 천장고형)',  'price' : '1000000'}
		,{'name' : 'M459P',  'itemNm' : 'LG 모던엣지 냉장고',  'price' : '1000000'}
		,{'name' : 'S3RF',  'itemNm' : 'LG TROMM 스타일러',  'price' : '1000000'}
		,{'name' : 'Y320SGS',  'itemNm' : 'LG 컨버터블 패키지 오브제컬렉션(냉동전용고)',  'price' : '1000000'}
		,{'name' : 'Z320SSS',  'itemNm' : 'LG 오브제컬렉션 컨버터블 패키지 김치냉장고',  'price' : '1000000'}
		,{'name' : 'BEH2GTR',  'itemNm' : 'LG DIOS 하이브리드 전기레인지',  'price' : '1000000'}
		,{'name' : 'S5BBR',  'itemNm' : 'LG 트롬 스타일러',  'price' : '1000000'}
		,{'name' : 'WD303AP',  'itemNm' : '상하좌우 정수기',  'price' : '1000000'}
		,{'name' : 'WD303AS',  'itemNm' : '상하좌우 정수기',  'price' : '1000000'}
		,{'name' : 'WD303AW',  'itemNm' : '상하좌우 정수기',  'price' : '1000000'}
		,{'name' : 'WD503AP',  'itemNm' : '상하좌우 정수기',  'price' : '1000000'}
		,{'name' : 'WD503AW',  'itemNm' : '상하좌우 정수기',  'price' : '1000000'}
		,{'name' : 'WD503AS',  'itemNm' : '상하좌우 정수기',  'price' : '1000000'}
		,{'name' : 'ML32EW1',  'itemNm' : 'LG 오브제컬렉션 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML32GW1',  'itemNm' : 'LG 오브제컬렉션 광파오븐',  'price' : '1000000'}
		,{'name' : 'ML32SW1',  'itemNm' : 'LG 오브제컬렉션 광파오븐',  'price' : '1000000'}
		,{'name' : 'Z330FBB151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330FBS151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330FBT151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330FSS151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330FTT151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330SGG151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330SMM151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'M349SE',  'itemNm' : 'LG 모던엣지 냉장고',  'price' : '1000000'}
		,{'name' : 'BEI3MST',  'itemNm' : 'LG 디오스 인덕션 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'DUBJ2VA',  'itemNm' : 'LG 오브제컬렉션 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'WD503AGB',  'itemNm' : 'LG 퓨리케어 상하좌우 정수기 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'AW068FBA',  'itemNm' : 'LG 오브제 가습 공기청정기',  'price' : '1000000'}
		,{'name' : 'S3BFR',  'itemNm' : 'LG 트롬 스타일러',  'price' : '1000000'}
		,{'name' : 'WS400GW',  'itemNm' : '슬림 스탠드 정수기',  'price' : '1000000'}
		,{'name' : 'W16GG',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16GP',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16PE',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16PG',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16PP',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'BEI3GST',  'itemNm' : 'LG 디오스 인덕션 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'AS301DWFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'AS191DNPA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 펫 플러스',  'price' : '1000000'}
		,{'name' : 'AS191DWFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'AS301DNPA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 펫 플러스',  'price' : '1000000'}
		,{'name' : '16Z90P-G',  'itemNm' : 'LG 그램 16',  'price' : '1000000'}
		,{'name' : 'FC480SWSB',  'itemNm' : 'LG WHISEN 실링팬<br/>(높은 천장고형)',  'price' : '1000000'}
		,{'name' : 'F21VDDM',  'itemNm' : 'LG 트롬 트윈워시',  'price' : '1000000'}
		,{'name' : 'T15DUA',  'itemNm' : 'T15DUA',  'price' : '1000000'}
		,{'name' : 'T15WUA',  'itemNm' : 'T15WUA',  'price' : '1000000'}
		,{'name' : 'RH17VTN',  'itemNm' : 'LG 트롬 건조기 듀얼 인버터 히트펌프',  'price' : '1000000'}
		,{'name' : 'RH17VTS',  'itemNm' : 'LG 트롬 건조기 스팀<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : '43SP520M',  'itemNm' : 'LG IPTV 모니터',  'price' : '1000000'}
		,{'name' : 'AS191DWFR',  'itemNm' : 'LG PuriCare™ 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'AS301DWFR',  'itemNm' : 'LG PuriCare™ 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'AS301DNPR',  'itemNm' : 'LG PuriCare™ 360˚ 공기청정기 펫 플러스',  'price' : '1000000'}
		,{'name' : 'PH510P',  'itemNm' : 'LG 시네빔',  'price' : '1000000'}
		,{'name' : '32SP510M',  'itemNm' : 'LG IPTV 모니터',  'price' : '1000000'}
		,{'name' : 'T15MTA',  'itemNm' : 'LG 통돌이 세탁기(블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'AS171DWFR',  'itemNm' : 'LG PuriCare™ 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'W17KT',  'itemNm' : 'LG 트롬 워시타워',  'price' : '1000000'}
		,{'name' : 'W17WT',  'itemNm' : 'LG 트롬 워시타워',  'price' : '1000000'}
		,{'name' : 'FQ18PBNRA2',  'itemNm' : 'LG 휘센 타워 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBA2B',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNRA2M',  'itemNm' : 'LG 휘센 타워 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBA2MB',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBP2M',  'itemNm' : 'LG 오브제컬렉션 럭셔리 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBA2MB',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBP2M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBNWG2M',  'itemNm' : 'LG 휘센 타워 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBP2M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20SBNWG2M',  'itemNm' : 'LG 휘센 타워 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBA2B',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBP2',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18SBNWG2',  'itemNm' : 'LG 휘센 타워 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBP2',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ20SBNWG2',  'itemNm' : 'LG 휘센 타워 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWG2',  'itemNm' : 'LG 휘센 듀얼 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ18VBDWA2',  'itemNm' : 'LG 휘센 듀얼 빅토리',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWG2M',  'itemNm' : 'LG 휘센 듀얼 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWA2M',  'itemNm' : 'LG 휘센 듀얼 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18VBDWA2M',  'itemNm' : 'LG 휘센 듀얼 빅토리 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWA2',  'itemNm' : 'LG 휘센 듀얼 스페셜',  'price' : '1000000'}
		,{'name' : 'Z330GSB151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBA1M',  'itemNm' : 'LG 오브제컬렉션 럭셔리 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBP1M',  'itemNm' : 'LG 오브제컬렉션 럭셔리 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBA1',  'itemNm' : 'LG 오브제컬렉션 럭셔리',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBP1',  'itemNm' : 'LG 오브제컬렉션 럭셔리',  'price' : '1000000'}
		,{'name' : 'BEY3GST2',  'itemNm' : 'LG 디오스 하이브리드 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'FQ18PBNRA1M',  'itemNm' : 'LG 휘센 타워 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBA1M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBNWG1M',  'itemNm' : 'LG 휘센 타워 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBA1M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBP1M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20SBNWG1M',  'itemNm' : 'LG 휘센 타워 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBP1',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBA1',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNBP1',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNRA1',  'itemNm' : 'LG 휘센 타워 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18SBNWG1',  'itemNm' : 'LG 휘센 타워 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ20PBNBA1',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ20SBNWG1',  'itemNm' : 'LG 휘센 타워 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBA2B',  'itemNm' : 'LG 오브제컬렉션 럭셔리',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBP2',  'itemNm' : 'LG 오브제컬렉션 럭셔리',  'price' : '1000000'}
		,{'name' : 'FQ25LBNBA2MB',  'itemNm' : 'LG 오브제컬렉션 럭셔리 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWA1M',  'itemNm' : 'LG 휘센 듀얼 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWG1M',  'itemNm' : 'LG 휘센 듀얼 스페셜 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18VBDWA1M',  'itemNm' : 'LG 휘센 듀얼 빅토리 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWA1',  'itemNm' : 'LG 휘센 듀얼 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ18SBDWG1',  'itemNm' : 'LG 휘센 듀얼 스페셜',  'price' : '1000000'}
		,{'name' : 'FQ18VBDWA1',  'itemNm' : 'LG 휘센 듀얼 빅토리',  'price' : '1000000'}
		,{'name' : 'AO9571GKT',  'itemNm' : 'LG 코드제로 A9S 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'AO9571WKT',  'itemNm' : 'LG 코드제로 A9S 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'Z330GMB151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GPS151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GSM151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'Z330GSP151S',  'itemNm' : 'LG 오브제컬렉션 김치냉장고 스탠드형',  'price' : '1000000'}
		,{'name' : 'BEI3MSTR',  'itemNm' : 'LG DIOS 인덕션 전기레인지',  'price' : '1000000'}
		,{'name' : 'TS22BVD',  'itemNm' : 'LG 통돌이 세탁기 (블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'DUB22MAR',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'BEI3GSTR',  'itemNm' : 'LG DIOS 인덕션 전기레인지',  'price' : '1000000'}
		,{'name' : 'BEY3MSTR',  'itemNm' : 'LG DIOS 하이브리드 전기레인지',  'price' : '1000000'}
		,{'name' : 'M870SMS452',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션 ',  'price' : '1000000'}
		,{'name' : 'F12VVAC',  'itemNm' : 'F12VVAC',  'price' : '1000000'}
		,{'name' : 'F12WVAC',  'itemNm' : 'F12WVAC',  'price' : '1000000'}
		,{'name' : 'F24EDEM',  'itemNm' : 'F24EDEM',  'price' : '1000000'}
		,{'name' : 'MW23CV',  'itemNm' : 'LG 전자레인지',  'price' : '1000000'}
		,{'name' : 'AS201NNFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'AS351NNFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'AS201NBFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'AS351NBFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : '24TP610D',  'itemNm' : 'LG TV 모니터',  'price' : '1000000'}
		,{'name' : '27GN600',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : 'F4EC',  'itemNm' : 'LG TROMM 미니워시',  'price' : '1000000'}
		,{'name' : '24GN600',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : '24GN650',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : 'S3BOF',  'itemNm' : 'LG 트롬 스타일러 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'S3GOF',  'itemNm' : 'LG 트롬 스타일러 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'B-IPA',  'itemNm' : 'LG 홈브루 캡슐형 맥주 원료 패키지 (IPA)',  'price' : '1000000'}
		,{'name' : 'B-PAL',  'itemNm' : 'LG 홈브루 캡슐형 맥주 원료 패키지 (페일에일)',  'price' : '1000000'}
		,{'name' : 'B-WHE',  'itemNm' : 'LG 홈브루 캡슐형 맥주 원료 패키지 (위트)',  'price' : '1000000'}
		,{'name' : '65NANO93KPSG',  'itemNm' : 'LG 나노셀 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '75NANO93KPSG',  'itemNm' : 'LG 나노셀 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : 'B600S51',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'OLED65G1KWG',  'itemNm' : 'LG 올레드 evo (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'OLED65C1KSG',  'itemNm' : 'LG 올레드 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : 'W821SGS453',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GBB453',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GPB453',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'S5MBC',  'itemNm' : 'LG TROMM 스타일러',  'price' : '1000000'}
		,{'name' : 'T20BVD',  'itemNm' : 'LG 통돌이 세탁기(블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'T20VVD',  'itemNm' : 'LG 통돌이 세탁기 (블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'T22BVD',  'itemNm' : 'LG 통돌이 세탁기 (블랙라벨 플러스)',  'price' : '1000000'}
		,{'name' : 'BEI3MPST',  'itemNm' : 'LG 디오스 인덕션 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'BEY3MPST',  'itemNm' : 'LG 디오스 하이브리드 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : '24QP500',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : 'AS9571IKT',  'itemNm' : 'LG 코드제로 A9S ThinQ ',  'price' : '1000000'}
		,{'name' : 'AS9571BPKT',  'itemNm' : 'LG 코드제로 A9S ThinQ ',  'price' : '1000000'}
		,{'name' : 'DQ160PBBC',  'itemNm' : 'LG 휘센 제습기',  'price' : '1000000'}
		,{'name' : 'R46RTM',  'itemNm' : 'LG 코드제로 로보킹',  'price' : '1000000'}
		,{'name' : 'K225LW12E',  'itemNm' : 'LG DIOS 김치톡톡 뚜껑식',  'price' : '1000000'}
		,{'name' : 'K335S14',  'itemNm' : 'LG DIOS 김치톡톡',  'price' : '1000000'}
		,{'name' : 'S833SS30',  'itemNm' : 'LG DIOS 매직스페이스(메탈)',  'price' : '1000000'}
		,{'name' : '24MK430H',  'itemNm' : 'LG IPS 모니터',  'price' : '1000000'}
		,{'name' : '27ML600SW',  'itemNm' : 'LG IPS 모니터',  'price' : '1000000'}
		,{'name' : '17Z90N-V',  'itemNm' : 'LG 그램 17',  'price' : '1000000'}
		,{'name' : '16Z90P-G',  'itemNm' : 'LG 그램 16',  'price' : '1000000'}
		,{'name' : '17Z995-G',  'itemNm' : 'LG 그램 17',  'price' : '1000000'}
		,{'name' : '17Z995-V',  'itemNm' : 'LG 그램 17',  'price' : '1000000'}
		,{'name' : '15Z995-L',  'itemNm' : 'LG 그램 15',  'price' : '1000000'}
		,{'name' : '15Z995-G',  'itemNm' : 'LG 그램 15',  'price' : '1000000'}
		,{'name' : '14Z995-L',  'itemNm' : 'LG 그램 14',  'price' : '1000000'}
		,{'name' : '15U40N-G',  'itemNm' : 'LG 그램 15',  'price' : '1000000'}
		,{'name' : 'BLL1V',  'itemNm' : '토탈 타이트 업 케어 플러스',  'price' : '1000000'}
		,{'name' : 'F19VDAT',  'itemNm' : 'LG 트롬',  'price' : '1000000'}
		,{'name' : 'S5GOC',  'itemNm' : 'LG 트롬 스타일러 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'S5BOC',  'itemNm' : 'LG 트롬 스타일러 오브제컬렉션',  'price' : '1000000'}
		,{'name' : '17U70P-F',  'itemNm' : 'LG 울트라기어 노트북',  'price' : '1000000'}
		,{'name' : '17U70P-F',  'itemNm' : 'LG 울트라기어 노트북',  'price' : '1000000'}
		,{'name' : '15U70P-F',  'itemNm' : 'LG 울트라기어 노트북',  'price' : '1000000'}
		,{'name' : 'W821FSS453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : '27MK600M',  'itemNm' : 'LG IPS 모니터',  'price' : '1000000'}
		,{'name' : 'AS9571SKT',  'itemNm' : 'LG 코드제로 A9S ThinQ',  'price' : '1000000'}
		,{'name' : '27UL550',  'itemNm' : 'LG 울트라HD 모니터',  'price' : '1000000'}
		,{'name' : 'F21VDU',  'itemNm' : 'LG 트롬 세탁기',  'price' : '1000000'}
		,{'name' : 'TR15MK',  'itemNm' : 'LG 통돌이 세탁기',  'price' : '1000000'}
		,{'name' : 'F19VDU',  'itemNm' : 'LG 트롬 세탁기',  'price' : '1000000'}
		,{'name' : 'K410SS14E',  'itemNm' : 'LG DIOS 김치톡톡',  'price' : '1000000'}
		,{'name' : 'TR16VK',  'itemNm' : 'LG 통돌이 세탁기',  'price' : '1000000'}
		,{'name' : 'OLED65CXFWG',  'itemNm' : 'LG 올레드 AI <sup>ThinQ</sup> (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'OLED65BXFWG',  'itemNm' : 'LG 올레드 AI <sup>ThinQ</sup> (벽걸이형)',  'price' : '1000000'}
		,{'name' : '75UN7000KWG',  'itemNm' : 'LG 울트라 HD TV AI <sup>ThinQ</sup> (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'OLED55CXFWG',  'itemNm' : 'LG 올레드 AI <sup>ThinQ</sup> (벽걸이형)',  'price' : '1000000'}
		,{'name' : '65NANO93KPWG',  'itemNm' : 'LG 나노셀 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'OLED65G1KSG',  'itemNm' : 'LG 올레드 evo (스탠드형)',  'price' : '1000000'}
		,{'name' : 'OLED65C1KWG',  'itemNm' : 'LG 올레드 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '75NANO93KPWG',  'itemNm' : 'LG 나노셀 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'A2N3MA',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(114㎡)+공기청정기(38.9㎡)+인공지능센서 세트',  'price' : '1000000'}
		,{'name' : 'AS351NNFAA',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(114㎡)+인공지능센서 세트',  'price' : '1000000'}
		,{'name' : 'AS351NBFAA',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(114㎡)+인공지능센서 세트',  'price' : '1000000'}
		,{'name' : 'A2B3MA',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(114㎡)+공기청정기(38.9㎡)+인공지능센서 세트',  'price' : '1000000'}
		,{'name' : 'A2N2M',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(66㎡)+공기청정기(38.9㎡) 세트',  'price' : '1000000'}
		,{'name' : 'A2B2M',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(66㎡)+공기청정기(38.9㎡) 세트',  'price' : '1000000'}
		,{'name' : 'A2N3WA',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(114㎡)+미니 공기청정기+인공지능센서 세트',  'price' : '1000000'}
		,{'name' : 'A2B3WA',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(114㎡)+미니 공기청정기+인공지능센서 세트',  'price' : '1000000'}
		,{'name' : 'A2N2W',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(66㎡)+미니 공기청정기 세트',  'price' : '1000000'}
		,{'name' : 'A2B2W',  'itemNm' : '퓨리케어 360˚ 공기청정기 알파(66㎡)+미니 공기청정기 세트',  'price' : '1000000'}
		,{'name' : 'RH16WTD',  'itemNm' : 'LG 트롬 건조기 스팀<sup>ThinQ</sup>',  'price' : '1000000'}
		,{'name' : 'AS181DWFC',  'itemNm' : 'LG 퓨리케어 360° 공기청정기',  'price' : '1000000'}
		,{'name' : 'AS281DWFC',  'itemNm' : 'LG 퓨리케어 360° 공기청정기',  'price' : '1000000'}
		,{'name' : 'AS171DWFC',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기',  'price' : '1000000'}
		,{'name' : 'AS120VWLC',  'itemNm' : 'LG 퓨리케어 공기청정기',  'price' : '1000000'}
		,{'name' : 'DQ160PPBC',  'itemNm' : 'LG 휘센 제습기',  'price' : '1000000'}
		,{'name' : 'BEY3GTU',  'itemNm' : 'LG 디오스 하이브리드 전기레인지 빌트인',  'price' : '1000000'}
		,{'name' : 'DQ200PPBC',  'itemNm' : 'LG 휘센 제습기',  'price' : '1000000'}
		,{'name' : 'DQ200PBBC',  'itemNm' : 'LG 휘센 제습기',  'price' : '1000000'}
		,{'name' : 'K415S14E',  'itemNm' : 'LG DIOS 김치톡톡',  'price' : '1000000'}
		,{'name' : 'K335S14E',  'itemNm' : 'LG DIOS 김치톡톡',  'price' : '1000000'}
		,{'name' : 'M871SGS041',  'itemNm' : 'LG 디오스 오브제컬렉션 베이직',  'price' : '1000000'}
		,{'name' : '27MP500W',  'itemNm' : 'LG PC모니터',  'price' : '1000000'}
		,{'name' : 'M871MBB041S',  'itemNm' : 'LG 디오스 오브제컬렉션 베이직',  'price' : '1000000'}
		,{'name' : 'M871GPB041',  'itemNm' : 'LG 디오스 오브제컬렉션 베이직',  'price' : '1000000'}
		,{'name' : 'W821FBB453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821FTS453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821FBT453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821SSS453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821SGG453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821SMM453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821SSG453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821SMS453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GSS453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GSP453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GSM453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GBS453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GSB453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GBP453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GBM453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821GMB453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'M870MWG452S',  'itemNm' : 'LG 디오스 노크온 매직스페이스 오브제컬렉션 ',  'price' : '1000000'}
		,{'name' : 'W821MWG453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821MGG453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821MBB453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821MBG453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821MGB453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'W821MGW453S',  'itemNm' : 'LG 디오스 오브제컬렉션 얼음정수기냉장고',  'price' : '1000000'}
		,{'name' : 'AS281DWFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'AS281DNPA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 펫 플러스',  'price' : '1000000'}
		,{'name' : 'AS201NGFA',  'itemNm' : 'LG 오브제컬렉션 공기청정기',  'price' : '1000000'}
		,{'name' : 'AS351NGFA',  'itemNm' : 'LG 오브제컬렉션 공기청정기',  'price' : '1000000'}
		,{'name' : '75UP8300MSG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '75UP8300MWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '55UP8300MSG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '55UP8300MWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '86UP8300KSG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '86UP8300KWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'OLED65B1KSG',  'itemNm' : 'LG 올레드 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : 'OLED65B1KWG',  'itemNm' : 'LG 올레드 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '86NANO75KSG',  'itemNm' : 'LG 나노셀 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '86NANO75KWG',  'itemNm' : 'LG 나노셀 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '55NANO93KPSG',  'itemNm' : 'LG 나노셀 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '55NANO93KPWG',  'itemNm' : 'LG 나노셀 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'AS281DWFA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 플러스',  'price' : '1000000'}
		,{'name' : 'AS281DNPA',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 펫 플러스',  'price' : '1000000'}
		,{'name' : 'OLED48C1KNBG',  'itemNm' : 'OLED48C1KNB',  'price' : '1000000'}
		,{'name' : 'AS201NGFA',  'itemNm' : 'LG 오브제컬렉션 공기청정기',  'price' : '1000000'}
		,{'name' : 'AS351NGFA',  'itemNm' : 'LG 오브제컬렉션 공기청정기',  'price' : '1000000'}
		,{'name' : 'W16ED',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16ER',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'FQ20VBWWA2',  'itemNm' : 'LG 휘센 위너',  'price' : '1000000'}
		,{'name' : 'FQ20VBWWA2M',  'itemNm' : 'LG 휘센 위너(매립배관형)',  'price' : '1000000'}
		,{'name' : 'W16GD',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16PD',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16GR',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'OLED55C1KBSG',  'itemNm' : 'LG 올레드 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : 'OLED55C1KBWG',  'itemNm' : 'LG 올레드 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'FQ18HBDWA1',  'itemNm' : 'LG 휘센 듀얼 히트',  'price' : '1000000'}
		,{'name' : 'W16PR',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'OLED65A1MSG',  'itemNm' : 'LG 올레드 TV(스탠드)',  'price' : '1000000'}
		,{'name' : 'OLED65A1MWG',  'itemNm' : 'LG 올레드 TV(벽걸이)',  'price' : '1000000'}
		,{'name' : 'DFB22SAP',  'itemNm' : 'LG DIOS 식기세척기 스팀',  'price' : '1000000'}
		,{'name' : 'W16DE',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'AT-A9S',  'itemNm' : 'LG 올인원타워(별도판매) - A9S용 거치대',  'price' : '1000000'}
		,{'name' : 'W16DG',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16DD',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16DP',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16DR',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16RE',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16RG',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16RP',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16RD',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'W16RR',  'itemNm' : 'LG 트롬 워시타워 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'AT-A9P',  'itemNm' : 'LG 올인원타워(별도판매) - A9용 거치대',  'price' : '1000000'}
		,{'name' : 'ATW-A9S',  'itemNm' : 'LG 올인원타워(별도판매) - A9S용 거치대',  'price' : '1000000'}
		,{'name' : 'ATW-A9P',  'itemNm' : 'LG 올인원타워(별도판매) - A9용 거치대',  'price' : '1000000'}
		,{'name' : 'ATG-A9S',  'itemNm' : 'LG 올인원타워(별도판매) - A9S용 거치대',  'price' : '1000000'}
		,{'name' : 'ATG-A9P',  'itemNm' : 'LG 올인원타워(별도판매) - A9용 거치대',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGP2',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ20PBNGA1',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGA1',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ20PBNGA2G',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGA2G',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FW17V9WWA1M',  'itemNm' : 'LG 휘센 위너 냉난방 에어컨',  'price' : '1000000'}
		,{'name' : 'FQ20PBNGA2B',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGA2B',  'itemNm' : 'LG 오브제컬렉션 프리미엄',  'price' : '1000000'}
		,{'name' : 'BB052SN',  'itemNm' : 'LG 홈브루',  'price' : '1000000'}
		,{'name' : 'FQ20PBNGA2MB',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGA2MB',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNGA2MG',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGA2MG',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGP2M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ18PBNGA1M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'FQ20PBNGA1M',  'itemNm' : 'LG 오브제컬렉션 프리미엄 (매립배관형)',  'price' : '1000000'}
		,{'name' : 'S5DOC',  'itemNm' : 'LG 트롬 스타일러 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'S5ROC',  'itemNm' : 'LG 트롬 스타일러 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'AS9570IKT',  'itemNm' : 'LG 코드제로 A9S ThinQ ',  'price' : '1000000'}
		,{'name' : 'AS9470IKT',  'itemNm' : 'LG 코드제로 A9S ThinQ ',  'price' : '1000000'}
		,{'name' : 'AS9470SKT',  'itemNm' : 'LG 코드제로 A9S ThinQ ',  'price' : '1000000'}
		,{'name' : 'AS9570BKT',  'itemNm' : 'LG 코드제로 A9S ThinQ ',  'price' : '1000000'}
		,{'name' : 'PQ08DBWAS',  'itemNm' : 'LG 이동식 에어컨',  'price' : '1000000'}
		,{'name' : 'PQ08DBWCS',  'itemNm' : 'LG 이동식 에어컨',  'price' : '1000000'}
		,{'name' : 'B-STO',  'itemNm' : 'LG 홈브루 캡슐형 맥주 원료 패키지 (스타우트)',  'price' : '1000000'}
		,{'name' : 'B-PIL',  'itemNm' : 'LG 홈브루 캡슐형 맥주 원료 패키지 (필스너)',  'price' : '1000000'}
		,{'name' : 'AO9571WGKT',  'itemNm' : 'LG 코드제로 A9S 오브제컬렉션',  'price' : '1000000'}
		,{'name' : '75UP8300NSG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '70UP8300ESG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '65UP8300NSG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '65UP8300ESG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '55UP8300NSG',  'itemNm' : 'LG 울트라 HD TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '75UP8300NWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '70UP8300EWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '65UP8300NWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '65UP8300EWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : '55UP8300NWG',  'itemNm' : 'LG 울트라 HD TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'SQ07BBPWAS',  'itemNm' : 'LG 휘센 일반 벽걸이',  'price' : '1000000'}
		,{'name' : 'SQ06MBJWHS',  'itemNm' : 'LG 휘센 일반 벽걸이',  'price' : '1000000'}
		,{'name' : 'AO9571GWKT',  'itemNm' : 'LG 코드제로 A9S 오브제컬렉션',  'price' : '1000000'}
		,{'name' : '32GP850',  'itemNm' : 'LG 울트라기어 게이밍모니터',  'price' : '1000000'}
		,{'name' : 'AS201NNFR',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'AS201NBFR',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'AS351NNFR1',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'AS351NBFR1',  'itemNm' : 'LG 퓨리케어 360˚ 공기청정기 알파',  'price' : '1000000'}
		,{'name' : 'B501S32',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'B501W32',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'B471S32',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'B471W32',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'B321W02',  'itemNm' : 'LG 일반냉장고',  'price' : '1000000'}
		,{'name' : 'RO971WA',  'itemNm' : 'LG 코드제로 R9 오브제컬렉션',  'price' : '1000000'}
		,{'name' : 'RO971GA',  'itemNm' : 'LG 코드제로 R9 오브제컬렉션',  'price' : '1000000'}
		,{'name' : '55NANO75MSG',  'itemNm' : 'LG 나노셀 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : '55NANO75MWG',  'itemNm' : 'LG 나노셀 TV (벽걸이형)',  'price' : '1000000'}
		,{'name' : 'OLED77A1MSG',  'itemNm' : 'LG 올레드 TV(스탠드)',  'price' : '1000000'}
		,{'name' : 'OLED77A1MWG',  'itemNm' : 'LG 올레드 TV(벽걸이)',  'price' : '1000000'}
		,{'name' : 'OLED83C1KSG',  'itemNm' : 'LG 올레드 TV (스탠드형)',  'price' : '1000000'}
		,{'name' : 'OLED83C1KWG',  'itemNm' : 'LG 올레드 TV (벽걸이형)',  'price' : '1000000'}
	];
	
	const mongoDB = new MongoDB();
	
	// DB 연결
	await mongoDB.connect();
	
	const browser = await puppeteer.launch( { 
		headless : false,
		// 윈도우 크롬 자동 설치시 설치되는 경로
		executablePath : "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
		// 실행될 브라우저의 화면 크기를 지정한다.
		defaultViewport : { width : 1920, height: 1080 },
//		args : ['--window-size=1920,1080', '--proxy-server=106.10.55.212:3128']
		args : ['--window-size=1920,1080']
//		args : ['--proxy-server=socks5://175.204.248.213:1080', '--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 175.204.248.213:1080"']
		
	} );
	
	const page = await browser.newPage();
	
//	await page.emulate(iPhone);
	
	await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');
	
	await page.goto('https://msearch.shopping.naver.com/search/all?');

	await crawlerFactory.addJob('naverShoppingLowPrice', NaverShoppingLowPrice);
	
	const crawler = await crawlerFactory.create('naverShoppingLowPrice', {name : 'naverShoppingLowPrice', cluster : null});
	
	console.log(crawler);
	
	// 크롤링 처리
	let _isSuccess = await crawler.processCrawling(page, modelArray);
	
	console.log(_isSuccess);
	
	mongoDB.disconnect();
	
	process.exit(0);
	
})();

