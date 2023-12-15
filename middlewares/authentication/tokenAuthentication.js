require("dotenv").config();
const User=require('../../models/userModel')

const jwt=require('jsonwebtoken')
const ROLE=require('../../utils/userRoles')

const ERROR_CODES=require('../../utils/errorCodes')
const ERROR_MESSAGES=require('../../utils/errorMessages')



// Token authentication for user
const userTokenAuthentication = async (req, res, next) => {
    const token = req.headers['authorization'];
      if (!token) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.AUTH_HEADER_MISSING,
          message: ERROR_MESSAGES.AUTH_HEADER_MISSING
        }));
      }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded
      if (decoded.role !== "USER") {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
          message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
        }));
      }
      const user = await User.findOne({
          email: decoded.email,
          role : ROLE.USER
      });
      if (!user) {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.INVALID_TOKEN,
          message:ERROR_MESSAGES.INVALID_TOKEN
        }));
      }
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.TOKEN_EXPIRED,
          message:ERROR_MESSAGES.TOKEN_EXPIRED
        }));
      }else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          errorCode: ERROR_CODES.INVALID_TOKEN,
          message: ERROR_MESSAGES.INVALID_TOKEN
        });
      } else {
        return res.status(401).json({
          errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
          message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
        });
      }
    }
  };


  //token authentication for admin
const adminTokenAuthentication = async (req, res, next) => {
    const token = req.headers['authorization'];
      if (!token) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.AUTH_HEADER_MISSING,
          message: ERROR_MESSAGES.AUTH_HEADER_MISSING
        }));
      }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded
      if (decoded.role !== "ADMIN") {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
          message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
        }));
      }
      const user = await User.findOne({
          email: decoded.email,
          role : ROLE.ADMIN
      });
      if (!user) {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.INVALID_TOKEN,
          message:ERROR_MESSAGES.INVALID_TOKEN
        }));
      }
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.TOKEN_EXPIRED,
          message:ERROR_MESSAGES.TOKEN_EXPIRED
        }));
      }else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          errorCode: ERROR_CODES.INVALID_TOKEN,
          message: ERROR_MESSAGES.INVALID_TOKEN
        });
      } else {
        return res.status(401).json({
          errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
          message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
        });
      }
    }
  };

 


  module.exports={userTokenAuthentication,adminTokenAuthentication}