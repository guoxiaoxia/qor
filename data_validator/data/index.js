const VT = require('../').Type;

module.exports = {
    id: VT.string.length(12,12),
    object: VT.object({
        name: VT.string.pattern('^.{2,6}$'),
        gender: VT.integer.enumeration([1,2]),
        phones: VT.array(VT.string.pattern("^[135|138][1-9]{8}$")),
    })
};