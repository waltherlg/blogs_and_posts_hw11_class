
import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {blogsQueryRepo} from "../../repositories/blog-query-repository";
import {checkService} from "../../domain/check-service";



export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const  errors = validationResult(req);
    if (!errors.isEmpty()){
        let errorsMessages = {errorsMessages: errors.array().map( x => {
                    return x.msg
        })};
        return res.status(400).send(errorsMessages);
    }
    else {
        next();
    }
}

// validation for user
export const loginValidation = body('login')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "write your login", "field": "login" })
    .notEmpty().bail().withMessage({"message": "login is empty", "field": "login"})
    .isString().bail().withMessage({"message": "login is not string", "field": "login" })
    .trim().bail().withMessage({"message": "login is not string", "field": "login" })
    .isLength({min: 3, max: 10}).bail().withMessage({"message": "wrong length login", "field": "login" })
    .matches('^[a-zA-Z0-9_-]*$').bail().withMessage({"message": "wrong symbols in login", "field": "login" })
    .custom(async value => {
        const isLoginExist = await checkService.isLoginExist(value)
        if (isLoginExist) throw new Error
    }).bail().withMessage({"message": "login already exist", "field": "login" })

export const passwordValidation = body('password')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "write your password", "field": "password" })
    .notEmpty().bail().withMessage({"message": "password is empty", "field": "password"})
    .isString().bail().withMessage({"message": "password is not string", "field": "password" })
    .trim().bail().withMessage({"message": "password is not string", "field": "password" })
    .isLength({min: 6, max: 20}).bail().withMessage({"message": "wrong length password", "field": "password" })

export const newPasswordValidation = body('newPassword')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "write your password", "field": "newPassword" })
    .notEmpty().bail().withMessage({"message": "password is empty", "field": "newPassword"})
    .isString().bail().withMessage({"message": "newPassword is not string", "field": "newPassword" })
    .trim().bail().withMessage({"message": "password is not string", "field": "newPassword" })
    .isLength({min: 6, max: 20}).bail().withMessage({"message": "wrong length password", "field": "newPassword" })

export const emailValidation = body('email')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "write your email", "field": "email" })
    .notEmpty().bail().withMessage({"message": "email is empty", "field": "email"})
    .isString().bail().withMessage({"message": "email is not string", "field": "email" })
    .trim().bail().withMessage({"message": "email is not string", "field": "email" })
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().withMessage({"message": "wrong symbols in email", "field": "email" })
    .custom(async value => {
        const isEmailExist = await checkService.isEmailExist(value)
        if (isEmailExist) throw new Error
    }).bail().withMessage({"message": "email already using", "field": "email" })

export const emailValidationForRecovery = body('email')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "write your email", "field": "email" })
    .notEmpty().bail().withMessage({"message": "email is empty", "field": "email"})
    .isString().bail().withMessage({"message": "email is not string", "field": "email" })
    .trim().bail().withMessage({"message": "email is not string", "field": "email" })
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().withMessage({"message": "wrong symbols in email", "field": "email" })

export const emailResendingValidation = body('email')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "write your email", "field": "email" })
    .notEmpty().bail().withMessage({"message": "email is empty", "field": "email"})
    .isString().bail().withMessage({"message": "email is not string", "field": "email" })
    .trim().bail().withMessage({"message": "email is not string", "field": "email" })
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().withMessage({"message": "wrong symbols in email", "field": "email" })
    .custom(async value => {
        const isEmailExist = await checkService.isEmailExist(value)
        if (!isEmailExist) throw new Error
    }).bail().withMessage({"message": "email not exist", "field": "email" })
    .custom(async value => {
        const isEmailConfirmed = await checkService.isEmailConfirmed(value)
        if (isEmailConfirmed) throw new Error
    }).bail().withMessage({"message": "email already confirmed", "field": "email" })

export const confirmationCodeValidation = body('code')
    .exists().bail().withMessage({message: "wright code", field: "code" })
    .isString().bail().withMessage({"message": "code is not string", "field": "code" })
    .trim().bail().withMessage({message: "code is not string", field: "code" })
    .custom(async value => {
        const isCodeExist = await checkService.isConfirmationCodeExist(value)
        if (!isCodeExist) throw new Error
    }).bail().withMessage({"message": "confirmation code not exist", "field": "code" })
    .custom(async value => {
        const isCodeConfirmed = await checkService.isCodeConfirmed(value)
        if (isCodeConfirmed) throw new Error
    }).bail().withMessage({"message": "already Confirmed", "field": "code" })

