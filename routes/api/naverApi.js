const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    router.get('/naver/shoppingdata',
        api.naverApi.getProductDataFromNaver
    )

    router.get('/naver/productLank',
        api.naverApi.getProductLankByUser
    )

    router.get('/naver/allProductLank',
        api.naverApi.getAllProductLank
    )

    return router;
}