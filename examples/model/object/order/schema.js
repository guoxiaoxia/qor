module.exports = {
	id: {
		type: "string",
		minLength: 19,
		maxLength: 19
	},
	object: {
		type: "object",
        properties: {
            customer: {
                $ref: 'customer'
            },
            amount: {
                type: "integer"
            },
            type: {
                type: "integer"
            },
            oilDetail: {

            },
            rechargeDetail: {}
        },
        additionalProperties: false,
        required: ["customer", "amount", "type", "detail"]
	}
};















































