const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async(req, res) =>{
    //validation with Joi
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //check if the user already in database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch (err){
        res.status(400).send(err);
    }
})

router.post('/login', async(req, res) => {
    //validation with Joi
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    //check if the user already in database
    const user = await User.findOne({email: req.body.email});
    console.log("user is",user)
    if (!user) return res.status(400).send('Email is wrong');
    //Password check
    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if(!validPwd) return res.status(400).send('Password doesnot match');
    // jWT validation 
    const token = JWT.sign({email: user.email}, process.env.SECRET_TOKEN);
    res.header('auth-token', token).send(token);
    // res.send("Logges In!")
})

module.exports = router;