const pool = require("./newPoolGenerator");

const connectionWrapper = {
	init: function () {},
	getWriteConnection: function (key) {
		return pool.getWritePool(key).then(connectionWrapper.getConnection);
	},
	getReadConnection: function (key) {
		return pool.getReadPool(key).then(connectionWrapper.getConnection);
	},
	getDbConnection: function () {
		return pool.getDbPool().then(connectionWrapper.getConnection);
	},

	getConnection: function (pool) {
		return new Promise(function (resolved, rejected) {
			// console.log('getConnection!');
			pool.getConnection(function (err, connection) {
				if (err) {
					const error = new Error(err);
					error.status = 500;
					return rejected(error);
				}

				return resolved({ connection: connection });
			});
		});
	},

	connBeginTransaction: function (context) {
		// console.log('beginTransaction!');
		return new Promise(function (resolved, rejected) {
			context.connection.beginTransaction(function (err) {
				if (err) {
					const error = new Error("에러 발생");
					error.status = 500;
					return rejected(error);
				}

				return resolved(context);
			});
		});
	},

	commitTransaction: function (context) {
		// console.log('commitConnection!');
		return new Promise(function (resolved, rejected) {
			context.connection.commit(function (err) {
				if (err) {
					const error = new Error("에러 발생");
					error.status = 500;
					return rejected(error);
				}
				self.releaseConnection(context);
				return resolved(context.result);
			});
		});
	},

	rollbackTransaction: function (context) {
		return new Promise(function (resolved, rejected) {
			context.connection.rollback();
			context.connection.release();
			return resolved(context);
		});
	},

	releaseConnection: function (context) {
		// console.log('releaseConnection!');
		return new Promise(function (resolved, rejected) {
			context.connection.release();
			return resolved(context);
		});
	}
};

const self = connectionWrapper;

module.exports = connectionWrapper;
