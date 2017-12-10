const MysqlPool = require('../../../lib/mysql_pool');
const Mysql = require('mysql');

module.exports = class {
	constructor(connParam) {
		this._connParam = connParam;
	}

	async get(id) {
		const sql = Mysql.format('SELECT data FROM ?? WHERE ??=?', [this._connParam.table, 'id', id]);
		const mysql = await MysqlPool.fetch(this._connParam);
		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				if (rows.length < 1) {
					resolve(null);
					return;
				}
				resolve(JSON.parse(rows[0].data));
			});
		});
	}

	async set(id, object) {
		const sql = Mysql.format('REPLACE INTO ?? SET ??=?, ??=?', [this._connParam.table, 'id', id, 'data', JSON.stringify(object)]);
		const mysql = await MysqlPool.fetch(this._connParam);
		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}

	async del(id) {
		const sql = Mysql.format('DELETE FROM ?? WHERE ??=?', [this._connParam.table, 'id', id]);
		const mysql = await MysqlPool.fetch(this._connParam);

		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
};
