const Type = require('../');
const assert = require('assert');

class TypeString extends Type {
    constructor(){
        super();
        this._length = undefined;
        this._pattern = undefined;
        this._enumeration = undefined;
    }

    length(min, max){
        assert(
            Number.isInteger(min) && Number.isInteger(max),
            `expect string.length params([min,max]) to be integer, but got min:${typeof min} max:${typeof max}`
        );
        this._length = {min, max};
        return this;
    }

    pattern(pattern){
        assert(
            typeof pattern === 'string',
            `expect string.pattern params(pattern) to be string, but got pattern:${typeof pattern}`
        );
        this._pattern = new RegExp(pattern);
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

    check(data){
        if (this._length !== undefined){
            assert(
                this._length.min < data.length && this._length.max > data.length,
                `${data} length not in [${this._length.min},${this._length.max}]`
            )

        }
        if (this._pattern !== undefined){
            let reg = new RegExp(this._pattern);
            assert(
                reg.test(data),
                `${data} not match pattern ${this._pattern}`
            )
        }
        if (this._enumeration !== undefined){
            assert(
                this._enumeration.includes(data),
                `${data} not in enum[${JSON.stringify(this._enumeration)}]`
            )
        }
    }
}

module.exports = () => {
    return new TypeString();
};
