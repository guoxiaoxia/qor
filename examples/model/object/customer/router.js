module.exports = {
    storage: {
        shardings: [
            {
                index: 0,
                host: "127.0.0.1",
                port: 3306,
                user: "root",
                password: "",
                database: "db_blackgold",
                table: "o_customer"
            }
        ],
        hashing:  (id) => {
            return this.shardings[0]
        }
    }
};



