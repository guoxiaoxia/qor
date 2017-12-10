const md5 = require('../../../../../lib/md5.js');

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
                table: "r_customer_order"
            },
            {
                index: 1,
                host: "127.0.0.1",
                port: 3306,
                user: "root",
                password: "",
                database: "db_blackgold",
                table: "r_customer_order"
            }
        ],
        hashing : (id) => {
            if (this.shardings instanceof Array && this.shardings.length > 0) {
                if (typeof id === 'string'){
                    return Number(`0x${md5(id).substr(-7)}`) % this.shardings.length;
                }
                if (typeof id === 'number'){
                    return id % this.shardings[this.shardings.length];
                }
                throw new Error(`type of id(${typeof id}) is not in [string, number] set`);
            }
            throw new Error(`not storage`);
        }
    }
};



