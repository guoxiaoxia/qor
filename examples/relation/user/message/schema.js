module.exports = { 
	subjectId: {
		type: "string",
		minLength: 32,
		maxLength: 32
	},
	objectId: {
		type: "integer"
	},
	relation: {
		type: "object",
		properties: {
			createTime: {
				type: "integer",
				default: 0
			},
			replyTime: {
				type: "integer",
				default: 0
			},
			senderName: {
				type: "string",
				pattern: "^.{2,10}$",
				default: ""
			}
		},
		additionalProperties: false,
		required: ["createTime", "replyTime", "senderName"]
	}
};
