const Ajv = require('ajv');
const config = require('../../../config');
const ajv = new Ajv();
require('ajv-keywords')(ajv, 'switch');

const cache = new Map();

module.exports = class {
	static load(module) {
		if (!cache.has(module)) {
			cache.set(module, new this(module, `${config.srcPath}/relation/${module.replace(/\./g, '/')}/schema`));
		}
		return cache.get(module);
	}

	constructor(module, schemaFile) {
		this._schema = require(schemaFile);
		this._validateSubjectId = ajv.compile(this._schema.subjectId);
		this._validateObjectId = ajv.compile(this._schema.objectId);
		this._validateRelation = ajv.compile(this._schema.relation);
	}

	get isStringSubjectId() {
		return this._schema.subjectId.type === 'string';
	}

	get isIntegerSubjectId() {
		return this._schema.subjectId.type === 'integer';
	}

	get isStringObjectId() {
		return this._schema.objectId.type === 'string';
	}

	get isIntegerObjectId() {
		return this._schema.objectId.type === 'integer';
	}

	get subjectId() {
		return this._schema.subjectId;
	}

	get objectId() {
		return this._schema.objectId;
	}

	get relation() {
		return this._schema.relation;
	}

	validateSubjectId(subjectId) {
		if (!this._validateSubjectId(subjectId)) {
			throw new Error(`failed to validate subjectId(${subjectId}) against schema(${JSON.stringify(this._schema.subjectId)})\n${ajv.errorsText(this._validateSubjectId.errors)}`);
		}
	}

	validateObjectId(objectId) {
		if (!this._validateObjectId(objectId)) {
			throw new Error(`failed to validate objectId($objectId) against schema(${JSON.stringify(this._schema.objectId)})\n${ajv.errorsText(this._validateObjectId.errors)}`);
		}
	}

	validateRelation(relation) {
		if (!this._validateRelation(relation)) {
			throw new Error(`failed to validate relation(${JSON.stringify(relation)}) against schema(${JSON.stringify(this._schema.relation)})\n${ajv.errorsText(this._validateRelation.errors)}`);
		}
	}
}
