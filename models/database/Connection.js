class ConnectionWrapper {
	constructor(connection) {
		this.connection = connection;
	}

	beginTransaction() {
		return new Promise((resolve, reject) => {
			this.connection.beginTransaction(err => {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	}

	query(queryString) {
		return new Promise((resolve, reject) => {
			this.connection.query(queryString, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}

				resolve(rows);
			});
		});
	}

	commit() {
		return new Promise((resolve, reject) => {
			this.connection.commit(err => {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	}

	rollback() {
		return new Promise((resolve, reject) => {
			this.connection.rollback(err => {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	}

	release() {
		return new Promise((resolve) => {
			this.connection.release();
			resolve();
		});
	}
}

module.exports = ConnectionWrapper;
