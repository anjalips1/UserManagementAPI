const {body} = require('express-validator')
const ERROR_CODES = require('../../utils/errorCodes')
const ERROR_MESSAGES = require('../../utils/errorMessages')
const userValidator =(validationType)=>{
    switch(validationType){
        case 'addUser':
            return[               
                body('name')
                    .trim()
                    .notEmpty()
                    .withMessage({
                        errorCode: ERROR_CODES.NAME_IS_REQUIRED ,
                        message : ERROR_MESSAGES.NAME_IS_REQUIRED
                    }),
                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage({
                        errorCode : ERROR_CODES.EMAIL_IS_REQUIRED,
                        message : ERROR_MESSAGES.EMAIL_IS_REQUIRED
                    })
                    .isEmail()
                    .withMessage({
                        errorCode : ERROR_CODES.INVALID_EMAIL,
                        message : ERROR_MESSAGES.INVALID_EMAIL
                    }),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage({ 
                        errorCode : ERROR_CODES.PASSWORD_IS_REQUIRED,
                        message : ERROR_MESSAGES.PASSWORD_IS_REQUIRED
                     })

            ]

        case 'login':
            return[               
                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage({
                        errorCode : ERROR_CODES.EMAIL_IS_REQUIRED,
                        message : ERROR_MESSAGES.EMAIL_IS_REQUIRED
                    })
                    .isEmail()
                    .withMessage({
                        errorCode : ERROR_CODES.INVALID_EMAIL,
                        message : ERROR_MESSAGES.INVALID_EMAIL
                    }),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage({ 
                        errorCode : ERROR_CODES.PASSWORD_IS_REQUIRED,
                        message : ERROR_MESSAGES.PASSWORD_IS_REQUIRED
                        })

            ]
        case 'updateUser':
            return[               
                body('name')
                    .trim()
                    .notEmpty()
                    .withMessage({
                        errorCode: ERROR_CODES.NAME_IS_REQUIRED ,
                        message : ERROR_MESSAGES.NAME_IS_REQUIRED
                    }),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage({ 
                        errorCode : ERROR_CODES.PASSWORD_IS_REQUIRED,
                        message : ERROR_MESSAGES.PASSWORD_IS_REQUIRED
                        })

            ]


    }
}


module.exports = {userValidator}


