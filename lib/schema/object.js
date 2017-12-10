module.exports = {
	type: "object",
	properties: {
		id: {type: "object"},
		object: {type: "object"}
	},
	additionalProperties: false,
	required: ["id", "object"]
};