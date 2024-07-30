const itemModel = require("../models/itemModel");
const userModel = require("../models/userModel");
const getConnection = require("../models/database/connectionPool");

const controller = {
    itemList(req, res, next) {
        let context = {
            data: {
                user_id: req.query.user_id,
            }
        }

        try {
            getConnection(conn => {
                context.conn = conn;

            })
        } catch (err) {
            next(err);
        }
    },
    addItem (req, res, next) {
        let context = {
            data: {
                user_id:req.body.user_id,
                market: req.body.market,
                item_name: req.body.item_name,
                item_no: req.body.item_no,
                keyword: req.body.keyword || "",
                notification: req.body.notification || 0,
                notification_set: req.body.notification_set || "",
                tel: req.body.tel || "",
                memo: req.body.memo || "",
            }
        }

        // context.data = {
        //     user_id: 1,
        //     market: 'naver',
        //     item_name: '하늘공기청정기',
        //     item_no: '255323',
        //     keyword: '공기청정기|하늘|저전력|휴대용',
        //     notification: 0,
        //     notification_set: '',
        //     tel: '',
        //     memo: 'test',
        // }

        if (!context.data.user_id)
            next();

        try {
            getConnection(conn => {
                context.conn = conn;
                userModel.getUserTel(context, context.data)
                    .then(context => {
                        if (context.result)
                            context.data.tel = context.result;
                        return itemModel.addItem(context, context.data)
                    })
                    .then(context => {
                        context.conn.release();
                        return context;
                    })
                    .then(context => {
                        res.statusCode = 200;
                        let result = {};
                        // return res.redirect('/index');
                        return res.json({});
                    })
            });
        } catch (err) {
            next(err);
        }
        // finally {
        //     if (context.conn)
        //         context.conn.release();
        //     return next();
        // }
    }
}

module.exports = controller;