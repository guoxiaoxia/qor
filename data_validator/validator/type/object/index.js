const Type = require('../');
const assert = require('assert');

class TypeObject extends Type {
    constructor(object) {
        super();
        Object.values(object).forEach(item => {
            assert(item instanceof Type, 'bad object type');
        })
    }

    check(data){
        assert(
            typeof data === 'object',
            `${data} is not object`
        )
    }
}

module.exports = (object) => {
    return new TypeObject(object);
};
