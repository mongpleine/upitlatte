
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
                    INSERT INTO users (username, email, password, tel, eid) VALUES 
                    (?, ?, ?, ?, ?)`;
            let queryValue = [name, email, password, tel, eid];

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    if (err.errno === 1062) {
                        let duplicateColumn = err.sqlMessage.split(" for key ")[1].replaceAll("'", "");
                        switch (duplicateColumn) {
                            case "users_eid_uindex":
                                duplicateColumn = "이미 가입된 사업자번호입니다.";
                                break;
                            case "users_tel_uindex":
                                duplicateColumn = "이미 가입된 전화번호입니다.";
                                break;
                            case "users_email_uindex":
                                duplicateColumn = "이미 가입된 이메일주소입니다."
                                break;
                        }
                        context.statusCode = 500;
                        context.errorMessage = duplicateColumn;
                        return resolved(context);
                    } else {
                        return rejected({ context, error });
                    }
                }
                if (row.affectedRows > 0) context.statusCode = 200;
                else context.statusCode = 400

                return resolved(context);
            });
        })
    },

    resetPassword (context, {eid}) {
        return new Promise((resolved, rejected) => {
            let queryString = `UPDATE users set password = 'qwer12asdf#$' WHERE eid = ?`;
            let queryValue = [eid];

            context.conn.query(queryString, queryValue, (err, row, fields) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 500;
                    return rejected({ context, error });
                }
                if (row.affectedRows > 0) {
                    context.statusCode = 200;
                    context.message = "비밀번호가 초기화되었습니다. : qwer12asdf#$"
                }
                else {
                    context.statusCode = 400;
                    context.message = "등록되지 않은 사용자입니다.";
                }

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