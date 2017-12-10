const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-keywords')(ajv, 'switch');

module.exports = class {
	constructor(router) {
		this._router = Object.assign({}, router);
		if (!ajv.validate(require('../../../lib/schema/router_storage.js'), this._router.storage)) {
			throw new Error(`bad router storage structure ${router}`);
		}
		if (this._router.storage instanceof Array) {

		}
	}


};
