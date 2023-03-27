
import {checkUsersRepo, container} from "../compositions-root";
import {BlogsQueryRepo} from "../repositories/blog-query-repository";
import {UsersQueryRepo} from "../repositories/users-query-repository";

const usersQueryRepo = container.resolve(UsersQueryRepo)

export const checkService = {
    async isUserExist(userId: string): Promise<boolean> {
        const user = await usersQueryRepo.getUserById(userId)
        return !!user;
    },

    async isLoginExist (login: string): Promise<boolean> {
        const loginExist = await checkUsersRepo.findUserByLoginOrEmail(login)
        if (loginExist) return true
        else return false
    },

    async isConfirmationCodeExist(code: string){
        let user = await checkUsersRepo.getUserByConfirmationCode(code)
        return !!user;
    },

    async isEmailConfirmed(email: string): Promise<boolean> {
        const user = await checkUsersRepo.findUserByLoginOrEmail(email)
        if (user!.isConfirmed) return true
        else return false
    },

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await checkUsersRepo.findUserByLoginOrEmail(email)
        if (emailExist) return true
        else return false
    },

    async isCodeConfirmed(code: string): Promise<boolean> {
        const user = await checkUsersRepo.getUserByConfirmationCode(code)
        if (user!.isConfirmed) return true
        else return false
    },

    async isRecoveryCodeExist(code: string){
        let isExist = await checkUsersRepo.getUserByPasswordRecoveryCode(code)
        return !!isExist;
    }
}