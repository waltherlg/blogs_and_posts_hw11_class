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

        let outPosts = posts.map((post: PostDBType) => {
            const userPostStatus = post.likesCollection.find(p => p.userId === userId)
            if(userPostStatus){
                post.myStatus = userPostStatus.status
            }
            return post.getOutputType()
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
            return post.getOutputType()
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
        const userPostStatus = post.likesCollection.find(p => p.userId === userId)
        if(userPostStatus){
            post.myStatus = userPostStatus.status
        }
        return post.getOutputType()
    }

    // async getAllPostsByBlogsID(
    //     blogId: string,
    //     sortBy: string,
    //     sortDirection: string,
    //     pageNumber: string,
    //     pageSize: string,
    //     userId?: string) {
    //
    //     let posts = await PostModel.find({"blogId": blogId})
    //         .skip(skipped(pageNumber, pageSize))
    //         .limit(+pageSize)
    //         .sort({[sortBy]: sort(sortDirection)})
    //
    //     let outPosts = posts.map((post: PostDBType) => {
    //         const isUserLikePost = post.likesCollection.find(p => p.userId === userId)
    //         if(isUserLikePost){
    //             post.myStatus = isUserLikePost.status
    //         }
    //         const newestLikes = post.getNewestLikes()
    //         const postsLikesAndDislikes = post.countLikesAndDislikes()
    //         return {
    //             id: post._id.toString(),
    //             title: post.title,
    //             shortDescription: post.shortDescription,
    //             content: post.content,
    //             blogId: post.blogId,
    //             blogName: post.blogName,
    //             createdAt: post.createdAt,
    //             extendedLikesInfo: {
    //                 likesCount: postsLikesAndDislikes.likesCount,
    //                 dislikesCount: postsLikesAndDislikes.dislikesCount,
    //                 myStatus: post.myStatus,
    //                 newestLikes: newestLikes
    //             }
    //         }
    //     })
    //
    //     let postsCount = await PostModel.countDocuments({"blogId": blogId})
    //
    //     let pageCount = Math.ceil(+postsCount / +pageSize)
    //
    //     let outputPosts: PaginationOutputModel<PostTypeOutput>  = {
    //         pagesCount: pageCount,
    //         page: +pageNumber,
    //         pageSize: +pageSize,
    //         totalCount: postsCount,
    //         items: outPosts
    //     }
    //     return outputPosts
    // }

    // async getPostByID(id: string, userId?: string): Promise<PostTypeOutput | null> {
    //     if (!ObjectId.isValid(id)){
    //         return null
    //     }
    //     let _id = new ObjectId(id)
    //     const post: PostDBType | null = await PostModel.findOne({_id: _id})
    //     if (!post) {
    //         return null
    //     }
    //     const postLikesCollection = post.likesCollection
    //     console.log('userId ', userId)
    //     console.log('postLikesCollection ', postLikesCollection);
    //
    //     const isUserLikePost = postLikesCollection.find(p => p.userId === userId)
    //     console.log('isUserLikePost ', isUserLikePost)
    //     if(isUserLikePost){
    //         post.myStatus = isUserLikePost.status
    //     }
    //     console.log(post.myStatus)
    //     const newestLikes = post.getNewestLikes()
    //
    //     const postsLikesAndDislikes = post.countLikesAndDislikes()
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
    //             likesCount: postsLikesAndDislikes.likesCount,
    //             dislikesCount: postsLikesAndDislikes.dislikesCount,
    //             myStatus: post.myStatus,
    //             newestLikes: newestLikes
    //         }
    //     }
    // }
}


