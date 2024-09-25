const itemModel = require("../models/itemModel");
const userModel = require("../models/userModel");
const shopDataModel = require("../models/shopDataModel");
const getConnection = require("../models/database/connectionPool");
const moment = require("moment");

const controller = {
    getItemList(req, res, next) {
        let defaultStartDate = moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD');
        let defaultEndDate = moment(new Date()).format('YYYY-MM-DD');
        let context = {
            data: {
                user_id: req.cookies.userdata.user_id,
                startDate: req.query.startDate || defaultStartDate,
                endDate: req.query.endDate || defaultEndDate,
                product_id: req.query.product_id || ""
            }
        }

        context.data.dayDiff = Math.abs(moment(context.data.startDate).diff(context.data.endDate, "days"));

        try {
            getConnection(conn => {
                context.conn = conn;
                itemModel.getItemList(context, context.data)
                    .then(context => {
                        if (context.data.product_list.length > 0) {
                            return shopDataModel.getProductRank(context, context.data);
                        } else {
                            return context;
                        }
                    })
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        let selected;
                        if (context.data.product_id !== "") {
                            selected = context.result.find(el => {
                                return Number(el.product_id) === Number(context.data.product_id)
                            })
                        } else {
                            selected = context.result[0];
                        }
                        return res.render(`${req._parsedOriginalUrl.pathname.split('/')[1]}.ejs`, {
                            data: {
                                page: "product",
                                products: context.result,
                                selected: selected,
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
                product_id: req.query.product_id,
                product_no: req.body.product_no || req.query.product_no,
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
    },
    deleteItem (req, res, next) {
        let context = {
            data: {
                user_id:req.cookies.userdata.user_id,
                product_id: req.query.product_id,
                product_no: req.body.product_no || req.query.product_no
            }
        }

        try {
            getConnection(conn => {
                context.conn = conn;
                itemModel.deleteItem(context, context.data)
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