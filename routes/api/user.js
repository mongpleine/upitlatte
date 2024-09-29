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

    router.post('/user/forgot-password',
        api.user.forgotPassword
    )

    router.post('/user/modifyProfile',
        api.user.authCheck,
        api.user.modify
    )

    return router;
}