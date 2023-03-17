import {blogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../models/types";
import {BlogTypeOutput} from "../models/types";
import {blogsQueryRepo} from "../repositories/blog-query-repository";

export const blogsService = {

    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog: BlogDBType = {
            "_id": new ObjectId(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl,
            "createdAt": new Date().toISOString(),
            "isMembership": false
        }
        const createdBlogsId = await blogsRepository.createBlog(newBlog)
        return createdBlogsId
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return await blogsRepository.updateBlog(id, name, description, websiteUrl)
    },

    async deleteBlog(id: string): Promise<boolean>{
        return await blogsRepository.deleteBlog(id)
    },

    async deleteAllBlogs(): Promise<boolean> {
        return  await blogsRepository.deleteAllBlogs()
    },
}

