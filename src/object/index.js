const fs = require('fs');
const md5 = require('../../lib/md5');
const Schema = require('./schema');
const Router = require('./router');
const Media = require('./media');

class ObjectStorage {
	constructor(schema, router) {
		this._schema = schema;
		this._router = router;
	}

	async get(id) {
		this._schema.validateId(id);

		const cacheMedia = this._getCacheMedia(id);
		const persistenceMedia = this._getPersistenceMedia(id);

		let object = null;
		if (cacheMedia !== null) {
			object = await cacheMedia.get(id);
		}
		if (object === null) {
			if (persistenceMedia !== null) {
				object = await persistenceMedia.get(id);
				if ((object !== null) && (cacheMedia !== null)) {
					await cacheMedia.set(id, object);
				}
			}
		}
		if (object !== null) {
			this._schema.validateObject(object);
		}
		return {id, object};
	}

	async set(id, object) {
		this._schema.validateObject(object);
		const cacheMedia = this._getCacheMedia(id);
		const persistenceMedia = this._getPersistenceMedia(id);

		if (cacheMedia !== null && persistenceMedia !== null) {
			await Promise.all([
				cacheMedia.set(id, object),
				persistenceMedia.set(id, object)
			]);
		}
		else if (cacheMedia !== null) {
			await cacheMedia.set(id, object);
		}
		else if (persistenceMedia !== null) {
			await persistenceMedia.set(id, object);
		}
	}

	async del(id) {
		this._schema.validateId(id);
		const cacheMedia = this._getCacheMedia(id);
		const persistenceMedia = this._getPersistenceMedia(id);

		if (cacheMedia !== null && persistenceMedia !== null) {
			await Promise.all([
				cacheMedia.del(id),
				persistenceMedia.del(id)
			]);
		}
		else if (cacheMedia !== null) {
			await cacheMedia.del(id);
		}
		else if (persistenceMedia !== null) {
			await persistenceMedia.del(id);
		}
	}

	_getCacheMedia(id) {
		if (!this._router.hasCache) {
			return null;
		}
		const mediaIndex = (this._schema.isStringId ? Number(`0x${md5(id).substr(-7)}`) : id) % this._router.caches.length;
		return Media.create(this._router.caches[mediaIndex]);
	}

	_getPersistenceMedia(id) {
		if (!this._router.hasPersistence) {
			return null;
		}
		const mediaIndex = (this._schema.isStringId ? Number(`0x${md5(id).substr(-7)}`) : id) % this._router.persistences.length;
		return Media.create(this._router.persistences[mediaIndex]);
	}
}

module.exports = (module) => {
	return new ObjectStorage(Schema.load(module), Router.load(module));
}
