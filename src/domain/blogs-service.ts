import {blogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";
import {BlogDBType,BlogTypeOutput} from "../models/blogs-types";
import {blogsQueryRepo} from "../repositories/blog-query-repository";

class BlogsService {

    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog = new BlogDBType(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false)
        const createdBlogsId = await blogsRepository.createBlog(newBlog)
        return createdBlogsId
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return await blogsRepository.updateBlog(id, name, description, websiteUrl)
    }

    async deleteBlog(id: string): Promise<boolean>{
        return await blogsRepository.deleteBlog(id)
    }

    async deleteAllBlogs(): Promise<boolean> {
        return  await blogsRepository.deleteAllBlogs()
    }
}

export const blogsService = new BlogsService()