export const passwordRecoveryCodeValidation = body('recoveryCode')
    .exists().bail().withMessage({message: "wright code", field: "recoveryCode" })
    .isString().bail().withMessage({"message": "recoveryCode is not string", "field": "recoveryCode" })
    .trim().bail().withMessage({message: "code is not string", field: "recoveryCode" })
    .custom(async value => {
        const isCodeExist = await checkService.isRecoveryCodeExist(value)
        if (!isCodeExist) throw new Error
    }).bail().withMessage({"message": "recovery code not exist", "field": "recoveryCode" })

// validation for blog
export const nameValidation = body('name')
    .exists({checkFalsy: true, checkNull: true}).bail().withMessage({"message": "name not exist", "field": "name" })
    .notEmpty().bail().withMessage({"message": "name is empty", "field": "name"})
    .isString().bail().withMessage({"message": "name is not string", "field": "name" })
    .trim().bail().withMessage({"message": "name is not string", "field": "name" })
    .isLength({min: 1, max: 15}).bail().withMessage({"message": "wrong length name", "field": "name" })

export const descriptionValidation = body('description')
    .exists().bail().withMessage({"message": "description not exist", "field": "description" })
    .isString().bail().withMessage({"message": "description is not string", "field": "description" })
    .trim().bail().withMessage({"message": "description is not string", "field": "description" })
    .isLength({min: 1, max: 500}).bail().withMessage({"message": "wrong length description", "field": "description" })

export const websiteUrlValidation = body('websiteUrl')
    .exists().bail().withMessage({"message": "websiteUrl not exist", "field": "websiteUrl" })
    .isString().bail().withMessage({"message": "websiteUrl is not string", "field": "websiteUrl" })
    .trim().bail().withMessage({"message": "websiteUrl is not string", "field": "websiteUrl" })
    .isLength({min: 1, max: 100}).bail().withMessage({"message": "wrong length websiteUrl", "field": "websiteUrl" })
    .isURL().bail().withMessage({"message": "wrong websiteUrl", "field": "websiteUrl" })
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage({"message": "websiteUrl is not a valid website", "field": "websiteUrl" });

// validations for post
export const titleValidation = body('title')
    .exists().bail().withMessage({message: "title not exist", field: "title" })
    .isString().bail().withMessage({"message": "title is not string", "field": "title" })
    .trim().bail().withMessage({message: "title is not string", field: "title" })
    .isLength({min: 1, max: 30}).bail().withMessage({message: "title wrong length", field: "title" })

export const shortDescriptionValidation = body('shortDescription')
    .exists().bail().withMessage({message: "shortDescription not exist", field: "shortDescription" })
    .isString().bail().withMessage({"message": "shortDescription is not string", "field": "shortDescription" })
    .trim().bail().withMessage({message: "shortDescription is not string", field: "shortDescription" })
    .isLength({min: 1, max: 100}).bail().withMessage({message: "shortDescription wrong length", field: "shortDescription" })

export const contentValidation = body('content')
    .exists().bail().withMessage({message: "content not exist", field: "content" })
    .isString().bail().withMessage({"message": "content is not string", "field": "content" })
    .trim().bail().withMessage({message: "content is not string", field: "content" })
    .isLength({min: 1, max: 1000}).bail().withMessage({message: "wrong content", field: "content" })

export const existBlogIdValidation = body('blogId')
    .exists().bail().withMessage({message: "is not a string", field: "blogId" })
    .isString().bail().withMessage({"message": "blogId is not string", "field": "blogId" })
    .trim().bail().withMessage({message: "wrong blogId", field: "blogId" })
    .custom(async value => {
        const isBlogIdExist = await blogsQueryRepo.getBlogByID(value)
        if (!isBlogIdExist) throw new Error
        return true
    }).withMessage({"message": "blogId not exist", "field": "blogId" })

export const likeStatusValidation = body('likeStatus')
    .exists().bail().withMessage({message: "is not a string", field: "likeStatus" })
    .isString().bail().withMessage({"message": "like is not string", "field": "likeStatus" })
    .trim().bail().withMessage({message: "wrong blogId", field: "likeStatus" })
    .custom(value => {
        if (value !== 'None' && value !== 'Like' && value !== 'Dislike'){
            throw new Error
        }
        return true;
    }).withMessage({"message": "like has wrong format", "field": "likeStatus" })

export const commentContentValidation = body('content')
    .exists().bail().withMessage({message: "content not exist", field: "content" })
    .isString().bail().withMessage({"message": "content is not string", "field": "content" })
    .trim().bail().withMessage({message: "content is not string", field: "content" })
    .isLength({min: 20, max: 300}).bail().withMessage({message: "wrong content length", field: "content" })