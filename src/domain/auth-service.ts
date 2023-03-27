import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/users-types";
import {UserDeviceDBType} from "../models/types";
import {v4 as uuid4} from 'uuid'
import add from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {jwtService} from "../application/jwt-service";
import {deviceService} from "./device-service";
import {userDeviceRepo} from "../repositories/users-device-repository";
import {cryptoAdapter} from "../adapters/crypto-adapter";
import {UsersRepository} from "../repositories/users-repository";
import {injectable} from "inversify";


const obj  = [{}]
 class nyArr {
    myArrayMethod() {

    }
 }
@injectable()
export class AuthService {
    constructor(protected usersRepository: UsersRepository) {
    }

    async checkUserCredential(loginOrEmail: string, password: string): Promise<ObjectId | null>{
        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }
        const userHash = user.passwordHash
        const isPasswordValid = cryptoAdapter.comparePassword(password, userHash)
        if (!isPasswordValid) {
            return null
        }
        return user._id
    }

    async registerUser(login: string, password: string, email: string): Promise<string | null> {

        const passwordHash = await cryptoAdapter.generateHash(password)
        //const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            "_id": new ObjectId(),
            "login": login,
            passwordHash,
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
        const createdUser = await this.usersRepository.createUser(newUser)

        try {
            await emailManager.sendEmailConfirmationMessage(newUser)
        }
        catch (e) {
            await this.usersRepository.deleteUser(newUser._id.toString())
            return null
        }
        return createdUser._id.toString()
    }

    async confirmEmail(code: string): Promise<boolean>{
        let user = await this.usersRepository.getUserByConfirmationCode(code)
        if (!user) return false
        if (user.expirationDateOfConfirmationCode! > new Date()){
            let result = await this.usersRepository.updateConfirmation(code)
            return result
        }
        return false
    }

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
        let result = await this.usersRepository.refreshConfirmationCode(refreshConfirmationData)
        return result
    }

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
        let result = await this.usersRepository.addPasswordRecoveryData(passwordRecoveryData)
        return result
    }

    async newPasswordSet(newPassword: string, recoveryCode: string){
        let user = await this.usersRepository.getUserByPasswordRecoveryCode(recoveryCode)
        if (!user) return false
        if (user.expirationDateOfRecoveryCode! > new Date()){
            const passwordHash = await cryptoAdapter.generateHash(newPassword)
            let result = await this.usersRepository.newPasswordSet(user._id, passwordHash)
            return result
        }
        return false
    }

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
    }
//
    async logout(userId: string, deviceId: string): Promise<boolean>{
        const isDeviceDeleted = await deviceService.deleteUserDeviceById(userId, deviceId)
        return isDeviceDeleted
    }

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

