import {UsersService} from "../domain/users-service";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/types";
import {UserInputModel, UserParamURIModel} from "../models/users-models";
import {Response} from "express";
import {UsersQueryRepo} from "../repositories/users-query-repository";
import {RequestUsersQueryModel} from "../models/models";
import {injectable} from "inversify";
@injectable()
export class UsersController {
    constructor(protected usersService: UsersService, protected usersQueryRepo: UsersQueryRepo) {
    }

    async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
        try {
            const newUserId = await this.usersService.createUser(
                req.body.login,
                req.body.password,
                req.body.email)
            const newUser = await this.usersQueryRepo.getUserById(newUserId)
            if (!newUser) {
                res.status(400).send('cant return created user')
            }
            res.status(201).send(newUser)
        } catch (error) {
            res.status(400).send(`controller create user error: ${(error as any).message}`)
        }
    }

    async deleteUser(req: RequestWithParams<UserParamURIModel>, res: Response) {
        try {
            const isUserDeleted = await this.usersService.deleteUser(req.params.id)
            if (isUserDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(400).send(`controller delete user by id error: ${(error as any).message}`)
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
            const allUsers = await this.usersQueryRepo.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
            res.status(200).send(allUsers)
        } catch (error) {
            res.status(400).send(`controller get users error: ${(error as any).message}`)
        }
    }
}