const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    router.post('/item/add',
        api.item.addItem
    )

    router.get('/item/list',
        api.item.itemList
    )

    return router;
}