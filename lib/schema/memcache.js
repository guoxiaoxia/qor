module.exports = {
	type: "object",
	properties: {
		media: {enum:["memcache"]},
		host: {type: "string"},
		port: {type: "integer"}
	},
	additionalProperties: false,
	required: ["media", "host", "port"]
};