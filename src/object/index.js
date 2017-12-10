module.exports = class {
	constructor(schema, router) {
		this._schema = schema;
		this._router = router;
	}

	async get(id) {
		this._schema.validateId(id);

		let object = await this._router.getMedia(id).get(id);

		if (object === null) {
            return null;
		}

        this._schema.validateObject(object);
        return Object.assign(object, id);
	}

	async set(id, object) {
        this._schema.validateId(id);
		this._schema.validateObject(object);

        const media = Media.create(this._router.getSharding(id));

        await media.set(id, object);
	}

	async del(id) {
		this._schema.validateId(id);
        const media = Media.create(this._router.getSharding(id));

        await media.del(id);
	}
};
