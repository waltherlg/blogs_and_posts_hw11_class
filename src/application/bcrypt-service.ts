import * as bcrypt from 'bcrypt'


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


}