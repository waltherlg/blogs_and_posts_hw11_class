import {ObjectId} from "mongodb";

export class BlogDBType {
    constructor(public _id: ObjectId,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
}

export type BlogTypeOutput = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
    isMembership: boolean
}
// export type BlogDBType = {
//     _id: ObjectId,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: string,
//     isMembership: boolean
// }