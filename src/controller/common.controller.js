const { Repository } = require('@src/entity/Repository')

async function find_controller(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity)
        let result
        result = await resultRepository.find()
        res.status(200).json(result.rawDatas)
    } catch (error) {
        next(error)
    }
}

async function add_controller(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity)
        let result
        let datas = req.body.datas
        if (datas) {
            result = await resultRepository.add(...datas)
        }
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

async function update_controller(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity)
        let result
        let datas = req.body.datas
        if (datas) {
            result = await resultRepository.update(
                datas.option,
                datas.newValue
            )
        }
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

async function delete_controller(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity)
        let result
        let datas = req.body.datas
        if (datas) {
            result = await resultRepository.delete(
                datas.option
            )
        }
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    find_controller,
    add_controller,
    update_controller,
    delete_controller
}