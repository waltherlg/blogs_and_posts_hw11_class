
import {PostDBType, PostTypeOutput} from "../models/posts-types";
import {PaginationOutputModel} from "../models/models";
import {sort} from "../application/functions";
import {skipped} from "../application/functions";
import {PostModel} from "../schemes/schemes";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";


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
            .lean()

        let outPosts = posts.map((post: PostDBType) => {
            const newestLikes = post.likesCollection
                .filter(n => n.status === 'Like')
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .slice(0, 3)
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: post.myStatus,
                    newestLikes: newestLikes
                }
            }
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
            .lean()

        let outPosts = posts.map((post: PostDBType) => {
            const newestLikes = post.likesCollection
                .filter(n => n.status === 'Like')
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .slice(0, 3)
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: post.myStatus,
                    newestLikes: newestLikes
                }
            }
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
        const post: PostDBType | null = await PostModel.findOne({_id: _id})
        if (!post) {
            return null
        }
        const postLikesCollection = post.likesCollection
        console.log('userId ', userId)
        console.log('postLikesCollection ', postLikesCollection)

        const isUserLikePost = postLikesCollection.find(p => p.userId === userId)
        console.log('isUserLikePost ', isUserLikePost)
        if(isUserLikePost){
            post.myStatus = isUserLikePost.status
        }
        const newestLikes = post.likesCollection
            .filter(n => n.status === 'Like')
            .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
            .slice(0, 3)

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                myStatus: post.myStatus,
                newestLikes: newestLikes
            }
        }
    }
}

// export const postsQueryRepo = new PostsQueryRepo()х

