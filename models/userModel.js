
const model = {
    checkUser (context, {email, password}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    SELECT user_id, username, eid, email, tel FROM users
                    WHERE email = ?
                    AND password = ?`;
            let queryValue = [email, password];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (rows.length > 0)
                    context.result = {
                        user_id: rows[0].user_id,
                        username: rows[0].username,
                        email: rows[0].email,
                        eid: rows[0].eid,
                        tel: rows[0].tel
                    };

                return resolved(context);
            });
        })
    },

    checkUserByCookie (context, {user_id, username, email, eid, tel}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    SELECT user_id, username, eid, email, tel FROM users
                    WHERE user_id = ?
                    AND username = ?
                      AND eid = ?
                      AND email = ?
                      AND tel = ?`;
            let queryValue = [user_id, username, eid, email, tel];

            context.conn.query(queryString, queryValue, (err, rows, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (rows.length > 0)
                    context.result = {
                        user_id: rows[0].user_id,
                        username: rows[0].username,
                        email: rows[0].email,
                        eid: rows[0].eid,
                        tel: rows[0].tel
                    };

                return resolved(context);
            });
        })
    },

    joinUser (context, {name, password, email, tel, eid}) {
        return new Promise((resolved, rejected) => {
            let queryString = `
                    INSERT IGNORE INTO users (username, email, password, tel, eid) VALUES 
                    (?, ?, ?, ?, ?)`;
            let queryValue = [name, email, password, tel, eid];

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
                    SELECT tel FROM users
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