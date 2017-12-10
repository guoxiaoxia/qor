module.exports = {
	id: {
		type: "string",
		minLength: 19,
		maxLength: 19
	},
	object: {
		type: "object",
		properties: {
            card: {
                $ref: "card"
            }
		},
		additionalProperties: false,
		required: ["card", "promotion"]
	}
};
