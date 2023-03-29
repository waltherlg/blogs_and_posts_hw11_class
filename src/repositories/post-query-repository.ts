
import {PostDBType, PostTypeOutput} from "../models/posts-types";
import {PaginationOutputModel} from "../models/models";
import {sort} from "../application/functions";
import {skipped} from "../application/functions";
import {PostModel} from "../schemes/schemes";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

class PostsDBType {
}

@injectable()
export class PostsQueryRepo {

    async getAllPosts(
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let postsCount = await PostModel.countDocuments({})

        let posts = await PostModel.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .lean()

        let outPosts = posts.map((post: PostDBType) => {
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
                        newestLikes: post.newestLikes,
                }
            };
        });

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
        pageSize: string,) {

        let posts = await PostModel.find({"blogId": blogId})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .sort({[sortBy]: sort(sortDirection)})
            .lean()

        let outPosts = posts.map((posts: PostDBType) => {
            return {
                id: posts._id.toString(),
                title: posts.title,
                shortDescription: posts.shortDescription,
                content: posts.content,
                blogId: posts.blogId,
                blogName: posts.blogName,
                createdAt: posts.createdAt,
                extendedLikesInfo: {
                    likesCount: posts.likesCount,
                    dislikesCount: posts.dislikesCount,
                    myStatus: posts.myStatus,
                    newestLikes: posts.newestLikes
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

    async getPostByID(id: string): Promise<PostTypeOutput | null> {
        if (!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const post: PostDBType | null = await PostModel.findOne({_id: _id})
        if (!post) {
            return null
        }
        const newestLikes = post.newestLikes
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

// export const postsQueryRepo = new PostsQueryRepo()