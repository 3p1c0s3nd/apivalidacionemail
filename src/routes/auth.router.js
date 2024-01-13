const { validation } = require('../controllers/auth.controller');
const express = require('express');

const authRouter = express.Router();

/*routerName.route('/ruta')
    .get(getAll)
    .post(create);

routerName.route('/ruta/:id')
    .get(getOne)
    .delete(remove)
    .put(update);*/
authRouter.route('/auth/verify_email/:hash')
    .get(validation);

module.exports = authRouter;