import {CommentsService} from "../domain/comment-service";
import {LikeService} from "../domain/like-service";
import {commentsQueryRepo, CommentsQueryRepo} from "../repositories/comments-query-repository";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {log} from "util";
import {injectable} from "inversify";
@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService, protected likeService: LikeService, protected commentsQueryRepo: CommentsQueryRepo) {
    }

    async getCommentById(req: Request & { userId?: string }, res: Response) {
        console.log('this.commentsQueryRepo', this.commentsQueryRepo)
        try {
            let foundComment = await this.commentsQueryRepo.getCommentById(req.params.id.toString(), req.userId)
            if (foundComment) {
                res.status(200).send(foundComment)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(400).send(`controller get comment by id error: ${(error as any).message}`)
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        try {
            let isDeleted = await this.commentsService.deleteComment(req.params.commentId.toString())
            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(400).send(`controller delete comment by id error: ${(error as any).message}`)
        }
    }

    async updateCommentById(req: Request, res: Response) {
        try {
            let updateComment = await this.commentsService.updateComment(
                req.params.commentId.toString(),
                req.body.content)

            if (updateComment) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(400).send(`controller update comment by id error: ${(error as any).message}`)
        }
    }

    async setLikeStatusForComment(req: Request, res: Response) {
        try {
            const isCommentExist = await commentsQueryRepo.getCommentById(req.params.commentsId.toString())
            console.log('isCommentExist ', isCommentExist)
            if (!isCommentExist) {
                res.sendStatus(404)
                return
            }
            const token = req.headers.authorization!.split(' ')[1]
            console.log('token ', token)
            const userId = await jwtService.getUserIdFromRefreshToken(token)
            console.log('userId ', userId)
            let updateCommentLike = await this.likeService.updateCommentLike(
                userId,
                req.params.commentsId.toString(),
                req.body.likeStatus)
            console.log('updateCommentLike ',updateCommentLike)
            if (updateCommentLike) {
                res.sendStatus(204)
            } else {
                res.status(400).send('not like')
            }
        } catch (error) {
            res.status(405).send(`controller comment like status error: ${(error as any).message}`)
        }
    }
}