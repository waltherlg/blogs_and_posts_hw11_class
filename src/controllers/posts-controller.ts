// GET Returns All posts
import {PostsService} from "../domain/posts-service";
import {CommentsService} from "../domain/comment-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/types";
import {
    CreateCommentModel,
    CreatePostModel,
    RequestCommentsByPostIdQueryModel,
    RequestPostsQueryModel,
    UpdatePostModel,
    URIParamsCommentModel,
    URIParamsPostModel
} from "../models/models";
import {Request, Response} from "express";
import {PostsQueryRepo} from "../repositories/post-query-repository";
import {PostTypeOutput} from "../models/posts-types";
import {CommentsQueryRepo} from "../repositories/comments-query-repository";
import {injectable} from "inversify";
import {jwtService} from "../application/jwt-service";
import {LikeService} from "../domain/like-service";
@injectable()
export class PostsController {
    constructor(protected postsService: PostsService,
                protected commentService: CommentsService,
                protected likeService: LikeService,
                protected postsQueryRepo: PostsQueryRepo,
                protected commentsQueryRepo: CommentsQueryRepo) {
    }

    async getAllPosts(req: RequestWithQuery<RequestPostsQueryModel> & { userId?: string }, res: Response) {
        try {
            let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
            let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
            let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
            let pageSize = req.query.pageSize ? req.query.pageSize : '10'
            const allPosts = await this.postsQueryRepo.getAllPosts(sortBy, sortDirection, pageNumber, pageSize, req.userId)
            res.status(200).send(allPosts);
        } catch (error) {
            res.status(400).send(`controller get all posts error: ${(error as any).message}`)
        }
    }

    async getPostById(req: RequestWithParams<URIParamsPostModel>  & { userId?: string }, res: Response) {
        try {
            let foundPost = await this.postsQueryRepo.getPostByID(req.params.postId.toString(), req.userId)
            if (foundPost) {
                res.status(200).send(foundPost)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(400).send(`controller get post by id error: ${(error as any).message}`)
        }
    }

    async createPost(req: RequestWithBody<CreatePostModel>, res: Response<PostTypeOutput>) {
        try {
            const newPostId = await this.postsService.createPost(
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.body.blogId)
            const newPost = await this.postsQueryRepo.getPostByID(newPostId)
            if(!newPost){
                res.sendStatus(400)
                return
            }
            res.status(201).send(newPost)
        } catch (error) {
            res.sendStatus(400)
        }
    }

    async createCommentByPostId(req: RequestWithParamsAndBody<URIParamsCommentModel, CreateCommentModel>, res: Response) {
        try {
            let foundPost = await this.postsQueryRepo.getPostByID(req.params.postId.toString())
            if (!foundPost) {
                res.sendStatus(404)
                return
            }
            const newCommentId = await this.commentService.createComment(
                req.params.postId,
                req.body.content,
                req.userId)
            const newComment = await this.commentsQueryRepo.getCommentById(newCommentId)
            res.status(201).send(newComment)
        } catch (error) {
            res.status(400).send(`controller create comment by post id error: ${(error as any).message}`)
        }
    }

    async getCommentsByPostId(req: RequestWithParamsAndQuery<URIParamsPostModel & { userId?: string }, RequestCommentsByPostIdQueryModel>, res: Response) {
        try {
            const foundPost = await this.postsQueryRepo.getPostByID(req.params.postId.toString())
            if (!foundPost) {
                res.sendStatus(404)
            } else {
                let postId = req.params.postId.toString()
                let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
                let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
                let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
                let pageSize = req.query.pageSize ? req.query.pageSize : '10'
                let foundComments = await this.commentsQueryRepo.getAllCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize, req.userId)
                if (foundComments) {
                    res.status(200).send(foundComments)
                }
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async updatePostById(req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) {
        try {
            const updatePost = await this.postsService.updatePost(
                req.params.postId,
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.body.blogId)
            if (updatePost) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(500).send(`controller update post by id error: ${(error as any).message}`)
        }
    }

    async deletePostById(req: RequestWithParams<URIParamsPostModel>, res: Response) {
        try {
            const isDeleted = await this.postsService.deletePost(req.params.postId)
            if (isDeleted) {
                return res.sendStatus(204)
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.status(500).send(`controller delete post by id error: ${(error as any).message}`)
        }
    }

    async setLikeStatusForPost(req: Request, res: Response) {
        try {
            const post = await this.postsQueryRepo.getPostByID(req.params.postsId.toString())
            if (!post) {
                res.sendStatus(404)
                return
            }
            const userId = req.userId
            console.log('user id in controller ', userId)

            let updatePostLike = await this.likeService.updatePostLike(
                userId,
                req.params.postsId.toString(),
                req.body.likeStatus)
            if (updatePostLike) {
                return res.sendStatus(204)
            } else {
                return res.status(400).send('not like')
            }
        } catch (error) {
            return res.status(405).send(`controller post like status error: ${(error as any).message}`)
        }
    }
}