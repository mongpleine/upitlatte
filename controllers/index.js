const user = require('./userController');
const item = require('./itemController');
const crawl = require('./webCrawlController');
const naverApi = require('./shopDataController');

const api = {
    user: user,
    item: item,
    crawl: crawl,
    naverApi: naverApi,
}


module.exports = api;