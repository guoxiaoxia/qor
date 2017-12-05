const Mysql = require('mysql');
const MysqlPool = require('../../../lib/mysql_pool');

class MediaMysql {
	constructor(connParam) {
		this._connParam = connParam;
	}

	async count(subjectId) {
		const sql = Mysql.format('SELECT count(*) as num FROM ?? WHERE ??=?', [this._connParam.table, 'subjectId', subjectId]);
		const mysql = await MysqlPool.fetch(this._connParam);
		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve(parseInt(rows[0].num));
			});
		});
	}

	async fetch(subjectId, objectId) {
		const sql = Mysql.format('SELECT * FROM ?? WHERE ??=? AND ??=?', [this._connParam.table, 'subjectId', subjectId, 'objectId', objectId]);
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
				let row = rows[0];
				delete row['subjectId'];
				delete row['objectId'];
				resolve(row);
			});
		});
	}

	async put(subjectId, objectId, relation) {
		let sqlArr = [];
		let dataArr = [this._connParam.table];
		for (let [name, value] of Object.entries(Object.assign({subjectId, objectId}, relation))) {
			sqlArr.push('??=?');
			dataArr.push(name, value);
		}
		const sql = Mysql.format('REPLACE INTO ?? SET ' + sqlArr.join(','), dataArr);
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

	async clear(subjectId) {
		const sql = Mysql.format('DELETE FROM ?? WHERE ??=?', [this._connParam.table, 'subjectId', subjectId]);
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

	async remove(subjectId, objectId) {
		const sql = Mysql.format('DELETE FROM ?? WHERE ??=? AND ??=?', [this._connParam.table, 'subjectId', subjectId, 'objectId', objectId]);
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

	async search(subjectId, property, order, offset, number) {
		let preparedSql = `SELECT * FROM ?? WHERE \`subjectId\`=? ORDER BY ?? ${order === 'asc' ? 'ASC' : 'DESC'}`;
		let params = [this._connParam.table, subjectId, property];
		if ((typeof number === 'number') && (typeof offset === 'number')) {
			preparedSql += " LIMIT ?,?";
			params.push(offset);
			params.push(number);
		}
		else if (typeof number === 'number') {
			preparedSql += " LIMIT ?";
			params.push(number);
		}
		else if (typeof offset === 'number') {
			preparedSql += " LIMIT ?,9999999999999";
			params.push(offset);
		}
		const sql = Mysql.format(preparedSql, params);
		const mysql = await MysqlPool.fetch(this._connParam);

		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				let results = rows.map((row) => {
					let objectId = row.objectId;
					delete row.objectId;
					delete row.subjectId;
					return {
						subjectId,
						objectId: objectId,
						relation: row
					};
				});
				resolve(results);
			});
		});
	}
}

module.exports = class {
	static create(connParam) {
		switch (connParam.media) {
			case 'mysql':
				return new MediaMysql(connParam);
				break;
			default:
				break;
		}
		throw new Error(`unknown media ${connParam.media}`);
	}
}