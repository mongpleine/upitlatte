const express = require('express');
const router = express.Router();
const app = express();
const userRoutes = require('./user');
const itemRoutes = require('./item');
const crawlRoutes = require('./crawl');
const naverApiRoutes = require('./naverApi');

module.exports = function () {

    router.use(userRoutes());
    router.use(itemRoutes());
    router.use(crawlRoutes());
    router.use(naverApiRoutes());

    return router;
}