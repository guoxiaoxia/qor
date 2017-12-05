const printf = require('printf');
const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-keywords')(ajv, 'switch');
const config = require('../../../config');

const cache = new Map();

module.exports = class {
	static load(module) {
		if (!cache.has(module)) {
			cache.set(module, new this(module, `${config.srcPath}/object/${module.replace(/\./g, '/')}/router`));
		}
		return cache.get(module);
	}

	constructor(module, routerFile) {
		this._router = Object.assign({}, require(routerFile));
		if (!ajv.validate({
			type: "object",
			properties: {
				cache: {
					type: "array",
					items: require('../../../lib/schema/memcache'),
					minItems: 1
				},
				persistence: {
					type: "array",
					items: require('../../../lib/schema/mysql'),
					minItems: 1
				}
			},
			additionalProperties: false,
			anyOf: [
				{required: ["cache"]},
				{required: ["persistence"]},
				{required: ["cache", "persistence"]}
			]
		}, this._router)) {
			throw new Error(`bad router file ${routerFile}`);
		}
		if (this._router.cache instanceof Array) {
			for (let idx = 0; idx < this._router.cache.length; ++idx) {
				this._router.cache[idx].table = `o_${module.replace(/\./g, '_')}_${printf('%03d', idx)}`;
			}
		}
		if (this._router.persistence instanceof Array) {
			for (let idx = 0; idx < this._router.persistence.length; ++idx) {
				this._router.persistence[idx].table = `o_${module.replace(/\./g, '_')}_${printf('%03d', idx)}`;
			}
		}
	}

	get hasCache() {
		return (this._router.cache instanceof Array);
	}

	get hasPersistence() {
		return (this._router.persistence instanceof Array);
	}

	get caches() {
		return this._router.cache;
	}

	get persistences() {
		return this._router.persistence;
	}
}
