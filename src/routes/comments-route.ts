import {Router} from "express";
import {authMiddleware, optionalAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {isUserOwnerOfComments} from "../middlewares/other-midlevares";
import {
    commentContentValidation,
    inputValidationMiddleware,
    likeStatusValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {commentsControllerInstance} from "../compositions-root";

export const commentsRouter = Router({})
console.log('commentsControllerInstance', commentsControllerInstance)

commentsRouter.get('/:id',
    optionalAuthMiddleware,
    commentsControllerInstance.getCommentById.bind(commentsControllerInstance))

commentsRouter.delete('/:commentId',
    authMiddleware,
    isUserOwnerOfComments,
    commentsControllerInstance.deleteCommentById.bind(commentsControllerInstance))

commentsRouter.put('/:commentId',
    authMiddleware,
    isUserOwnerOfComments,
    commentContentValidation,
    inputValidationMiddleware,
    commentsControllerInstance.updateCommentById.bind(commentsControllerInstance))

commentsRouter.put('/:commentsId/like-status',
    authMiddleware,
    likeStatusValidation,
    inputValidationMiddleware,
    commentsControllerInstance.setLikeStatusForComment.bind(commentsControllerInstance))
