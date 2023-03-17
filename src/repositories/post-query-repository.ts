
import {PostDBType, PostTypeOutput} from "../models/types";
import {PaginationOutputModel} from "../models/models";
import {sort} from "../application/functions";
import {skipped} from "../application/functions";
import {PostModel} from "../schemes/schemes";
import {ObjectId} from "mongodb";

export const postsQueryRepo = {

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

        let outPosts = posts.map((posts: PostDBType) => {
            return {
                id: posts._id.toString(),
                title: posts.title,
                shortDescription: posts.shortDescription,
                content: posts.content,
                blogId: posts.blogId,
                blogName: posts.blogName,
                createdAt: posts.createdAt
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

    },

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
                createdAt: posts.createdAt
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
    },

    async getPostByID(id: string): Promise<PostTypeOutput | null> {
        if (!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const post: any | null = await PostModel.findOne({_id: _id})
        if (!post) {
            return null
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    },





}