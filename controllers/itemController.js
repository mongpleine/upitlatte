const itemModel = require("../models/itemModel");
const userModel = require("../models/userModel");
const shopDataModel = require("../models/shopDataModel");
const getConnection = require("../models/database/connectionPool");
const moment = require("moment");

const controller = {
    getItemList(req, res, next) {
        let context = {
            data: {
                user_id: req.cookies.userdata.user_id,
            }
        }

        try {
            getConnection(conn => {
                context.conn = conn;
                itemModel.getItemList(context, context.data)
                    .then(context => {
                        let startDate = moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD');
                        let endDate = moment(new Date()).format('YYYY-MM-DD');
                        return shopDataModel.getProductRank(context, {startDate: startDate, endDate: endDate});
                    })
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        return res.render('tables.ejs', {
                            data: {
                                page: "product",
                                products: context.result,
                                userdata: req.cookies.userdata
                            }
                        })
                    })
            })
        } catch (err) {
            next(err);
        }
    },
    addItem (req, res, next) {
        let context = {
            data: {
                user_id:req.cookies.userdata.user_id,
                product_no: req.body.product_no,
                product_name: req.body.product_name,
                market: req.body.market,
                keyword: req.body.keyword || "",
                // notification: req.body.notification || 0,
                // notification_set: req.body.notification_set || "",
                etc: req.body.etc || "",
            }
        }

        try {
            getConnection(conn => {
                context.conn = conn;
                itemModel.addItem(context, context.data)
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        return res.redirect('/product');
                    })
            });
        } catch (err) {
            next(err);
        }
    },

    modifyItem (req, res, next) {
        let context = {
            data: {
                user_id:req.cookies.userdata.user_id,
                product_no: req.body.product_no,
                product_name: req.body.product_name,
                market: req.body.market,
                keyword: req.body.keyword || "",
                // notification: req.body.notification || 0,
                // notification_set: req.body.notification_set || "",
                etc: req.body.etc || "",
            }
        }

        try {
            getConnection(conn => {
                context.conn = conn;
                itemModel.modifyItem(context, context.data)
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        return res.redirect('/product');
                    })
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = controller;