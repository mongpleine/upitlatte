const model = {
    getKeywordList (context, {data}) {
        return new Promise((resolved, rejected) => {
            let queryString = `SELECT keyword FROM product`;
            let queryValue = [];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                let keyword_list = [];

                rows.forEach(row => {
                    keyword_list.push(...row.keyword.split('|'));
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
                if (rows.length > 0) context.keyword_list = rows[0].keyword.split('|');

                return resolved(context);
            })
        });
    },

    addNaverShopData (context, shopDataList) {
        return new Promise((resolved, rejected) => {
            let queryString = `INSERT IGNORE INTO shop_data (keyword, shop_data) VALUES ?`;
            let queryValue = [shopDataList];

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

    getShopDataByKeyword (context, keyword_list) {
        return new Promise((resolved, rejected) => {
            // keyword_list = [...new Set(keyword_list)];

            let queryString = `SELECT date, keyword, shop_data FROM shop_data WHERE keyword IN ? `;
            let queryValue = [[...new Set(keyword_list)]];
            // let queryValue = keyword_list.filter((element, index) => {
            //     return keyword_list.indexOf(element) === index;
            // });

            // let queryValue = keyword_list.reduce((accumulator, currentValue) => {
            //     if (!accumulator.includes(currentValue)) {
            //         accumulator.push(currentValue);
            //     }
            //     return accumulator;
            // }, []);

            context.conn.query(queryString, [queryValue], (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                context.showData = [];

                rows.forEach(row => {
                    context.showData.push({
                        keyword: row.keyword,
                        shop_data: JSON.parse(row.shop_data)
                    })
                })

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
}

module.exports = model;