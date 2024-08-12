const db = require("../models/database/mysqlSetting").connection;
const userModel = require("../models/userModel");
const getConnection = require("../models/database/connectionPool");

const controller = {
    login(req, res, next) {
        let context = {
            data: {
                id: req.body.id,
                password: req.body.pw
            }
        }
        try {
            getConnection((conn) => {
                context.conn = conn;
                userModel.checkUser(context, context.data)
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        if (context.result) {
                            res.statusCode = 200;
                            return res.cookie("userdata", context.result).redirect('/product');
                        } else {
                            res.statusCode = 403;
                            return res.redirect('/login');
                        }
                    });
            })
        } catch (err) {
            next(err);
        }
    },
    join(req, res, next) {
        let context = {
            data: {
                id: req.body.id,
                password: req.body.pw,
                email: req.body.email,
                eid: req.body.eid
            }
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
                userModel.joinUser(context, context.data)
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        if (context.result === 200) {
                            res.statusCode = 200;
                            return res.redirect('/login');
                        } else {
                            res.statusCode = 403;
                            return res.send("<script>history.back(); alert('이미 가입한 메일주소 입니다.');</script>");
                            // return res.redirect('/join');
                        }
                    });
            })
        } catch (err) {
            next(err);
        }
    },
    authCheck(req, res, next) {
        let context = {
            data: {}
        }
        if (req.cookies.userdata !== undefined) {
            context.data = req.cookies.userdata;
        } else {
            return res.redirect('/login');
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
                userModel.checkUserByCookie(context, context.data)
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        if (context.result) {
                            res.statusCode = 200;
                            return next();
                        } else {
                            res.statusCode = 403;
                            return res.redirect('/login');
                        }
                    });
            });
        } catch (err) {
            next(err);
        }
    },

    defaultFunc(req, res, next) {
        let context = {
            data: {}
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
            });
        } catch (err) {
            next(err);
        }
    },
}

module.exports = controller;