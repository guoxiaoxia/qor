const fs = require('fs');
const md5 = require('../../lib/md5');
const Schema = require('./schema');
const Router = require('./router');
const Media = require('./media');

class RelationStorage {
	constructor(schema, router) {
		this._schema = schema;
		this._router = router;
	}

	async fetch(subjectId, objectId) {
		this._schema.validateSubjectId(subjectId);
		this._schema.validateObjectId(objectId);

		let relation = await this._getPersistenceMedia(subjectId).fetch(subjectId, objectId);
		if (relation === null) {
			return {subjectId, objectId, relation:null};
		}

		this._schema.validateRelation(relation);
		return {subjectId, objectId, relation};
	}

	async put(subjectId, objectId, relation) {
		this._schema.validateSubjectId(subjectId);
		this._schema.validateObjectId(objectId);
		this._schema.validateRelation(relation);
		await this._getPersistenceMedia(subjectId).put(subjectId, objectId, relation);
	}

	async has(subjectId, objectId) {
		this._schema.validateSubjectId(subjectId);
		this._schema.validateObjectId(objectId);

		let relation = await this._getPersistenceMedia(subjectId).fetch(subjectId, objectId);
		if (relation === null) {
			return false;
		}

		this._schema.validateRelation(relation);
		return true;
	}

	async remove(subjectId, objectId) {
		this._schema.validateSubjectId(subjectId);
		this._schema.validateObjectId(objectId);
		await this._getPersistenceMedia(subjectId).remove(subjectId, objectId);
	}

	async clear(subjectId) {
		this._schema.validateSubjectId(subjectId);
		await this._getPersistenceMedia(subjectId).clear(subjectId);
	}

	async count(subjectId) {
		this._schema.validateSubjectId(subjectId);
		return await this._getPersistenceMedia(subjectId).count(subjectId);
	}

	async ascendSearch(subjectId, property, offset = undefined, number = undefined) {
		this._schema.validateSubjectId(subjectId);
		let results = await this._getPersistenceMedia(subjectId).search(subjectId, property, 'asc', offset, number);
		results.forEach(({objectId, relation}) => {
			this._schema.validateObjectId(objectId)
			this._schema.validateRelation(relation);
		});
		return results;
	}

	async descendSearch(subjectId, property, offset = undefined, number = undefined) {
		this._schema.validateSubjectId(subjectId);
		let results = await this._getPersistenceMedia(subjectId).search(subjectId, property, 'desc', offset, number);
		results.forEach(({objectId, relation}) => {
			this._schema.validateObjectId(objectId)
			this._schema.validateRelation(relation);
		});
		return results;
	}

	_getPersistenceMedia(subjectId) {
		const mediaIndex = (this._schema.isStringSubjectId ? Number(`0x${md5(subjectId).substr(-7)}`) : subjectId) % this._router.persistences.length;
		return Media.create(this._router.persistences[mediaIndex]);
	}
}

module.exports = (module) => {
	return new RelationStorage(Schema.load(module), Router.load(module));
}
