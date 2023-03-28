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
        blogId: string): Promise<string> {
        let foundBlog = await this.blogsQueryRepo.getBlogByID(blogId)
        const blogName = foundBlog!.name
        const newPost = new PostDBType(
            new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            new Date().toISOString(),
            0,
            0,
            'None',
            [])
        const createdPostsId = await this.postsRepository.createPost(newPost)
        return createdPostsId
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
}
