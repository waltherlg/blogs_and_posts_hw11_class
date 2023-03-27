import {PostsRepository, } from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostDBType, PostTypeOutput} from "../models/posts-types";
import {injectable} from "inversify";
import {BlogsQueryRepo} from "../repositories/blog-query-repository";
@injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository,  protected blogsQueryRepo: BlogsQueryRepo ) {
    }
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostTypeOutput> {
        let foundBlog = await this.blogsQueryRepo.getBlogByID(blogId)
        const blogName = foundBlog!.name
        const newPost = new PostDBType(
            new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            new Date().toISOString())
        const createdPost = await this.postsRepository.createPost(newPost)
        return createdPost
    }

    async createPostByBlogId(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostTypeOutput> {
        //blogService
        let foundBlog = await this.blogsQueryRepo.getBlogByID(blogId)
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
        const createdPost = await this.postsRepository.createPost(newPost)
        return createdPost
    }

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, blogId)
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }

    async deleteAllPosts(): Promise<boolean> {
        return await this.postsRepository.deleteAllPosts()
    }
}

// export const postsService = {
//
//     async createPost(
//         title: string,
//         shortDescription: string,
//         content: string,
//         blogId: string): Promise<PostTypeOutput> {
//         let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
//         const blogName = foundBlog!.name
//         const newPost = new PostDBType(
//             new ObjectId(),
//             title,
//             shortDescription,
//             content,
//             blogId,
//             blogName,
//             new Date().toISOString())
//         const createdPost = await postsRepository.createPost(newPost)
//         return createdPost
//     },
//
//     async createPostByBlogId(
//         title: string,
//         shortDescription: string,
//         content: string,
//         blogId: string): Promise<PostTypeOutput> {
//         let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
//         const blogName =  foundBlog!.name
//         const newPost: PostDBType = {
//             "_id": new ObjectId(),
//             "title": title,
//             "shortDescription": shortDescription,
//             "content": content,
//             "blogId": blogId,
//             "blogName": blogName,
//             "createdAt": new Date().toISOString()
//         }
//         const createdPost = await postsRepository.createPost(newPost)
//         return createdPost
//     },
//
//     async updatePost(
//         id: string,
//         title: string,
//         shortDescription: string,
//         content: string,
//         blogId: string): Promise<boolean> {
//         return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
//     },
//
//     async deletePost(id: string): Promise<boolean> {
//         return await postsRepository.deletePost(id)
//     },
//
//     async deleteAllPosts(): Promise<boolean> {
//         return await postsRepository.deleteAllPosts()
//     },
// }