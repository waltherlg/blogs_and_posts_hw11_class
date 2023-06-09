import * as bcrypt from "bcrypt";

export const cryptoAdapter = {

    async generateHash(password: string):Promise<string> {
        //const salt = await bcrypt.genSalt(10)
        const passwordHash =  await bcrypt.hash(password, 10)
        return passwordHash
    },

    // async generateHashWithExistSalt(password: string, existingSalt: string): Promise<string>{
    //     const passwordHash =  await bcrypt.hash(password, existingSalt)
    //     return passwordHash
    // },

    // async checkCredentials (loginOrEmail: string, password: string): Promise<ObjectId | null>{
    //     const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    //     if (!user) return null
    //     const existingSalt = user.passwordHash.substring(0, 29);
    //     // console.log('salt ' + existingSalt)
    //     const hashOfIncomePassword = await this.generateHashWithExistSalt(password, existingSalt)
    //     // console.log(user.passwordHash, hashOfIncomePassword)
    //     if (user.passwordHash !== hashOfIncomePassword){
    //         return null
    //     }
    //     return user._id
    // },

    async comparePassword(password: string, hash: string): Promise<boolean>{
      return await bcrypt.compare(password, hash)
    },
}
