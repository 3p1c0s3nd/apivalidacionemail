const express = require('express');
const router = express.Router();
const userRouter = require('./user.router');
const authRouter = require('./auth.router');

// colocar las rutas aquí
router.use(userRouter);
router.use(authRouter);


module.exports = router;