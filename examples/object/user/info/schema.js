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
				default: "ray"
			},
			age: {
				type: "integer",
				default: 18
			},
			isMarried: {
				type: "boolean",
				default: false
			},
			statistic: {
				type: "object",
				properties: {
					loginTimes: {
						type: "integer",
						default: 0
					},
					logoutTimes: {
						type: "integer",
						default: 0
					}
				},
				required: ["loginTimes", "logoutTimes"]
			}
		},
		additionalProperties: false,
		required: ["name", "age", "isMarried", "statistic"]
	}
};