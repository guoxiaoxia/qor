module.exports = {
    type: "array",
    items: {
        type: "object",
        properties: {
            host: {type: "string"},
            port: {type: "integer"},
            user: {type: "string"},
            password: {type: "string"},
            database: {type: "string"}
        },
        additionalProperties: false,
        required: ["host", "port", "user", "password", "database"]
    },
    minItems: 1
};