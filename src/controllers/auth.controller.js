const catchError = require('../utils/catchError');
const EmailCode = require('../models/EmailCode');
const User = require('../models/User');

const validation = catchError(async(req, res) => {
    const { hash } = req.params;
    const results = await EmailCode.findOne({ where: { code: hash } });
    if(!results) return res.sendStatus(401);
    User.update({ isVerified: true }, { where: { id: results.userId } });
    await EmailCode.destroy({ where: { userId: results.userId } });
    return res.json(results);
});

module.exports = {
    validation
}