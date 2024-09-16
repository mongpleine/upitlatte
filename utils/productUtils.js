const getConnection = require("../models/database/connectionPool");
const shopDataModel = require("../models/shopDataModel");

const productUtils = {
    analysisRanking (context) {
        try {
            getConnection((conn) => {
                context.conn = conn;
                shopDataModel.getKeywordListByUser(context, context.data)
                    .then(context => {
                        return shopDataModel.getShopDataByKeyword(
                            context,
                            {
                                keyword_list: context.keyword_list,
                                product_no: context.data.product_no
                            });
                    })
                    .then(context => {

                        return context;
                    })
                    .then(context => {
                        context.conn.release();
                    });
            });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = productUtils;