module.exports = { 
	subject: {
		type: "string",
		minLength: 32,
		maxLength: 32
	},
	object: {
		$ref: ()=> {return 'order'}
	},
	relation: {
		data: {
            type: "object",
            properties: {
                paidTime: {
                    type: "integer"
                }
            },
            additionalProperties: false,
            required: ["paidTime"]
		},
		index: ['paidTime']
	}
};

