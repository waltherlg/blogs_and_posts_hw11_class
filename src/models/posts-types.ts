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
                public  likesCollection: Array<likesCollectionType>) {}
    countLikesAndDislikes() {
        return this.likesCollection.reduce((acc, post) => {
            if (post.status === "Like") {
                acc.likesCount++;
            } else if (post.status === "Dislike") {
                acc.dislikesCount++;
            }
            return acc;
        }, { likesCount: 0, dislikesCount: 0 });
    }
    getNewestLikes(){
        return this.likesCollection
            .filter(n => n.status === 'Like')
            .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
            .slice(0, 3)
    }

    getOutputType() {
        return {
            id: this._id.toString(),
            title: this.title,
            shortDescription: this.shortDescription,
            content: this.content,
            blogId: this.blogId,
            blogName: this.blogName,
            createdAt: this.createdAt,
            extendedLikesInfo: {
                likesCount: this.countLikesAndDislikes().likesCount,
                dislikesCount: this.countLikesAndDislikes().dislikesCount,
                myStatus: this.myStatus,
                newestLikes: this.getNewestLikes()
            }
        }
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
    myStatus: string,
    newestLikes: Array<newestlikesOutputType>
}

type likesCollectionType = {
    addedAt: string,
    userId: string,
    login: string,
    status: string
}

type newestlikesOutputType = {
    addedAt: string,
    login: string,
    userId: string,
}