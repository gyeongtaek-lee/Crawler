let common = module.exports = {};

common.minute = function () {
    return Math.round(Date.now() / 60000);
};

common.parseRound = function (num, round) {
    if (isNaN(num)) return 0;
    return Number(parseFloat(Number(num)).toFixed(round));
};