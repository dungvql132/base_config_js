async function checkRule_middlewere(req, res, next) {
    try {
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    checkRule_middlewere
};
