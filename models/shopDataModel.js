const moment = require("moment");
const model = {
    getKeywordList (context, {market}) {
        return new Promise((resolved, rejected) => {
            let queryString = `SELECT keyword FROM product WHERE market = ?`;
            let queryValue = [market];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                let keyword_list = [];

                rows.forEach(row => {
                    keyword_list.push(...row.keyword.split('/'));
                });

                keyword_list = [...new Set(keyword_list)];

                context.keyword_list = keyword_list;

                return resolved(context);
            })
        });
    },

    getKeywordListByUser (context, {user_id, product_no}) {
        return new Promise((resolved, rejected) => {
            let queryString = `SELECT keyword FROM product WHERE user_id = ? AND product_no = ?`;
            let queryValue = [user_id, product_no];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (rows.length > 0) context.keyword_list = rows[0].keyword.split('/');

                return resolved(context);
            })
        });
    },

    getAllProductKeyword (context) {
        return new Promise((resolved, rejected) => {
            let queryString = `SELECT product_id, keyword, product_no FROM product WHERE market = ?`;
            let queryValue = ["naver"];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                context.result = [];
                if (rows.length > 0) {
                    rows.forEach(row => {
                        context.result.push({
                            product_id: row.product_id,
                            product_no: row.product_no,
                            keyword: row.keyword.split('/')
                        });
                    });
                }

                return resolved(context);
            })
        });
    },

    addProductLank (context) {
        return new Promise((resolved, rejected) => {
            let queryString = `INSERT IGNORE INTO product_lank (pl_product_id, pl_product_no, keyword, lank, lank_date) VALUES ?`;
            let queryValue = [context.lankData];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                return resolved(context);
            })
        });
    },

    addNaverShopData (context, shopDataList) {
        return new Promise((resolved, rejected) => {
            let queryString = `INSERT IGNORE INTO shop_data (keyword, shop_data, data_date) VALUES ?`;
            let queryValue = [shopDataList];

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    console.error(err);
                    return rejected({ context, error });
                }

                if (row.affectedRows > 0) context.result = 200;
                else context.result = 400

                return resolved(context);
            })
        });
    },

    getShopDataByKeyword (context, {keyword_list, product_id, product_no}) {
        return new Promise((resolved, rejected) => {
            let today = moment(new Date()).format('YYYY-MM-DD');

            let queryString = `SELECT data_date, keyword, shop_data FROM shop_data 
                                WHERE keyword IN ? 
                                AND data_date = ?`;
            let queryValue = [[[...new Set(keyword_list)]], today];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                // if (!context.shopData)
                //     context.shopData = [];

                let shopData = [];
                let shopDataList = [];

                rows.forEach(row => {
                    let data = JSON.parse(row.shop_data);
                    let lank = data.findIndex((element, index, array) => {
                        return element.productId === product_no;
                    })
                    shopData.push({
                        product_id: product_id,
                        product_no: product_no,
                        date: today,
                        keyword: row.keyword,
                        // shop_data: JSON.parse(row.shop_data),
                        lank: lank>=0 ? lank+1 : '100'
                    });

                    shopDataList.push([product_id, product_no, row.keyword, lank>=0 ? lank+1 : '100', today]);
                });

                context.shopData = shopData;
                context.shopDataList = shopDataList;

                return resolved(context);
            })
        });
    },

    basicFunc (context, {data}) {
        return new Promise((resolved, rejected) => {
            let queryString = ``;
            let queryValue = [];

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                if (row.affectedRows > 0) context.result = 200;
                else context.result = 400

                return resolved(context);
            })
        });
    },

    getProductLank (context, {startDate, endDate}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    SELECT pl_product_id, pl_product_no as product_no, keyword, lank, date_format(lank_date, '%Y-%m-%d') as lank_date
                    FROM product_lank
                    WHERE lank_date >= ? AND lank_date <= ? AND pl_product_no in ? ORDER BY keyword, pl_product_id, lank_date ASC`;
            let queryValue = [startDate, endDate, [context.product_list]];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                context.lankData = [];

                rows.forEach(row => {
                    context.lankData.push({
                        product_id: row.pl_product_id,
                        product_no: row.product_no,
                        keyword: row.keyword,
                        lank: row.lank,
                        lank_date: row.lank_date
                    })
                })

                // 예외처리 필요
                context.result.forEach(result => {
                    let lankData = context.lankData.filter(data => {
                        return data.product_no === result.product_no;
                    })
                    result.startDate = startDate;
                    result.endDate = endDate;
                    result.keyword_list = result.keyword.split('/');
                    result.lankData = [];
                    result.date = [];
                    result.keyword_list.forEach(keyword => {
                        let tempData = lankData.filter(data => {
                            return data.keyword === keyword;
                        })
                        let tempList = [];
                        for (let i=0; i<7; i++) {
                            let day = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
                            result.date.push(day);
                            if (tempData.length > 0 && day === tempData[0].lank_date) {
                                tempList.push(tempData[0]);
                                tempData.shift();
                            }
                            else if (tempData.length > 0) {
                                tempList.push({
                                    "product_id": tempData[0].product_id,
                                    "product_no": tempData[0].product_no,
                                    "keyword": tempData[0].keyword,
                                    "lank": "-",
                                    "lank_date": day
                                })
                            }
                            else {
                                tempList.push({
                                    "product_id": "-",
                                    "product_no": "-",
                                    "keyword": "-",
                                    "lank": "-",
                                    "lank_date": day
                                })
                            }
                        }
                        result.lankData.push(tempList)
                    })
                    // result.lankData = lankData;
                })

                return resolved(context);
            });
        })
    },
}

module.exports = model;