module.exports = {
	id: {
		type: "string",
		minLength: 19,
		maxLength: 19
	},
	object: {
		type: "object",
		properties: {
			oilGunNo: {
				type: "string",
				minLength: 6,
				maxLength: 6
			},
            millimeter: {
				type: "integer",
				min: 0
			}
		},
		additionalProperties: false,
		required: ["oilGunNo", "millimeter"]
	}
};
