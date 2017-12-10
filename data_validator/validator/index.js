module.exports = class{
    static Type() {
        return {
            string: require('./type/string'),
            integer: require('./type/integer'),
            boolean: require('./type/boolean'),
            object: require('./type/object'),
            array: require('./type/array')
        }
    }
};
