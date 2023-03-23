import {usersQueryRepo} from "../repositories/users-query-repository";
import {usersRepository} from "../compositions-root";


export const checkService = {
    async isUserExist(userId: string): Promise<boolean> {
        const user = await usersQueryRepo.getUserById(userId)
        return !!user;
    },

    async isLoginExist (login: string): Promise<boolean> {
        const loginExist = await usersRepository.findUserByLoginOrEmail(login)
        if (loginExist) return true
        else return false
    },

    async isConfirmationCodeExist(code: string){
        let user = await usersRepository.getUserByConfirmationCode(code)
        return !!user;
    },

    async isEmailConfirmed(email: string): Promise<boolean> {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (user!.isConfirmed) return true
        else return false
    },

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (emailExist) return true
        else return false
    },

    async isCodeConfirmed(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByConfirmationCode(code)
        if (user!.isConfirmed) return true
        else return false
    },

    async isRecoveryCodeExist(code: string){
        let isExist = await usersRepository.getUserByPasswordRecoveryCode(code)
        return !!isExist;
    }
}