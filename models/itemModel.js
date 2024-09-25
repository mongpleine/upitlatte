const model = {
    getItemList (context, {user_id}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    SELECT product_id, product_no, product_name, market, keyword, etc
                    FROM product
                    WHERE user_id = ? AND active = true ORDER BY product_id DESC`;
            let queryValue = [user_id];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }

                context.result = [];
                context.data.product_list = [];

                if (rows.length > 0) {
                    rows.forEach(row => {
                        context.result.push({
                            product_id: row.product_id,
                            product_no: row.product_no,
                            product_name: row.product_name,
                            market: row.market,
                            keyword: row.keyword,
                            etc: row.etc || ""
                        });
                        context.data.product_list.push(row.product_no);
                    })
                }

                return resolved(context);
            });
        })
    },
    addItem (context, {user_id, product_no, product_name, market, keyword, etc}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    INSERT IGNORE INTO product 
                    (user_id, product_no, product_name, market, keyword, etc) VALUES 
                    (?, ?, ?, ?, ?, ?)`;
            let queryValue = [user_id, product_no, product_name, market, keyword, etc];

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (row.affectedRows > 0) context.result = 200;
                else context.result = 400

                return resolved(context);
            });
        })
    },
    modifyItem (context, {product_id, product_no, product_name, market, keyword, etc}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    UPDATE product set etc = ?`;
            let queryValue = [etc];

            if (product_name && product_name !== "") {
                queryString += ", product_name = ?";
                queryValue.push(product_name);
            }
            if (market && market !== "") {
                queryString += ", market = ?";
                queryValue.push(market);
            }
            if (keyword && keyword !== "") {
                queryString += ", keyword = ?";
                queryValue.push(keyword);
            }

            queryString += "WHERE product_id = ?"
            queryValue.push(product_id);

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (row.affectedRows > 0) context.result = 200;
                else context.result = 400

                return resolved(context);
            });
        })
    },
    deleteItem (context, {user_id, product_id, product_no}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    UPDATE product set active = false WHERE user_id = ? AND product_id = ?`;
            let queryValue = [user_id, product_id];

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (row.affectedRows > 0) context.result = 200;
                else context.result = 400

                return resolved(context);
            });
        })
    }
}

module.exports = model;