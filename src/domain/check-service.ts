import {usersQueryRepo} from "../repositories/users-query-repository";


export const checkService = {
    async isUserExist(userId: string): Promise<boolean> {
        const user = await usersQueryRepo.getUserById(userId)
        return !!user;
    }
}