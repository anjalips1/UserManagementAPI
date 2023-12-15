const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userModel = require('../models/userModel');
const ERROR_CODES = require('../utils/errorCodes')
const ERROR_MESSAGES = require('../utils/errorMessages')
const ROLES = require('../utils/userRoles')


//create user
const addUser = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.errors[0].msg);
        }

        //check if email alreay exists
        const userExists = await emailExists(req.body.email)
        if(userExists){
            return res.status(400).send({
                errorCode : ERROR_CODES.EMAIL_ALREADY_EXISTS,
                message : ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        let user = {
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            role : ROLES.USER,
            createdAt :  new Date()
        }
        await userModel.create(user)
        res.send({message : "User added successfully"})
        
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        })
        
    }
}


//user login
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.errors[0].msg)
    }
    try {

        //check if user exists
        const user = await emailExists(req.body.email)
        if (!user) {
            return res.status(404).json({
                errorCode: ERROR_CODES.USER_NOT_FOUND,
                message: ERROR_MESSAGES.USER_NOT_FOUND
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            const token = generateAccessToken(user.id,
                user.email,
                user.role == ROLES.USER ? "USER" : "ADMIN" ,
            );

            const refreshToken = generateRefreshToken(
                user.id,
                user.email,
                user.role == ROLES.USER ? "USER" : "ADMIN" ,
                
            );

            res.status(200).json({
                Name: user.name,
                email: user.email,
                role: user.role == ROLES.USER ? "USER" : "ADMIN",
                accessToken: token,
                refreshToken: refreshToken
            });

        } else {
            return res.status(400).json({
                errorCode: ERROR_CODES.INCORRECT_PASSWORD,
                message: ERROR_MESSAGES.INCORRECT_PASSWORD
            })
        }
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        })
    }
};


// GENERATE ACCESSTOKEN
function generateAccessToken(id, email, role) {
    return jwt.sign(
        { id: id, email: email, role: role },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1h',
        }
    );
}

// GENERATE REFERSHTOKEN
function generateRefreshToken(id, email, role) {
    return jwt.sign(
        { id: id, email: email, role: role },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );
}

async function emailExists(email) {
    const user = await userModel.findOne({
        email: email
    });
    return user
} 

const updateUser = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.errors[0].msg)
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        let user = {
            name : req.body.name,
            password : hashedPassword
        }
        await userModel.findByIdAndUpdate(req.user.id,user)
        res.send({message : "User updated successfully"})
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        })
        
    }
}

const deleteUser = async(req,res) => {
    try {
        await userModel.findByIdAndDelete(req.user.id)
        res.send({message : "User deleted successfully"})
        
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        })
        
    }
}

module.exports = {
    addUser,
    login,
    updateUser,
    deleteUser
}