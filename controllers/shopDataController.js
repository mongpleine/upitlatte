const db = require("../models/database/mysqlSetting").connection;
const getConnection = require("../models/database/connectionPool");
const shopDataModel = require("../models/shopDataModel");
const apiUtils = require("../utils/apiUtils");
const axios = require('axios');
// const bcrypt = require('bcrypt');
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
                shopDataModel.getKeywordList(context, {market: "naver"})
                    .then(async context => {
                        context.shopDataList = await apiUtils.getNaverShopData(context.keyword_list);
                        return context;
                    })
                    .then(context => {
                        return shopDataModel.addNaverShopData(context, context.shopDataList)
                    })
                    .then(context => {
                        context.conn.release();
                        return res.json({message: "success"})
                    })
            })
        } catch (err) {
            console.error(err);
            next(err);
        }
    },

    getProductRankByUser (req, res, next) {
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
                        return shopDataModel.getShopDataByKeyword(context, {keyword_list: context.keyword_list, product_no: context.data.product_no});
                    })
                    .then(context => {
                        context.conn.release();
                        return res.json({data: context.shopData})
                    });
            });
        } catch (err) {
            next(err);
        }
    },

    getAllProductRank (req, res, next) {
        let context = {
            data: {}
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
                shopDataModel.getAllProductKeyword(context)
                    .then(async context => {
                        context.rankData = [];
                        for (const result of context.result) {
                            let temp = await shopDataModel.getShopDataByKeyword(context, {
                                keyword_list: result.keyword,
                                product_id: result.product_id,
                                product_no: result.product_no
                            });
                            context.rankData = [...context.rankData, ...temp.shopDataList];
                            result.shopData = temp.shopData;
                        }
                        return context;
                    })
                    .then(context => {
                        return shopDataModel.addProductRank(context);
                    })
                    .then(context => {
                        context.conn.release();
                        return res.json({data: context.shopData})
                    });
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = controller;