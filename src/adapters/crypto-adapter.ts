import * as bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";

type GenerateHashResponseType = {
    passwordHash: string,
    salt: string
}

export const cryptoAdapter = {
    async generateHash(password: string):Promise<GenerateHashResponseType> {
        const salt = await bcrypt.genSalt(10)
        const  passwordHash =  await bcrypt.hash(password, salt)
        return  {
            passwordHash, salt
        }
    },

    async checkCredentials (loginOrEmail: string, password: string){
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this.generateHash(password)
        if (user.passwordHash !== passwordHash.salt){
            return false
        }
        return user._id
    },
}