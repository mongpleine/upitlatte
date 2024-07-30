const model = {
    getItemList (context, {data}) {

    },
    addItem (context, {user_id, item_no, item_name, market, keyword, notification, notification_set, etc}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    INSERT IGNORE INTO ITEMS 
                    (user_id, item_no, item_name, market, keyword, notification, notification_set, etc) VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?)`;
            let queryValue = [user_id, item_no, item_name, market, keyword, notification, notification_set, etc];

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