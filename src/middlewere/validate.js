
const createValidateMiddlewere = (schema) => {
    return function (req, res, next) {
        if (Array.isArray(req.body.datas)) {
            for (let i = 0; i < req.body.datas.length; i++) {
                const { error } = schema.validate(req.body.datas[i]);
                if (error) {
                    return res.status(400).json({ message: error.details[0].message });
                }
            }
        } else if (req.body.datas.newValue){
            const { error } = schema.validate(req.body.datas.newValue);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
        } else{
            const { error } = schema.validate(req.body.datas);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
        }

        next()
    }
};

module.exports = { createValidateMiddlewere }