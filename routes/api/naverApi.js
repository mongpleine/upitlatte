const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    router.get('/naver/shoppingdata',
        api.naverApi.getShoppingData
    )

    return router;
}