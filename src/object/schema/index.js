const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-keywords')(ajv, 'switch');

module.exports = class {
	constructor(module, schema) {
		this._schema = schema;
		this._validateId = ajv.compile(this._schema.id);
		this._validateObject = ajv.compile(this._schema.object);
	}

	validateId(id) {
		if (!this._validateId(id)) {
			throw new Error(`failed to validate id(${id}) against schema(${JSON.stringify(this._schema.id)})\n${ajv.errorsText(this._validateId.errors)}`);
		}
	}

	validateObject(object) {
		if (!this._validateObject(object)) {
			throw new Error(`failed to validate object(${JSON.stringify(object)}) against schema(${JSON.stringify(this._schema.object)})\n${ajv.errorsText(this._validateObject.errors)}`);
		}
	}
};
