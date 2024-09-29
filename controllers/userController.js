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
                            context.statusCode = 500;
                            context.errorMessage = "유효하지 않은 사업자번호입니다.";
                            return context;
                        } else {
                            return userModel.joinUser(context, context.data)
                        }
                    })
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        if (context.statusCode === 200) {
                            res.statusCode = 200;
                            return res.redirect('/login');
                        } else {
                            res.statusCode = 500;
                            let resSend = context.errorMessage ?
                                `<script>alert('${context.errorMessage}'); history.back();</script>`:
                                `<script>alert('잘못된 데이터입니다.'); history.back();</script>`;
                            return res.send(resSend);
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

    forgotPassword (req, res, next) {
        let context = {
            data: {
                eid: req.body.eid
            }
        }
        try {
            getConnection((conn) => {
                context.conn = conn;
                userModel.resetPassword(context, context.data)
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        if (context.statusCode) {
                            res.statusCode = 200;
                            return res.send(`<script>alert('${context.message}'); location.href="/login";</script>`)
                        } else {
                            res.statusCode = 403;
                            return res.send(`<script>alert('${context.message}'); history.back();</script>`)
                            // return res.redirect('/login');
                        }
                    });
            })
        } catch (err) {
            next(err);
        }
    },

    modify(req, res, next) {
        let context = {
            data: {
                user_id: req.query.user_id,
                email: req.body.email,
                password: req.body.pw || "",
                name: req.body.name,
                tel: req.body.tel,
                eid: req.body.eid
            }
        }

        context.cookie = req.cookies.userdata;

        try {
            getConnection((conn) => {
                context.conn = conn;
                userModel.modifyProfile(context, context.data)
                    .then(context => {
                        if (context.data.password !== "") return userModel.checkUser(context, context.data);
                        else {
                            context.cookie.tel = context.data.tel;
                            context.result = context.cookie;
                            return context
                        };
                    })
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        return res.cookie("userdata", context.result).send(`<script>alert('${context.message}'); history.back();</script>`)
                    })
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