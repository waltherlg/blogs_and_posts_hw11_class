import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/types";
import {UserInputModel, UserParamURIModel} from "../models/users-models";
import {usersService} from "../domain/users-service";
import {basicAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {
    emailValidation,
    inputValidationMiddleware,
    loginValidation, passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {RequestUsersQueryModel} from "../models/models";
import {usersRepository} from "../repositories/users-repository";
import {usersQueryRepo} from "../repositories/users-query-repository";

export const usersRouter = Router({})

export class UsersController {
    async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
        try {
            const newUserId = await usersService.createUser(
                req.body.login,
                req.body.password,
                req.body.email)
            const newUser = await usersQueryRepo.getUserById(newUserId)
            if (!newUser) {
                res.sendStatus(500)
            }
            res.status(201).send(newUser)
        } catch (error) {
            res.status(500).send(`controller create user error: ${(error as any).message}`)
        }
    }

    async deleteUser(req: RequestWithParams<UserParamURIModel>, res: Response) {
        try {
            const isUserDeleted = await usersService.deleteUser(req.params.id)
            if (isUserDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(500).send(`controller delete user by id error: ${(error as any).message}`)
        }
    }

    async getUsers(req: RequestWithQuery<RequestUsersQueryModel>, res: Response) {
        try {
            let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
            let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
            let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
            let pageSize = req.query.pageSize ? req.query.pageSize : '10'
            let searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm : ''
            let searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm : ''
            const allUsers = await usersQueryRepo.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
            res.status(200).send(allUsers)
        } catch (error) {
            res.status(500).send(`controller get users error: ${(error as any).message}`)
        }
    }
}

export const usersControllerInstance = new UsersController()

usersRouter.post('/',
    basicAuthMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    usersControllerInstance.createUser)

usersRouter.delete('/:id',
    basicAuthMiddleware,
    usersControllerInstance.deleteUser)

usersRouter.get('/',
    basicAuthMiddleware,
    usersControllerInstance.getUsers)


// usersRouter.post('/',
//     basicAuthMiddleware,
//     loginValidation,
//     passwordValidation,
//     emailValidation,
//     inputValidationMiddleware,
//     async (req: RequestWithBody<UserInputModel>, res: Response) => {
//         try {
//             const newUserId = await usersService.createUser(
//                 req.body.login,
//                 req.body.password,
//                 req.body.email)
//             const newUser = await usersQueryRepo.getUserById(newUserId)
//             if (!newUser) {
//                 res.sendStatus(500)
//             }
//             res.status(201).send(newUser)
//         } catch (error) {
//             res.status(500).send(`controller create user error: ${(error as any).message}`)
//         }
//     });
//
// usersRouter.delete('/:id',
//     basicAuthMiddleware,
//     async (req: RequestWithParams<UserParamURIModel>, res: Response) => {
//         try {
//             const isUserDeleted = await usersService.deleteUser(req.params.id)
//             if (isUserDeleted) {
//                 res.sendStatus(204)
//             } else {
//                 res.sendStatus(404)
//             }
//         } catch (error) {
//             res.status(500).send(`controller delete user by id error: ${(error as any).message}`)
//         }
//     })
//
// usersRouter.get('/',
//     basicAuthMiddleware,
//     async (req: RequestWithQuery<RequestUsersQueryModel>, res: Response) => {
//         try {
//             let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
//             let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
//             let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
//             let pageSize = req.query.pageSize ? req.query.pageSize : '10'
//             let searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm : ''
//             let searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm : ''
//             const allUsers = await usersQueryRepo.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
//             res.status(200).send(allUsers)
//         } catch (error) {
//             res.status(500).send(`controller get users error: ${(error as any).message}`)
//         }
//
//     })