module.exports = {
	id: {
		type: "string",
		minLength: 3,
		maxLength: 3
	},
	object: {
		type: "object",
		properties: {
		    password: {
		        type: "integer",
                min: 0
            },
            phone: {
		        type: "string",
                pattern: "^[135|138][1-9]{8}$"
            }
        },
        additionalProperties: false,
        required: ["password", "phone"]
	}
};















































