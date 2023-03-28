import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/users-types";
import {UsersRepository} from "../repositories/users-repository";
import {UsersQueryRepo,} from "../repositories/users-query-repository";
import {cryptoAdapter} from "../adapters/crypto-adapter";
import {injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(protected usersRepository: UsersRepository, protected usersQueryRepo: UsersQueryRepo) {
    }
    async createUser(login: string, password: string, email: string): Promise<string> {

        const passwordHash = await cryptoAdapter.generateHash(password)

        const userDTO = new UserDBType(
            new ObjectId(),
            login,
            passwordHash,
            email,
            new Date().toISOString(),
            null,
            null,
            true,
            null,
            null,
            [],
            [])

        const newUser = await this.usersRepository.createUser(userDTO)
        return newUser._id.toString()
    }

    async currentUserInfo(userId: string){
        const user = await this.usersQueryRepo.getUserById(userId)
        if (!user) {
            return null
        }
        return {
            email: user.email,
            login: user.login,
            userId
        }
    }

    async getUserById(id: string): Promise<UserDBType | null> {
        return await this.usersRepository.getUserById(id)
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await this.usersRepository.findUserByLoginOrEmail(email)
        if (emailExist) return true
        else return false
    }
}
