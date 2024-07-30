const model = {
    setCategories(context, values) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                INSERT IGNORE INTO coupang_cate (cate_name, cate_num) VALUES ?`;
            let queryValue = values;

            context.conn.query(queryString, [queryValue], (err, row, fields) => {
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
}

module.exports = model;