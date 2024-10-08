const express = require('express');
const router = express.Router();
const app = express();
const api = require('../../controllers')

module.exports = function () {

    router.post('/user/login',
        api.user.login
    )

    router.post('/user/join',
        api.user.join
    )

    return router;
}