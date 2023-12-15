const userModel = require("../models/userModel")
const ERROR_CODES = require('../utils/errorCodes')
const ERROR_MESSAGES = require('../utils/errorMessages')
const ROLES = require('../utils/userRoles')

const getAllUsers = async(req,res) => {
    try {
        const users = await userModel.find({role : ROLES.USER},'-password')
        res.send(users)
        
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        })
        
    }
}

module.exports = {
    getAllUsers
}