import {ObjectId} from "mongodb";

export class PostDBType {
    constructor(public _id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public likesCount: number,
                public dislikesCount: number,
                public myStatus: string,
                public  newestLikes: Array<newestLikesType>
    ) {
    }
}

export type PostTypeOutput = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: extendedLikesInfoType
}

type extendedLikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    "myStatus": string,
    newestLikes: Array<newestLikesType>
}

type newestLikesType = {
    addedAt: string,
    userId: string,
    login: string
}