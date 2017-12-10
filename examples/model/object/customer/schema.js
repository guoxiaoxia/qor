module.exports = {
	id: {
		type: "string",
		minLength: 32,
		maxLength: 32
	},
	object: {
		type: "object",
		properties: {
		    name: {
		        type: "string",
                pattern: "^.{2,10}$"
            },
            gender: {
                type: "integer",
                enum: ["1", "2", "3"]
            }
        },
        additionalProperties: false,
        required: ["name", "gender"]
	}
};















































