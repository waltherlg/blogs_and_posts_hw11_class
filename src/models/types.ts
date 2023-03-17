import {ObjectId} from "mongodb";
import {Request} from "express";

export type PostTypeOutput = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}
export type PostDBType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

// type | interface | class

export type BlogTypeOutput = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
    isMembership: boolean
}
export type BlogDBType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

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

export type UserDBType = {
    _id: ObjectId
    login: string
    passwordHash: string
    passwordSalt: string
    email: string
    createdAt: string
    confirmationCode: string | null
    expirationDateOfConfirmationCode: Date | null
    isConfirmed: boolean,
    passwordRecoveryCode: string | null
    expirationDateOfRecoveryCode: Date | null
    likedComments: Array<commentsLikeType>
    likedPosts: Array<postsLikeType>
}
export type UserTypeOutput = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type CommentDBType = {
    _id:	string | ObjectId,
    parentType: string,
    parentId: string,
    content:	string
    userId:	string
    userLogin:	string
    createdAt:	string
    likesCount: number
    dislikesCount: number
    myStatus: string

}
type CommentatorInfoType = {
    userId:	string
    userLogin:	string
}
type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}
export type CommentTypeOutput = {
    id:	string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt:	string
    LikesInfo: LikesInfoType
}

export type UserDeviceDBType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expirationDate: string
}

export type UserDeviceOutputType = {
    ip: string,
    title: string | unknown | null,
    lastActiveDate: string,
    deviceId: string
}

export type RequestWithBody<B> = Request<{},{}, B>
export type RequestWithQuery<Q> = Request<{},{},{}, Q>
export type RequestWithParams<P> = Request<P>
export type RequestWithParamsAndBody<P, B> = Request<P,{},B>
export type RequestWithParamsAndQuery<P, Q> = Request<P,{},{}, Q>