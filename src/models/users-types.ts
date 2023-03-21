import {ObjectId} from "mongodb";

export type CommentsLikeType = {
    commentsId: string
    createdAt: Date
    status: string
}

export type PostsLikeType = {
    postsId: string
    createdAt: Date
    status: string
}

export class UserDBType {
    constructor(
        public _id: ObjectId,
        public login: string,
        public passwordHash: string,
        public email: string,
        public createdAt: string,
        public confirmationCode: string | null,
        public expirationDateOfConfirmationCode: Date | null,
        public isConfirmed: boolean,
        public passwordRecoveryCode: string | null,
        public expirationDateOfRecoveryCode: Date | null,
        public likedComments: Array<CommentsLikeType>,
        public likedPosts: Array<PostsLikeType>) {}
}

export type UserTypeOutput = {
    id: string
    login: string
    email: string
    createdAt: string
}