module.exports = {
	Object: require('./src/object'),
	Relation: require('./src/relation'),
	config: (opts) => {
		let existingOpts = require('./config');
		Object.assign(existingOpts, opts);
	}
};