import * as bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";


export const bcryptService = {

    async createHashAndSalt(password: string){
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        return {passwordHash, passwordSalt}
    },

    async _generateHash(password: string, passwordSalt: string){
        const hash = bcrypt.hash(password, passwordSalt)
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
}