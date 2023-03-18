import * as bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";

export const cryptoAdapter = {

    async generateHash(password: string):Promise<string> {
        const salt = await bcrypt.genSalt(10)
        const passwordHash =  await bcrypt.hash(password, salt)
        return passwordHash
    },

    async generateHashWithExistSalt(password: string, existingSalt: string): Promise<string>{
        const passwordHash =  await bcrypt.hash(password, existingSalt)
        return passwordHash
    },

    async checkCredentials (loginOrEmail: string, password: string){
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const existingSalt = user.passwordHash.substring(0, 29);
        // console.log('salt ' + existingSalt)
        const hashOfIncomePassword = await this.generateHashWithExistSalt(password, existingSalt)
        // console.log(user.passwordHash, hashOfIncomePassword)
        if (user.passwordHash !== hashOfIncomePassword){
            return false
        }
        return user._id
    },
}
