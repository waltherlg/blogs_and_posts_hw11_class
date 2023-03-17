import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostDBType} from "../models/types";
import {PostTypeOutput} from "../models/types";
import {blogsService} from "./blogs-service";
import {postsQueryRepo} from "../repositories/post-query-repository";
import {blogsQueryRepo} from "../repositories/blog-query-repository";

// class Post {
//     _id: ObjectId
//     title: string
//     shortDescription: string
//     content: string
//     blogId: string
//     blogName: string
//     createdAt: string
//
//
//
//     constructor(title: string, shortDescription: string, content: string, blogId: string) {
//         let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
//         const blogName = foundBlog!.name
//         this._id = new ObjectId()
//         this.title = title,
//         this.shortDescription = shortDescription,
//         this.content = content,
//         this.blogId = blogId,
//         this.blogName = blogName,
//         this.createdAt =  new Date().toISOString()
//
//     }
// }
export const postsService = {

    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostTypeOutput> {
        let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
        const blogName = foundBlog!.name
        const newPost: PostDBType = {
            "_id": new ObjectId(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blogName,
            "createdAt": new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(newPost)
        return createdPost
    },

    async createPostByBlogId(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostTypeOutput> {
        let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
        const blogName =  foundBlog!.name
        const newPost: PostDBType = {
            "_id": new ObjectId(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blogName,
            "createdAt": new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(newPost)
        return createdPost
    },

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },

    async deleteAllPosts(): Promise<boolean> {
        return await postsRepository.deleteAllPosts()
    },
}