"use strict";

const mysql = require("mysql");
const credentials = require("../../config/credencial");
// const region = require("../../../config/region/region_credentials.json");

// 기존의 mysql 객체를 변환하고
const MysqlPoolBooster = require("mysql-pool-booster");
const newmysql = MysqlPoolBooster(mysql);
const ConnectionWrapper = require("./Connection");

const clusterConfig = {
	canRetry: true,
	removeNodeErrorCount: 10, // 연결이 실패하면 즉시 노드를 제거합니다.
	restoreNodeTimeout: 100,
	defaultSelector: "RR"
};

const poolCluster = newmysql.createPoolCluster(clusterConfig);

// let opts = credentials.mysql.nodes;
// for (const key in region) {
// 	opts[key] = region[key];
// }

// for (const key in opts) {
// 	poolCluster.add(key, opts[key]);
// }

const dbPool = mysql.createPool(credentials.database);

module.exports = {
	getConnection: key => {
		return new Promise((resolve, reject) => {
			const pool = poolCluster.of(key, "RR");

			pool.getConnection((err, connection) => {
				if (err) {
					return reject(err);
				}

				return resolve(new ConnectionWrapper(connection));
			});
		});
	},
	getWritePool: key => {
		return new Promise((resolve, reject) => {
			const writePool = poolCluster.of(key, "RR");

			return resolve(writePool);
		});
	},
	getReadPool: key => {
		return new Promise((resolve, reject) => {
			const readPool = poolCluster.of(key, "RR");

			return resolve(readPool);
		});
	},
	getDbPool: () => {
		return new Promise((resolve, reject) => {
			return resolve(dbPool);
		});
	}
};
