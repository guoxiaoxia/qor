const Ajv = require('ajv');
const config = require('../../../config');
const ajv = new Ajv({
	useDefaults: true
});
require('ajv-keywords')(ajv, 'switch');

const cache = new Map();

module.exports = class {
	static load(module) {
		if (!cache.has(module)) {
			cache.set(module, new this(module, `${config.srcPath}/object/${module.replace(/\./g, '/')}/schema`));
		}
		return cache.get(module);
	}

	constructor(module, schemaFile) {
		this._schema = require(schemaFile);
		this._validateId = ajv.compile(this._schema.id);
		this._validateObject = ajv.compile(this._schema.object);
	}

	get isStringId() {
		return this._schema.id.type === 'string';
	}

	get isIntegerId() {
		return this._schema.id.type === 'integer';
	}

	get id() {
		return this._schema.id;
	}

	get object() {
		return this._schema.object;
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
}
