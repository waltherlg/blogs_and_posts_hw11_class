import {Request, Response, Router} from "express";
import {CommentsService} from "../domain/comment-service";
import {authMiddleware, optionalAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {isUserOwnerOfComments} from "../middlewares/other-midlevares";
import {
    commentContentValidation,
    likeStatusValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {commentsQueryRepo} from "../repositories/comments-query-repository";
import {jwtService} from "../application/jwt-service";
import {commentsControllerInstance} from "../compositions-root";
import {LikeService} from "../domain/like-service";

export const commentsRouter = Router({})

export class CommentsController {
    constructor(protected commentsService: CommentsService, protected likeService: LikeService) {
    }
    async getCommentById(req: Request & {userId?: string}, res: Response) {
        try {
            let foundComment = await commentsQueryRepo.getCommentById(req.params.id.toString(), req.userId)
            if (foundComment) {
                res.status(200).send(foundComment)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(500).send(`controller get comment by id error: ${(error as any).message}`)
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
            res.status(500).send(`controller delete comment by id error: ${(error as any).message}`)
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
            res.status(500).send(`controller update comment by id error: ${(error as any).message}`)
        }
    }

    async setLikeStatusForComment(req: Request, res: Response) {
        try {
            const isCommentExist = await commentsQueryRepo.getCommentById(req.params.commentsId.toString())
            if (!isCommentExist) {
                res.sendStatus(404)
            }
            const token = req.headers.authorization!.split(' ')[1]
            const userId = await jwtService.getUserIdFromRefreshToken(token)
            let updateCommentLike = await this.likeService.updateCommentLike(
                userId,
                req.params.commentsId.toString(),
                req.body.likeStatus)
            if (updateCommentLike) {
                res.sendStatus(201)
            } else res.status(400).send('not like')
        } catch (error) {
            res.status(500).send(`controller comment like status error: ${(error as any).message}`)
        }
    }
}

commentsRouter.get('/:id',
    optionalAuthMiddleware,
    commentsControllerInstance.getCommentById)

commentsRouter.delete('/:commentId',
    authMiddleware,
    isUserOwnerOfComments,
    commentsControllerInstance.deleteCommentById)

commentsRouter.put('/:commentId',
    authMiddleware,
    isUserOwnerOfComments,
    commentContentValidation,
    inputValidationMiddleware,
commentsControllerInstance.updateCommentById)

commentsRouter.put('/:commentsId/like-status',
    authMiddleware,
    likeStatusValidation,
    inputValidationMiddleware,
commentsControllerInstance.setLikeStatusForComment)

//
//GET return comment by id
// commentsRouter.get('/:id',
//     async (req: Request, res: Response) => {
//         try {
//             let foundComment = await commentsQueryRepo.getCommentById(req.params.id.toString())
//             if (foundComment) {
//                 res.status(200).send(foundComment)
//             } else {
//                 res.sendStatus(404)
//             }
//         } catch (error) {
//             res.status(500).send(`controller get comment by id error: ${(error as any).message}`)
//         }
//     })

// commentsRouter.delete('/:commentId',
//     authMiddleware,
//     isUserOwnerOfComments,
//     async (req: Request, res: Response) => {
//         try {
//             let isDeleted = await commentService.deleteComment(req.params.commentId.toString())
//             if (isDeleted) {
//                 res.sendStatus(204)
//             } else {
//                 res.sendStatus(404)
//             }
//         } catch (error) {
//             res.status(500).send(`controller delete comment by id error: ${(error as any).message}`)
//         }
//     })

// commentsRouter.put('/:commentId',
//     authMiddleware,
//     isUserOwnerOfComments,
//     commentContentValidation,
//     inputValidationMiddleware,
//     async (req: Request, res: Response) => {
//         try {
//             let updateComment = await commentService.updateComment(
//                 req.params.commentId.toString(),
//                 req.body.content)
//
//             if (updateComment) {
//                 res.sendStatus(204)
//             } else {
//                 res.sendStatus(404)
//             }
//         } catch (error) {
//             res.status(500).send(`controller update comment by id error: ${(error as any).message}`)
//         }
//     })

// commentsRouter.put('/:commentsId/like-status',
//     authMiddleware,
//     likeStatusValidation,
//     inputValidationMiddleware,
//     async (req: Request, res: Response) => {
//     try {
//         const isCommentExist = await commentsQueryRepo.getCommentById(req.params.commentsId.toString())
//         if (!isCommentExist) {
//             res.sendStatus(404)
//         }
//         const token = req.headers.authorization!.split(' ')[1]
//         const userId = await jwtService.getUserIdFromRefreshToken(token)
//         let updateCommentLike = await likeService.updateCommentLike(
//             userId,
//             req.params.commentsId.toString(),
//             req.body.likeStatus)
//         if (updateCommentLike){
//             res.sendStatus(201)
//         }
//         else res.status(400).send('not like')
//     }
//     catch (error) {
//         res.status(500).send(`controller comment like status error: ${(error as any).message}`)
//     }
//     }
// )