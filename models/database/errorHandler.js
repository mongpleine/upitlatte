const connectionWrapper = require("./connectionWrapper");

function errorHandler(err) {
	if (err && err.context) {
		return connectionWrapper.rollbackTransaction(err.context).then(() => {
			return Promise.reject(err.error);
		});
	} else {
		return Promise.reject(err);
	}
}

module.exports = errorHandler;
