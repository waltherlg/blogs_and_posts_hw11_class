import {PostDBType, PostTypeOutput} from "../models/posts-types";
import {PaginationOutputModel} from "../models/models";
import {skipped, sort} from "../application/functions";
import {PostModel} from "../schemes/schemes";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {HydratedDocument} from "mongoose";


@injectable()
export class PostsQueryRepo {

    async getAllPosts(
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,
        userId?: string) {

        let postsCount = await PostModel.countDocuments({})

        let posts = await PostModel.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)

        let outPosts = posts.map((post: HydratedDocument<PostDBType>) => {
            const userPostStatus = post.likesCollection.find(p => p.userId === userId)
            if(userPostStatus){
                post.myStatus = userPostStatus.status
            }
            // const postClassInstance = new PostDBType(post._id, post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt, post.likesCount, post.dislikesCount, post.myStatus, post.likesCollection)
            // return postClassInstance.getOutputType()
            return post.preparePostForOutput()
        })

        let pageCount = Math.ceil(+postsCount / +pageSize)

        let outputPosts: PaginationOutputModel<PostTypeOutput> = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: outPosts
        }
        return outputPosts
    }

    async getAllPostsByBlogsID(
        blogId: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,
        userId?: string) {

        let posts = await PostModel.find({"blogId": blogId})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .sort({[sortBy]: sort(sortDirection)})

        let outPosts = posts.map((post: PostDBType) => {
            const userPostStatus = post.likesCollection.find(p => p.userId === userId)
            if(userPostStatus){
                post.myStatus = userPostStatus.status
            }
            // const postClassInstance = new PostDBType(post._id, post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt, post.likesCount, post.dislikesCount, post.myStatus, post.likesCollection)
            // return postClassInstance.getOutputType()
            return post.preparePostForOutput()
        })
        let postsCount = await PostModel.countDocuments({"blogId": blogId})
        let pageCount = Math.ceil(+postsCount / +pageSize)
        let outputPosts: PaginationOutputModel<PostTypeOutput>  = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: outPosts
        }
        return outputPosts
    }

    async getPostByID(id: string, userId?: string): Promise<PostTypeOutput | null> {
        if (!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const post: HydratedDocument<PostDBType> | null = await PostModel.findOne({_id: _id})
        if (!post) {
            return null
        }
        if(userId){
            const userPostStatus = post.likesCollection.find(p => p.userId === userId)
            if(userPostStatus){
                post.myStatus = userPostStatus.status
            }
        }
        // const postClassInstance = new PostDBType(post._id, post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt, post.likesCount, post.dislikesCount, post.myStatus, post.likesCollection)
        // return postClassInstance.getOutputType()
        return post.preparePostForOutput()
        //return this.preparePostForOutput(post)
    }

    // preparePostForOutput(post: PostDBType, userId?: string) {
    //
    //     const likesAndDislikes = post.likesCollection.reduce((acc, post) => {
    //         if (post.status === "Like") {
    //             acc.likesCount++;
    //         } else if (post.status === "Dislike") {
    //             acc.dislikesCount++;
    //         }
    //         return acc;
    //     }, {likesCount: 0, dislikesCount: 0});
    //
    //     const newestLikes = post.likesCollection
    //         .filter(n => n.status === 'Like')
    //         .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    //         .slice(0, 3)
    //
    //     const newestLikesForOutput = newestLikes.map((newestLikes) => {
    //         return {
    //             addedAt: newestLikes.addedAt,
    //             login: newestLikes.login,
    //             userId: newestLikes.userId
    //         }
    //     })
    //
    //     return {
    //         id: post._id.toString(),
    //         title: post.title,
    //         shortDescription: post.shortDescription,
    //         content: post.content,
    //         blogId: post.blogId,
    //         blogName: post.blogName,
    //         createdAt: post.createdAt,
    //         extendedLikesInfo: {
    //             likesCount: likesAndDislikes.likesCount,
    //             dislikesCount: likesAndDislikes.dislikesCount,
    //             myStatus: post.myStatus,
    //             newestLikes: newestLikesForOutput
    //         }
    //     }
    // }
}


