const Mysql = require('mysql');
const MysqlPool = require('../../../lib/mysql_pool');
const Memcached = require('memcached');

class MediaMysql {
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
}

class MediaMemcache {
	constructor(connParam) {
		this._connParam = connParam;
	}

	async get(id) {
		const memcached = new Memcached(`${this._connParam.host}:${this._connParam.port}`, {retries:1});
		return await new Promise((resolve, reject) => {
			memcached.get(`${this._connParam.table}${id}`, (err, data) => {
				memcached.end();
				if (err) {
					reject(err);
					return;
				}
				if (typeof data === 'undefined') {
					resolve(null);
					return;
				}
				resolve(JSON.parse(data));
			});
		});
	}

	async set(id, object) {
		const memcached = new Memcached(`${this._connParam.host}:${this._connParam.port}`);
		return await new Promise((resolve, reject) => {
			memcached.set(`${this._connParam.table}${id}`, JSON.stringify(object), 0, (err) => {
				memcached.end();
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
	}

	async del(id) {
		const memcached = new Memcached(`${this._connParam.host}:${this._connParam.port}`);
		return await new Promise((resolve, reject) => {
			memcached.del(`${this._connParam.table}${id}`, (err) => {
				memcached.end();
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
	}
}

module.exports = class {
	static create(connParam) {
		switch (connParam.media) {
			case 'memcache':
				return new MediaMemcache(connParam);
				break;
			case 'mysql':
				return new MediaMysql(connParam);
				break;
			default:
				break;
		}
		throw new Error(`unknown media ${connParam.media}`);
	}
}
