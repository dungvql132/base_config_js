const { getManyToOne, getManyToMany, getOneToMany } = require("@src/utils/entityQuery")
const { type } = require('@src/common/entity.common')

class BaseEntity{
    setData(data){
        let primanys = []
        Object.keys(this).forEach(key => {
            if(this[key].type && (this[key].type == type.primitive || this[key].type == type.many2one)){
                this[key].value = data[key.toLocaleLowerCase()]
            }

            if(this[key].isPrimany){
                primanys.push(key)
            }

            if(typeof this[key] === 'object'){
                this[key]['parent'] = this
            }

            if(this[key].type == type.many2one){
                this[key]['get'] = getManyToOne
            }

            if(this[key].type == type.many2many){
                this[key]['get'] = getManyToMany
            }

            if(this[key].type == type.one2many){
                this[key]['get'] = getOneToMany
            }
        });
        this.primanys = primanys
    }
}

module.exports = {
    BaseEntity
}