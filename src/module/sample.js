/**
 * 프록시 주소 가져오는 예제
 */
const Cluster	= require('./Cluster');

const config 		= require('../config');

(async () => {
	
	const sites = config.sites;
	
	const cluster = await Cluster.create({'sites' : sites});
	
	console.log(cluster);
	
	const clusterIns1 = await cluster.getCluster('naver');
	const clusterIns2 = await cluster.getCluster('ppomppu');
	
	console.log(`naver ===> ${clusterIns1}`);
	console.log(`ppomppu ===> ${clusterIns2}`);
	
})();


