import {Request, Response, Router} from "express";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {blogsControllerInstance} from "../compositions-root";

import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/types";

export const blogsRouter = Router({})

import {
    contentValidation,
    nameValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {descriptionValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {websiteUrlValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {
    CreateBlogModel, CreatePostModel,
    RequestBlogsQueryModel, RequestPostsByBlogsIdQueryModel,
    UpdateBlogModel,
    URIParamsBlogModel,
    URIParamsIDBlogModel
} from "../models/models";
import {blogsQueryRepo} from "../repositories/blog-query-repository";
import {postsQueryRepo} from "../repositories/post-query-repository";

export class BlogsController {
    constructor(protected blogsService: BlogsService, protected postsService: PostsService) {
    }
    async getAllBlogs(req: RequestWithQuery<RequestBlogsQueryModel>, res: Response) {
        try {
            let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm : ''
            let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
            let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
            let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
            let pageSize = req.query.pageSize ? req.query.pageSize : '10'
            const allBlogs = await blogsQueryRepo.getAllBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
            res.status(200).send(allBlogs);
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response) {
        try {
            const newBlogsId = await this.blogsService.createBlog(
                req.body.name,
                req.body.description,
                req.body.websiteUrl)
            const newBlog = await blogsQueryRepo.getBlogByID(newBlogsId)
            res.status(201).send(newBlog)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async createPostByBlogsId(req: RequestWithParamsAndBody<URIParamsIDBlogModel, CreatePostModel>, res: Response) {
        try {
            let foundBlog = await blogsQueryRepo.getBlogByID(req.params.blogId)
            if (!foundBlog) {
                res.sendStatus(404)
            } else {
                const newPost = await this.postsService.createPostByBlogId(
                    req.body.title,
                    req.body.shortDescription,
                    req.body.content,
                    req.params.blogId.toString())
                res.status(201).send(newPost)
            }
        } catch (error) {
            res.status(500).send(`controller :blogId/post error: ${(error as any).message}`)
        }
    }

    async getBlogById(req: RequestWithParams<URIParamsBlogModel>, res: Response) {
        try {
            let foundBlog = await blogsQueryRepo.getBlogByID(req.params.id.toString())
            if (foundBlog) {
                res.status(200).send(foundBlog)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(500).send(`controller get blog by id error: ${(error as any).message}`)
        }
    }

    async getAllPostsByBlogsId(req: RequestWithParamsAndQuery<URIParamsBlogModel, RequestPostsByBlogsIdQueryModel>, res: Response) {
        let foundBlog = await blogsQueryRepo.getBlogByID(req.params.id.toString()) // check is blog exist
        if (!foundBlog) {
            res.sendStatus(404)
        } else {
            try {
                let blogId = req.params.id.toString()
                let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
                let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
                let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
                let pageSize = req.query.pageSize ? req.query.pageSize : '10'
                let foundPosts = await postsQueryRepo.getAllPostsByBlogsID(blogId, sortBy, sortDirection, pageNumber, pageSize)
                if (foundPosts) {
                    res.status(200).send(foundPosts)
                }
            } catch (error) {
                res.status(500).send(error)
            }
        }
    }

    async deleteBlogById(req: RequestWithParams<URIParamsBlogModel>, res: Response) {
        try {
            const isDeleted = await this.blogsService.deleteBlog(req.params.id)
            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.status(500).send(`controller delete blog by id error: ${(error as any).message}`)
        }
    }

    async updateBlogById(req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response) {
        try {
            const updateBlog = await this.blogsService.updateBlog(
                req.params.id,
                req.body.name,
                req.body.description,
                req.body.websiteUrl)
            if (updateBlog) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(500).send(`controller update blog by id error: ${(error as any).message}`)
        }
    }
}

blogsRouter.get('/',
    blogsControllerInstance.getAllBlogs.bind(blogsControllerInstance))

blogsRouter.post('/',
    basicAuthMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsControllerInstance.createBlog.bind(blogsControllerInstance))

blogsRouter.post('/:blogId/posts',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    blogsControllerInstance.createPostByBlogsId.bind(blogsControllerInstance))

blogsRouter.get('/:id',
    blogsControllerInstance.getBlogById.bind(blogsControllerInstance))

blogsRouter.get('/:id/posts',
    blogsControllerInstance.getAllPostsByBlogsId.bind(blogsControllerInstance))

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    blogsControllerInstance.deleteBlogById.bind(blogsControllerInstance))

blogsRouter.put('/:id',
    basicAuthMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsControllerInstance.updateBlogById.bind(blogsControllerInstance))




