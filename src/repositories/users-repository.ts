import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/users-types";
import {PasswordRecoveryModel} from "../models/users-models";
import {UserModel} from "../schemes/schemes";
import {HydratedDocument} from "mongoose";
import {injectable} from "inversify";

//export const UserModel = client.db("blogsAndPosts").collection<userType>("users")
@injectable()
export class UsersRepository {
    async saveUser(user: HydratedDocument<UserDBType>){
        const result = await user.save()
        return !!result
    }

    async createUser(userDto: UserDBType): Promise<HydratedDocument<UserDBType>> {
        const newUser = new UserModel(userDto)
        await newUser.save()
        return newUser
    }

    async deleteUser(id: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await UserModel.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    }

    async getUserById(id: string): Promise<HydratedDocument<UserDBType> | null> {
        if (!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const user = await UserModel.findOne({_id: _id})
        if (!user){
            return null
        }
        return user
    }

    async getUserByConfirmationCode(code: string): Promise<UserDBType | null> {
        const user: UserDBType | null = await UserModel.findOne({confirmationCode: code}).lean()
        if (!user){
            return null
        }
        return user
    }
    async getUserByPasswordRecoveryCode(code: string){
        const user = await UserModel.findOne({passwordRecoveryCode: code}).lean()
        if (!user){
            return null
        }
        return user
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null>{
        const user: UserDBType | null = await UserModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]}).lean()
        return user
    }

    async updateConfirmation(code: string) {
        let result = await UserModel.updateOne({code}, {$set: {isConfirmed: true, confirmationCode: null, expirationDateOfConfirmationCode: null} })
        return result.modifiedCount === 1
    }

    async refreshConfirmationCode(refreshConfirmationData: any){
        let result = await UserModel.updateOne({email: refreshConfirmationData.email}, {$set: {confirmationCode: refreshConfirmationData.confirmationCode, expirationDate: refreshConfirmationData.expirationDate}})
        return result.modifiedCount === 1
    }

    async addPasswordRecoveryData(passwordRecoveryData: PasswordRecoveryModel){
        let result = await UserModel.updateOne({email: passwordRecoveryData.email},
            {$set:
                    {passwordRecoveryCode: passwordRecoveryData.passwordRecoveryCode,
                        expirationDateOfRecoveryCode: passwordRecoveryData.expirationDateOfRecoveryCode}})
        return result.modifiedCount === 1
    }

    async newPasswordSet(_id: ObjectId, passwordHash: string){
        let result = await UserModel.updateOne(
            {_id: _id},
            {$set:
                    {passwordHash: passwordHash,
                        passwordRecoveryCode: null,
                        expirationDateOfRecoveryCode: null
                    }})
        return result.modifiedCount === 1
    }

    async createCommentsLikeObject(userId: string, commentsId: string, createdAt: Date, status: string): Promise<boolean>{
        if (!ObjectId.isValid(userId)){
            return false
        }
        let _id = new ObjectId(userId)
        let user = await UserModel.findOne({_id: _id})
        if(!user) {
            return false
        }
        const newLikedComment = {commentsId, createdAt, status}
        user.likedComments.push(newLikedComment)
        const result = await user.save();
        return !!result
    }

    // async createPostsLikeObject(userId: string, postsId: string, createdAt: Date, status: string): Promise<boolean>{
    //     if (!ObjectId.isValid(userId)){
    //         return false
    //     }
    //     let _id = new ObjectId(userId)
    //     let user = await UserModel.findOne({_id: _id})
    //     if(!user) {
    //         return false
    //     }
    //     const newLikedPost = {postsId, createdAt, status}
    //     user.likedPosts.push(newLikedPost)
    //     const result = await user.save();
    //     return !!result
    // }

    async isUserAlreadyLikeComment(userId: string, commentsId: string): Promise<boolean> {
        if(!ObjectId.isValid(userId)){
            return false
        }
        let _id = new ObjectId(userId)
        const isExist = await UserModel.findOne({_id: _id, likedComments: {$elemMatch: {commentsId: commentsId}}})
        return !!isExist
    }

    async isUserAlreadyLikeCPost(userId: string, postsId: string): Promise<boolean> {
        if(!ObjectId.isValid(userId)){
            return false
        }
        let _id = new ObjectId(userId)
        const isLikeExist = await UserModel.findOne({_id: _id, likedPosts: {$elemMatch: {postsId: postsId}}})
        return !!isLikeExist
    }

    async updateCommentsLikeObject(userId: string, commentsId: string, status: string){
        if (!ObjectId.isValid(userId)){
            return false
        }   
        let _id = new ObjectId(userId)
        let updateStatus = await UserModel.findOneAndUpdate(
            { _id: _id, 'likedComments.commentsId': commentsId },
            { $set: { 'likedComments.$.status': status } },
        )
        return true
    }

    async updatePostsLikeObject(userId: string, postsId: string, status: string){
        if (!ObjectId.isValid(userId)){
            return false
        }
        let _id = new ObjectId(userId)
        let updateStatus = await UserModel.findOneAndUpdate(
            { _id: _id, 'likedPosts.postsId': postsId },
            { $set: { 'likedPosts.$.status': status } },
        )
        return true
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

    async getUsersLikedPosts(userId: string){
        if(!ObjectId.isValid(userId)){
            return null
        }
        let _id = new ObjectId(userId)
        const user = await UserModel.findOne({_id: _id})
        if (!user) return null
        return user.likedPosts
    }
}
