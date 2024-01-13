const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const EmailCode = require('../models/EmailCode');
const jwt = require('jsonwebtoken');

const getAll = catchError(async(req, res) => {
    const { id } = req.user;
    const results = await User.findAll( { where: { id } } );
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { email, password, firstName, lastName, country, image } = req.body;
    const crypter_password = await bcrypt.hash(password, 10);
    const result1 = await User.create({
        email,
        password: crypter_password,
        firstName,
        lastName,
        country,
        image
    });

    const hash = require('crypto').randomBytes(32).toString('hex');
    const result2 = await EmailCode.create({
        code: hash,
        userId: result1.id
    });
    
    const frontBaseUrl = process.env.FRONT_BASE_URL;
    const emailBody = `
        <h1>Verificar Correo</h1>
        <ul>
            <li>Debes verificar tu correo antes de poder continuar</li>
            <li><a href="${frontBaseUrl}/auth/verify_email/${hash}">Verificar</a></li>
        </ul>
    `;
    console.log(emailBody);
    
    await sendEmail({
        //from: process.env.EMAIL,//Quien enviamos
        to: email,//A donde enviamos
        subject: "Verificar Correo",
        html: emailBody
    });
    return res.status(201).json({message:"Cuenta Creada Exitosamente"});
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});


const login = catchError(async(req, res) => {
    const { email, password } = req.body;
    const result = await User.findOne({ where: { email } });
    if(!result) return res.sendStatus(401);
    const match = await bcrypt.compare(password, result.password);
    if(!match) return res.sendStatus(401);
    const isVerified = result.isVerified;
    if(!isVerified) return res.sendStatus(401);
    const token = jwt.sign(
        { result },
        process.env.TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    return res.json({result, token});

});


const getLogginUser = catchError(async(req, res) => {
    const { id } = req.user;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result); 
});



module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}