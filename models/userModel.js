
const model = {
    checkUser (context, {id, password}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    SELECT user_id FROM USERS
                    WHERE username = ?
                    AND password = ?`;
            let queryValue = [id, password];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (rows.length > 0)
                    context.result = rows[0].user_id;

                return resolved(context);
            });
        })
    },

    joinUser (context, {id, password, email}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    INSERT IGNORE INTO USERS (username, email, password) VALUES 
                    (?, ?, ?)`;
            let queryValue = [id, email, password];

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

    getUserTel (context, {user_id}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    SELECT tel FROM USERS
                    WHERE user_id = ?`;
            let queryValue = [user_id];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (rows.length > 0)
                    context.result = rows[0].tel;

                return resolved(context);
            });
        })
    }
}

module.exports = model;