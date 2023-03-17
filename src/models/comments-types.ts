import {ObjectId} from "mongodb";

export class CommentDBType {
    constructor(public _id: ObjectId,
                public parentType: string,
                public parentId: string,
                public content: string,
                public userId: string,
                public userLogin: string,
                public createdAt: string,
                public likesCount: number,
                public dislikesCount: number,
                public myStatus: string) {
    }
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

// export type CommentDBType = {
//     _id:	string | ObjectId,
//     parentType: string,
//     parentId: string,
//     content:	string
//     userId:	string
//     userLogin:	string
//     createdAt:	string
//     likesCount: number
//     dislikesCount: number
//     myStatus: string
// }