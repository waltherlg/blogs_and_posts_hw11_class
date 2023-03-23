import {BlogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";
import {BlogDBType,BlogTypeOutput} from "../models/blogs-types";

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {
    }
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog = new BlogDBType(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false)
        const createdBlogsId = await this.blogsRepository.createBlog(newBlog)
        return createdBlogsId
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return await this.blogsRepository.updateBlog(id, name, description, websiteUrl)
    }

    async deleteBlog(id: string): Promise<boolean>{
        return await this.blogsRepository.deleteBlog(id)
    }

    async deleteAllBlogs(): Promise<boolean> {
        return  await this.blogsRepository.deleteAllBlogs()
    }
}