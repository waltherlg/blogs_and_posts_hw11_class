

import {ObjectId} from "mongodb";
import {BlogDBType, BlogTypeOutput} from "../models/blogs-types";
import {PaginationOutputModel, RequestBlogsQueryModel} from "../models/models";
import {BlogModelClass} from "../schemes/schemes";

function sort(sortDirection: string){
    return (sortDirection === 'desc') ? -1 : 1;
}

function skipped(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * (+pageSize);
}


export class BlogsQueryRepo {

    async getAllBlogs(
        searchNameTerm: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let blogsCount = await BlogModelClass.countDocuments({name: new RegExp(searchNameTerm, "gi")})

        let blogs
        if (searchNameTerm !== 'null'){
            blogs = await BlogModelClass.find({name: new RegExp(searchNameTerm, "gi")})
                .skip(skipped(pageNumber, pageSize))
                .limit(+pageSize)
                .sort({[sortBy]: sort(sortDirection)})
                .lean()
        }
        else {
            blogs = await BlogModelClass.find({})
                .skip(skipped(pageNumber, pageSize))
                .limit(+pageSize)
                .sort({[sortBy]: sort(sortDirection)})
                .lean()
        }

        let outBlogs = blogs.map((blogs: BlogDBType) => {
            return {
                id: blogs._id.toString(),
                name: blogs.name,
                description: blogs.description,
                websiteUrl: blogs.websiteUrl,
                createdAt: blogs.createdAt,
                isMembership: blogs.isMembership
            }
        })

        let pageCount = Math.ceil(blogsCount / +pageSize)

        let outputBlogs: PaginationOutputModel<BlogTypeOutput>  = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: blogsCount,
            items: outBlogs
        }
        return outputBlogs
    }

    async getBlogByID(id: string): Promise<BlogTypeOutput | null> {
        if(!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const blog: BlogDBType | null = await BlogModelClass.findOne({_id: _id}).lean()
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}

export const blogsQueryRepo = new BlogsQueryRepo()