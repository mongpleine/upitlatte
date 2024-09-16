const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    router.post('/item/add',
        api.user.authCheck,
        api.item.addItem
    )

    router.post('/item/modify',
        api.user.authCheck,
        api.item.modifyItem
    )

    router.get('/item/list',
        api.user.authCheck,
        api.item.getItemList
    )

    router.get('/item/del',
        api.user.authCheck,
        api.item.deleteItem
    )

    return router;
}