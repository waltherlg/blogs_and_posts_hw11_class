import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/types";
import {usersRepository} from "../repositories/users-repository";
import * as bcrypt from 'bcrypt'
import {usersQueryRepo} from "../repositories/users-query-repository";
import {UserModel} from "../schemes/schemes";
import {bcryptService} from "../application/bcrypt-service";


// const getUserDto = (login: string,
//                     password: string,
//                     email: string,
//                     isConfirmed: boolean,
//                     passwordHash: string,
//                     passwordSalt: string): UserDBType => {
//     return {
//         _id: new ObjectId(),
//         "login": login,
//         passwordHash,
//         passwordSalt,
//         "email": email,
//         "createdAt": new Date().toISOString(),
//         "confirmationCode": "none",
//         "expirationDateOfConfirmationCode": new Date(),
//         "isConfirmed": true,
//         'passwordRecoveryCode': "none",
//         'expirationDateOfRecoveryCode': new Date()
//     }
//}

// export class UserClass {
//     _id: ObjectId
//     login: string
//     passwordHash: string
//     passwordSalt: string
//     email: string
//     createdAt: string
//     confirmationCode: string | null
//     expirationDateOfConfirmationCode: Date | null
//     isConfirmed: boolean
//     passwordRecoveryCode: string | null
//     expirationDateOfRecoveryCode: Date | null
//     likedComments: Array<string>
//     likedPosts: Array<string>
//     constructor (login: string, password: string, email: string) {
//         this._id = new ObjectId()
//         this.login = login
//         const {passwordHash, passwordSalt} = await bcryptService.createHashAndSalt(password);
//         this.passwordHash = passwordHash
//         this.passwordSalt = passwordSalt
//         this.email = email
//         this.createdAt = new Date().toISOString(),
//         this.confirmationCode = null
//         this.expirationDateOfConfirmationCode = null
//         this.isConfirmed = true
//         this.passwordRecoveryCode = null
//         this.expirationDateOfRecoveryCode = null
//         this.likedComments = []
//         this.likedPosts = []
//     }
// }

export const usersService = {

    async createUser(login: string, password: string, email: string): Promise<string> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            "_id": new ObjectId(),
            "login": login,
            passwordHash,
            passwordSalt,
            "email": email,
            "createdAt": new Date().toISOString(),
            "confirmationCode": null,
            "expirationDateOfConfirmationCode": null,
            "isConfirmed": true,
            'passwordRecoveryCode': null,
            'expirationDateOfRecoveryCode': null,
            'likedComments': [],
            'likedPosts': []
        }
        const createdUser = await usersRepository.createUser(newUser)
        return createdUser._id.toString()
    },

    async currentUserInfo(userId: string){
        const user = await usersQueryRepo.getUserById(userId)
        if (!user) {
            return null
        }
        return {
            email: user.email,
            login: user.login,
            userId
        }
    },

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async checkCredentials (loginOrEmail: string, password: string){
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash){
            return false
        }
        return user._id
    },

    async getUserById(id: string): Promise<UserDBType | null> {
        return await usersRepository.getUserById(id)
    },

    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },

    async deleteAllUsers(): Promise<boolean>{
        return await usersRepository.deleteAllUsers()
    },

    async isLoginExist (login: string): Promise<boolean> {
        const loginExist = await usersRepository.findUserByLoginOrEmail(login)
        if (loginExist) return true
        else return false
    },

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (emailExist) return true
        else return false
    },

    async isEmailConfirmed(email: string): Promise<boolean> {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (user!.isConfirmed) return true
        else return false
    },

    async isCodeConfirmed(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByConfirmationCode(code)
        if (user!.isConfirmed) return true
        else return false
    }
}