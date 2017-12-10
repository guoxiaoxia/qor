const Type = require('../');
const assert = require('assert');

class TypeInteger extends Type {
    range(min, max){
        assert(
            Number.isInteger(min) && Number.isInteger(max),
            `expect string.length params([min,max]) to be integer, but got min:${typeof min} max:${typeof max}`
        );
        this._range = {min, max};
        return this;
    }

    enumeration(array){
        assert(
            typeof array === 'object' && Array.isArray(array),
            `expect string.enumeration params(pattern) to be string, but got pattern:${typeof array}`
        );
        this._enumeration = array;
        return this;
    }
}

module.exports = () => {
    return new TypeInteger();
};
