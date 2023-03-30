
import {container} from "../compositions-root";
import {UsersRepository} from "../repositories/users-repository";

const usersRepository = container.resolve(UsersRepository)

export const checkService = {
    async isUserExist(userId: string): Promise<boolean> {
        const user = await usersRepository.getUserById(userId)
        return !!user;
    },

    async isLoginExist (login: string): Promise<boolean> {
        const loginExist = await usersRepository.findUserByLoginOrEmail(login)
        return !!loginExist;
    },

    async isConfirmationCodeExist(code: string): Promise<boolean> {
        let user = await usersRepository.getUserByConfirmationCode(code)
        return !!user;
    },

    async isEmailConfirmed(email: string): Promise<boolean> {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        return user!.isConfirmed;
    },

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await usersRepository.findUserByLoginOrEmail(email)
        return !!emailExist;
    },

    async isCodeConfirmed(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByConfirmationCode(code)
        return user!.isConfirmed;
    },

    async isRecoveryCodeExist(code: string): Promise<boolean> {
        let isExist = await usersRepository.getUserByPasswordRecoveryCode(code)
        return !!isExist;
    }
}