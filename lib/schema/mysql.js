module.exports = {
	type: "object",
	properties: {
		media: {enum:["mysql"]},
		host: {type: "string"},
		port: {type: "integer"},
		user: {type: "string"},
		password: {type: "string"},
		database: {type: "string"}
	},
	additionalProperties: false,
	required: ["media", "host", "port", "user", "password", "database"]
};