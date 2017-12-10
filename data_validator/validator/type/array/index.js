const Type = require('../');
const assert = require('assert');

class TypeArray extends Type {
    constructor(item) {
        super();
        assert(item instanceof Type, 'bad array type');
    }

    check(data){
        assert(
            typeof data === 'object' && Array.isArray(data),
            `${data} is not array`
        )
    }
}

module.exports = (item) => {
    return new TypeArray(item);
};
