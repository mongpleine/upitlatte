const db = require("../models/database/mysqlSetting").connection;
const userModel = require("../models/userModel");
const getConnection = require("../models/database/connectionPool");

const controller = {
    login(req, res, next) {
        let context = {
            data: {
                id: req.body.ids,
                password: req.body.pws
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
                            res.redirect('/index');
                        } else {
                            res.statusCode = 403;
                            res.redirect('/login');
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
                num: req.body.num
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
                        if (context.result) {
                            res.statusCode = 200;
                            res.redirect('/login');
                        } else {
                            res.statusCode = 403;
                            res.redirect('/join');
                        }
                    });
            })
        } catch (err) {
            next(err);
        }
    }
}

module.exports = controller;