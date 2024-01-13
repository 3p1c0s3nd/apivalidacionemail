const catchError = require('../utils/catchError');

const enviarEmail = catchError(async(req, res) => {
    
    return res.json(/* valor a retornar */)
});

module.exports = {
    getAll
}