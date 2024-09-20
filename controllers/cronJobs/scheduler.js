const cron = require('node-cron');
const getConnection = require("../../models/database/connectionPool");
const shopDataModel = require("../../models/shopDataModel");
const apiUtils = require("../../utils/apiUtils");

const controller = {
    cronTest() {
        console.log("cron test");
    },
    getProductDataFromNaver() {
        try {
            getConnection(conn => {
                let context = {
                    conn: conn
                }
                console.log(1);
                shopDataModel.getAllProductKeyword(context)
                    .then(async context => {
                        console.log(2);
                        context.shopDataList = await apiUtils.getNaverShopData(context.keyword_list);
                        return context;
                    })
                    .then(context => {
                        console.log(3);
                        return shopDataModel.addNaverShopData(context, context.shopDataList)
                    })
                    .then(context => {
                        console.log(4);
                        return context;
                    })
                    .then(async context => {
                        console.log(5);
                        context.rankData = [];
                        for (const result of context.product_list) {
                            let temp = await shopDataModel.getShopDataByKeyword(context, {
                                keyword_list: result.keyword,
                                product_id: result.product_id,
                                product_no: result.product_no
                            });
                            context.rankData = [...context.rankData, ...temp.shopDataList];
                            result.shopData = temp.shopData;
                        }
                        console.log(6);
                        return context;
                    })
                    .then(context => {
                        console.log(7);
                        return shopDataModel.addProductRank(context);
                    })
                    .then(context => {
                        console.log(8);
                        context.conn.release();
                        console.log("success get naver shop data");
                        return;
                    })
            })
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = controller;