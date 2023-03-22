import {UserDBType, UserTypeOutput} from "../models/users-types";
import {usersRepository} from "./users-repository";
import {PaginationOutputModel} from "../models/models";
import {UserModel} from "../schemes/schemes";
import {ObjectId} from "mongodb";
import {tr} from "date-fns/locale";
import {HydratedDocument} from "mongoose";

function sort(sortDirection: string) {
    return (sortDirection === 'desc') ? -1 : 1;
}

function skipped(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * (+pageSize);
}

export class UsersQueryRepo {

    async getAllUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,
        searchLoginTerm: string,
        searchEmailTerm: string,) {

        let usersCount = await UserModel.countDocuments({$or: [{login: new RegExp(searchLoginTerm, "gi")}, {email: new RegExp(searchEmailTerm, "gi")}]})
        //let usersCount = await usersCollection.countDocuments({})

        let users = await UserModel.find({$or: [{login: new RegExp(searchLoginTerm, "gi")}, {email: new RegExp(searchEmailTerm, "gi")}]})
            //let users = await usersCollection.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .lean()

        let outUsers = users.map((users) => {
            return {
                id: users._id.toString(),
                login: users.login,
                email: users.email,
                createdAt: users.createdAt
            }
        })

        let pageCount = Math.ceil(usersCount / +pageSize)

        let outputUsers: PaginationOutputModel<UserTypeOutput> = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: usersCount,
            items: outUsers
        }
        return outputUsers
    }

    async getUserById(id: string): Promise<UserTypeOutput | null> {
        const user = await UserModel.findOne({_id: new ObjectId(id)}).lean()

        if(!user) {
            return null
        }

        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    async isUserAlreadyLikeComment(userId: string, commentsId: string): Promise<boolean> {
        if(!ObjectId.isValid(userId)){
            return false
        }
        let _id = new ObjectId(userId)
        const isExist = await UserModel.findOne({_id: _id, likedComments: {$elemMatch: {commentsId: commentsId}}})
        return !!isExist
    }

    async getUsersLikedComments(userId: string){
        if(!ObjectId.isValid(userId)){
            return null
        }
        let _id = new ObjectId(userId)
        const user = await UserModel.findOne({_id: _id})
        if (!user) return null
        return user.likedComments
    }
}

export const usersQueryRepo = new UsersQueryRepo()