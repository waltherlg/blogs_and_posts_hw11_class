import {ObjectId} from "mongodb";
import {UserDBType, UserTypeOutput} from "../models/users-types";
import {UsersRepository} from "../repositories/users-repository";
import {usersQueryRepo} from "../repositories/users-query-repository";
import {cryptoAdapter} from "../adapters/crypto-adapter";


export class UsersService {
    constructor(protected usersRepository: UsersRepository) {
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
        const user = await usersQueryRepo.getUserById(userId)
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

    async deleteAllUsers(): Promise<boolean>{
        return await this.usersRepository.deleteAllUsers()
    }

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await this.usersRepository.findUserByLoginOrEmail(email)
        if (emailExist) return true
        else return false
    }
}
