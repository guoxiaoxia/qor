module.exports = {
	type: "object",
	properties: {
		subject: {type: "object"},
		object: {type: "object"},
		relation: {type: "object"}
	},
	additionalProperties: false,
	required: ["subject", "object", "relation"]
};