const db = require("../models/database/mysqlSetting").connection;
const userModel = require("../models/userModel");
const apiUtils = require("../utils/apiUtils");
const getConnection = require("../models/database/connectionPool");

const controller = {
    login(req, res, next) {
        let context = {
            data: {
                email: req.body.email,
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
                email: req.body.email,
                password: req.body.pw,
                name: req.body.name,
                tel: req.body.tel,
                eid: req.body.eid
            }
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
                apiUtils.checkEIDFromOdcloud(context)
                    .then(context => {
                        if(!context.eidMatch) {
                            context.errorType = "eid";
                            context.result = 403;
                            context.resSend = "<script>alert('유효하지 않은 사업자번호 입니다.'); history.back();</script>";
                            return context;
                            // return res.send("<script>alert('유효하지 않은 사업자번호 입니다.'); history.back();</script>");
                        } else {
                            return userModel.joinUser(context, context.data)
                        }
                    })
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
                            let resSend = "resSend" in context ? context.resSend :
                                "<script>alert('이미 가입한 메일주소 입니다.'); history.back();</script>"
                            // switch (context.errorType) {
                            //     case "eid":
                            //         resSend = "<script>alert('유효하지 않은 사업자번호 입니다.'); history.back();</script>";
                            //         break;
                            //
                            // }
                            // return res.send("<script>alert('이미 가입한 메일주소 입니다.'); history.back();</script>");
                            return res.send(resSend);
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