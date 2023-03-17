
import {ObjectId} from "mongodb";
import {BlogDBType} from "../models/types";
import {BlogTypeOutput} from "../models/types";
import {BlogModelClass} from "../schemes/schemes";


export const blogsRepository = {

    async createBlog(newBlog: BlogDBType): Promise<string> {
        const blogInstance = new BlogModelClass(newBlog)
        await blogInstance.save()
        // let createdBlog = {
        //     id: newBlog._id.toString(),
        //     name: newBlog.name,
        //     description: newBlog.description,
        //     websiteUrl: newBlog.websiteUrl,
        //     createdAt: newBlog.createdAt,
        //     isMembership: newBlog.isMembership
        // }
        return blogInstance._id.toString()
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const blogInstance = await BlogModelClass.findOne({_id: _id})
            if (!blogInstance) return false;
            blogInstance.name = name
            blogInstance.description = description
            blogInstance.websiteUrl = websiteUrl
            const result = await blogInstance.save()
            // const result = await BlogModelClass
            //     .updateOne({_id: _id},{$set: {name: name, description: description, websiteUrl: websiteUrl}})
            return !!result
        }
        else return false

    },

    async deleteBlog(id: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await BlogModelClass.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false

    },

    async deleteAllBlogs(): Promise<boolean> {
        const result = await BlogModelClass.deleteMany({})
        return result.acknowledged
    },
}


