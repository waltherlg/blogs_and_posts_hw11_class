import {ObjectId} from "mongodb";

type commentsLikeType = {
    commentsId: string
    createdAt: Date
    status: string
}

type postsLikeType = {
    postsId: string
    createdAt: Date
    status: string
}

export class UserDBType {
    constructor(
        public _id: ObjectId,
        public login: string,
        public passwordHash: string,
        public passwordSalt: string,
        public email: string,
        public createdAt: string,
        public confirmationCode: string | null,
        public expirationDateOfConfirmationCode: Date | null,
        public isConfirmed: boolean,
        public passwordRecoveryCode: string | null,
        public expirationDateOfRecoveryCode: Date | null,
        public likedComments: Array<commentsLikeType>,
        public likedPosts: Array<postsLikeType>) {}
}

export type UserTypeOutput = {
    id: string
    login: string
    email: string
    createdAt: string
}