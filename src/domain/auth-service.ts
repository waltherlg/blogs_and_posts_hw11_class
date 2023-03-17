import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/users-types";
import {UserDeviceDBType} from "../models/types";
import {usersRepository} from "../repositories/users-repository";
import * as bcrypt from 'bcrypt'
import {v4 as uuid4} from 'uuid'
import add from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {usersService} from "./users-service";
import {jwtService} from "../application/jwt-service";
import {deviceService} from "./device-service";
import {userDeviceRepo} from "../repositories/users-device-repository";


type GenerateHashResponseType = {
    passwordHash: string,
    salt: string
}

const cryptoAdapter = {
    async generateHash(password: string):Promise<GenerateHashResponseType> {
        const salt = await bcrypt.genSalt(10)
      const  passwordHash =  await bcrypt.hash(password, salt)

        return  {
            passwordHash, salt
        }
    }
}

export const authService = {

    async registerUser(login: string, password: string, email: string): Promise<string | null> {

        const {salt, passwordHash} = await cryptoAdapter.generateHash(password)
        //const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            "_id": new ObjectId(),
            "login": login,
            passwordHash,
            passwordSalt: salt,
            "email": email,
            "createdAt": new Date().toISOString(),
            "confirmationCode": uuid4(),
            "expirationDateOfConfirmationCode": add(new Date(),{
                hours: 1
                //minutes: 3
            }),
            "isConfirmed": false,
            'passwordRecoveryCode': null,
            'expirationDateOfRecoveryCode': null,
            'likedComments': [],
            'likedPosts': []
        }
        const createdUser = await usersRepository.createUser(newUser)

        try {
            await emailManager.sendEmailConfirmationMessage(newUser)
        }
        catch (e) {
            await usersService.deleteUser(newUser._id.toString())
            return null
        }
        return createdUser._id.toString()
    },

    async confirmEmail(code: string): Promise<boolean>{
        let user = await usersRepository.getUserByConfirmationCode(code)
        if (!user) return false
        if (user.expirationDateOfConfirmationCode! > new Date()){
            let result = await usersRepository.updateConfirmation(code)
            return result
        }
        return false
    },

    async registrationEmailResending(email: string){
        const refreshConfirmationData = {
            "email": email,
            "confirmationCode": uuid4(),
            "expirationDate": add(new Date(),{
                hours: 1
                //minutes: 3
            }),
        }
        try {
            await emailManager.resendEmailConfirmationMessage(refreshConfirmationData)
        }
        catch (e) {
            return false
        }
        let result = await usersRepository.refreshConfirmationCode(refreshConfirmationData)
        return result
    },

    async passwordRecovery(email: string){
        const passwordRecoveryData = {
            "email": email,
            "passwordRecoveryCode": uuid4(),
            "expirationDateOfRecoveryCode": add(new Date(),{
                hours: 1
                //minutes: 3
            }),
        }
        try {
            await emailManager.sendPasswordRecoveryMessage(passwordRecoveryData)
        }
        catch (e) {
            return null
        }
        let result = await usersRepository.addPasswordRecoveryData(passwordRecoveryData)
        return result
    },

    async isConfirmationCodeExist(code: string){
        let user = await usersRepository.getUserByConfirmationCode(code)
        return !!user;
    },

    async newPasswordSet(newPassword: string, recoveryCode: string){
        let user = await usersRepository.getUserByPasswordRecoveryCode(recoveryCode)
        if (!user) return false
        if (user.expirationDateOfRecoveryCode! > new Date()){
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await this._generateHash(newPassword, passwordSalt)
            let result = await usersRepository.newPasswordSet(user._id, passwordSalt, passwordHash)
            return result
        }
        return false
    },

    async isRecoveryCodeExist(code: string){
        let isExist = await usersRepository.getUserByPasswordRecoveryCode(code)
        return !!isExist;
    },

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    // async isTokenExpired(refreshToken: string){
    //     const isToken = await expiredTokenRepository.findExpiredToken(refreshToken)
    //     return !!isToken
    // },

    async login(userId: ObjectId, ip: string, userAgent: string) {
        const deviceId = new ObjectId()
        const accessToken = jwtService.createJWT(userId)
        const refreshToken = await jwtService.createJWTRefresh(userId, deviceId)
        const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(refreshToken)
        const expirationDate = await jwtService.getExpirationDateFromRefreshToken(refreshToken)
        const deviceInfo: UserDeviceDBType = {
            _id: deviceId,
            userId: userId,
            ip,
            title: userAgent,
            lastActiveDate,
            expirationDate
        }
        await userDeviceRepo.addDeviceInfo(deviceInfo)
        return { accessToken, refreshToken }
    },
//
    async logout(userId: string, deviceId: string): Promise<boolean>{
        const isDeviceDeleted = await deviceService.deleteUserDeviceById(userId, deviceId)
        return isDeviceDeleted
    },

    async refreshingToken(refreshToken: string){
        const deviceId = jwtService.getDeviceIdFromRefreshToken(refreshToken)
        const userId = jwtService.getUserIdFromRefreshToken(refreshToken)
        const accessToken = jwtService.createJWT(userId)
        const newRefreshedToken = await jwtService.createJWTRefresh(userId, deviceId)
        const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(newRefreshedToken)
        const expirationDate = await jwtService.getExpirationDateFromRefreshToken(newRefreshedToken)
        await userDeviceRepo.refreshDeviceInfo(deviceId, lastActiveDate, expirationDate)
        return {accessToken, newRefreshedToken}
    }
}

