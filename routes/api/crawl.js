const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    // centos7 node18 호환성 문제로 비활성화
    // router.get('/crawl/coupang/category',
    //     api.crawl.getCoupangCategory
    // )

    return router;
}