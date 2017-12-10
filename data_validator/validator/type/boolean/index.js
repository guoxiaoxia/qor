const Type = require('../');

class TypeBoolean extends Type {
    check(data){
        assert(
            typeof data === 'boolean',
            `${data} is not boolean`
        );
    }
}

module.exports = () => {
    return new TypeBoolean();
};

