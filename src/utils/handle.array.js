function fromObjToStringValues(object, keys) {
    if (!keys) {
        keys = Object.keys(object)
    }

    let rs = []
    keys.forEach(key => {
        if(`${object[key]}`.toLocaleLowerCase() != 'null')    rs.push(`'${object[key]}'`)
        else rs.push(`${object[key]}`)
    });
    return rs.join(', ')
}

function fromObjToStringKeysValues(object, keys) {
    if (!keys) {
        keys = Object.keys(object)
    }

    let rs = []
    keys.forEach(key => {
        rs.push(`${key} = '${object[key]}'`)
    });
    return rs.join(', ')
}

module.exports = {
    fromObjToStringValues,
    fromObjToStringKeysValues
}