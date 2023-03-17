import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/users-types";
import {usersService} from "../domain/users-service";
import {PasswordRecoveryModel} from "../models/users-models";
import {UserModel} from "../schemes/schemes";
import {HydratedDocument} from "mongoose";

//export const UserModel = client.db("blogsAndPosts").collection<userType>("users")

class UsersRepository {
    async save(user: HydratedDocument<UserDBType>){
        await user.save()
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

    async deleteAllUsers(): Promise<boolean>{
        const result = await UserModel.deleteMany({})
        return result.acknowledged
    }

    async getUserById(id: string): Promise<UserDBType | null> {
        if (!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const user: UserDBType | null = await UserModel.findOne({_id: _id}).lean()
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

    async newPasswordSet(_id: ObjectId, passwordSalt: string, passwordHash: string){
        let result = await UserModel.updateOne(
            {_id: _id},
            {$set:
                    {passwordHash: passwordHash,
                        passwordSalt: passwordSalt,
                        passwordRecoveryCode: null,
                        expirationDateOfRecoveryCode: null
                    }})
        return result.modifiedCount === 1
    }

    async createCommentsLikeObject(userId: string, commentsId: string, createdAt: Date, status: string){
        if (!ObjectId.isValid(userId)){
            return false
        }
        let _id = new ObjectId(userId)
        let user = await UserModel.findById({_id})
        if(!user) return null
        const newLikedComment = {commentsId, createdAt, status, }
        user.likedComments.push(newLikedComment)
        await user.save();
        return true
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
}

export const usersRepository = new UsersRepository()

// export const usersRepository = {
//
//     async save(user: HydratedDocument<UserDBType>){
//         await user.save()
//     },
//
//     async createUser(userDto: UserDBType): Promise<HydratedDocument<UserDBType>> {
//         const newUser = new UserModel(userDto)
//         await newUser.save()
//         //const result = await UserModel.insertMany(newUser)
//         // let createdUser = {
//         //     id: newUser._id.toString(),
//         //     login: newUser.login,
//         //     email: newUser.email,
//         //     createdAt: newUser.createdAt
//         // }
//         return newUser
//     },
//
//     async deleteUser(id: string): Promise<boolean>{
//         if (ObjectId.isValid(id)){
//             let _id = new ObjectId(id)
//             const result = await UserModel.deleteOne({_id: _id})
//             return result.deletedCount === 1
//         }
//         else return false
//     },
//
//     async deleteAllUsers(): Promise<boolean>{
//         const result = await UserModel.deleteMany({})
//         return result.acknowledged
//     },
//
//     async getUserById(id: string): Promise<UserDBType | null> {
//         if (!ObjectId.isValid(id)){
//             return null
//         }
//         let _id = new ObjectId(id)
//         const user: UserDBType | null = await UserModel.findOne({_id: _id}).lean()
//         if (!user){
//             return null
//         }
//         return user
//     },
//
//     async getUserByConfirmationCode(code: string): Promise<UserDBType | null> {
//         const user: UserDBType | null = await UserModel.findOne({confirmationCode: code}).lean()
//         if (!user){
//             return null
//         }
//         return user
//     },
//     async getUserByPasswordRecoveryCode(code: string){
//         const user = await UserModel.findOne({passwordRecoveryCode: code}).lean()
//         if (!user){
//             return null
//         }
//         return user
//     },
//
//     async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null>{
//         const user: UserDBType | null = await UserModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]}).lean()
//         return user
//     },
//
//     async updateConfirmation(code: string) {
//         let result = await UserModel.updateOne({code}, {$set: {isConfirmed: true, confirmationCode: null, expirationDateOfConfirmationCode: null} })
//         return result.modifiedCount === 1
//     },
//
//     async refreshConfirmationCode(refreshConfirmationData: any){
//         let result = await UserModel.updateOne({email: refreshConfirmationData.email}, {$set: {confirmationCode: refreshConfirmationData.confirmationCode, expirationDate: refreshConfirmationData.expirationDate}})
//         return result.modifiedCount === 1
//     },
//
//     async addPasswordRecoveryData(passwordRecoveryData: PasswordRecoveryModel){
//         let result = await UserModel.updateOne({email: passwordRecoveryData.email},
//             {$set:
//                     {passwordRecoveryCode: passwordRecoveryData.passwordRecoveryCode,
//                     expirationDateOfRecoveryCode: passwordRecoveryData.expirationDateOfRecoveryCode}})
//         return result.modifiedCount === 1
//     },
//
//     async newPasswordSet(_id: ObjectId, passwordSalt: string, passwordHash: string){
//         let result = await UserModel.updateOne(
//             {_id: _id},
//             {$set:
//                     {passwordHash: passwordHash,
//                     passwordSalt: passwordSalt,
//                     passwordRecoveryCode: null,
//                     expirationDateOfRecoveryCode: null
//                     }})
//         return result.modifiedCount === 1
//     },
//
//     async createCommentsLikeObject(userId: string, commentsId: string, createdAt: Date, status: string){
//         if (!ObjectId.isValid(userId)){
//             return false
//         }
//         let _id = new ObjectId(userId)
//         let user = await UserModel.findById({_id})
//         if(!user) return null
//         const newLikedComment = {commentsId, createdAt, status, }
//         user.likedComments.push(newLikedComment)
//         await user.save();
//         return true
//     },
//
//     async updateCommentsLikeObject(userId: string, commentsId: string, status: string){
//         if (!ObjectId.isValid(userId)){
//             return false
//         }
//         let _id = new ObjectId(userId)
//         let updateStatus = await UserModel.findOneAndUpdate(
//             { _id: _id, 'likedComments.commentsId': commentsId },
//             { $set: { 'likedComments.$.status': status } },
//         )
//         return true
//     },
//
//
// }