// Middleware function for validating request data against a schema
const createValidateMiddleware = schema => {
    return function (req, res, next) {
        if (Array.isArray(req.body.datas)) {
            // Validate each item in the array
            for (let i = 0; i < req.body.datas.length; i++) {
                const { error } = schema.validate(req.body.datas[i]);
                if (error) {
                    return res
                        .status(400)
                        .json({ message: error.details[0].message });
                }
            }
        } else if (req.body.datas.newValue) {
            // Validate the "newValue" property
            const { error } = schema.validate(req.body.datas.newValue);
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message });
            }
        } else {
            // Validate the entire "datas" object
            const { error } = schema.validate(req.body.datas);
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message });
            }
        }

        // Proceed to the next middleware or route
        next();
    };
};

module.exports = { createValidateMiddleware };
