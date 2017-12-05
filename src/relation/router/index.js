const printf = require('printf');
const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-keywords')(ajv, 'switch');
const config = require('../../../config');

const cache = new Map();

module.exports = class {
	static load(module) {
		if (!cache.has(module)) {
			cache.set(module, new this(module, `${config.srcPath}/relation/${module.replace(/\./g, '/')}/router`));
		}
		return cache.get(module);
	}

	constructor(module, routerFile) {
		this._router = Object.assign({}, require(routerFile));
		if (!ajv.validate({
			type: "object",
			properties: {
				persistence: {
					type: "array",
					items: require('../../../lib/schema/mysql'),
					minItems: 1
				}
			},
			additionalProperties: false,
			required: ["persistence"]
		}, this._router)) {
			throw new Error(`bad router file ${routerFile}`);
		}
		for (let idx = 0; idx < this._router.persistence.length; ++idx) {
			this._router.persistence[idx].table = `r_${module.replace(/\./g, '_')}_${printf('%03d', idx)}`;
		}
	}

	get persistences() {
		return this._router.persistence;
	}
}
