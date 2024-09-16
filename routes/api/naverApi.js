const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    router.get('/naver/shoppingdata',
        api.naverApi.getProductDataFromNaver
    )

    router.get('/naver/productRank',
        api.naverApi.getProductRankByUser
    )

    router.get('/naver/allProductRank',
        api.naverApi.getAllProductRank
    )

    return router;
}