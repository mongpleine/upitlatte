const db = require("../models/database/mysqlSetting").connection;
const getConnection = require("../models/database/connectionPool");
const shopDataModel = require("../models/shopDataModel");
const apiUtils = require("../utils/apiUtils");
const axios = require('axios');
const bcrypt = require('bcrypt');
const http = require("https");

const controller = {
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

    getProductDataFromNaver(req, res, next) {
        let context = {
            data: {
                search: req.query.search,
            }
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
                shopDataModel.getKeywordList(context, context.data)
                    .then(async context => {
                        context.shopDataList = await apiUtils.getNaverShopData(context.keyword_list);
                        return context;
                    })
                    .then(context => {
                        return shopDataModel.addNaverShopData(context, context.shopDataList)
                    })
                    .then(context => {
                        context.conn.release();
                        res.json({message: "success"})
                    })
            })
        } catch (err) {
            console.error(err);
            next(err);
        }
    },

    getProductLankByUser (req, res, next) {
        let context = {
            data: {
                user_id: req.query.user,
                product_no: req.query.product_no
            }
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
                shopDataModel.getKeywordListByUser(context, context.data)
                    .then(context => {
                        shopDataModel.getShopDataByKeyword(context, context.keyword_list);
                        return context;
                    })
                    .then(context => {
                        context.conn.release();
                        res.json({message: "success"})
                    });
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = controller;