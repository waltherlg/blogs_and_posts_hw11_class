import {Router} from "express";
//import {postsControllerInstance} from "../compositions-root";
import {
    commentContentValidation,
    contentValidation,
    existBlogIdValidation,
    inputValidationMiddleware, likeStatusValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authMiddleware, basicAuthMiddleware, optionalAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {container} from "../compositions-root";
import {PostsController} from "../controllers/posts-controller";

const postsControllerInstance = container.resolve(PostsController)
export const postsRouter = Router({})

postsRouter.get('/',
    optionalAuthMiddleware,
    postsControllerInstance.getAllPosts.bind(postsControllerInstance))

postsRouter.get('/:postId',
    optionalAuthMiddleware,
    postsControllerInstance.getPostById.bind(postsControllerInstance))

postsRouter.post('/',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    existBlogIdValidation,
    inputValidationMiddleware,
    postsControllerInstance.createPost.bind(postsControllerInstance))

postsRouter.post('/:postId/comments',
    authMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    postsControllerInstance.createCommentByPostId.bind(postsControllerInstance))

postsRouter.get('/:postId/comments',
    optionalAuthMiddleware,
    postsControllerInstance.getCommentsByPostId.bind(postsControllerInstance))

postsRouter.put('/:postId',
    basicAuthMiddleware,
    existBlogIdValidation,
    shortDescriptionValidation,
    titleValidation,
    contentValidation,
    inputValidationMiddleware,
    postsControllerInstance.updatePostById.bind(postsControllerInstance))

postsRouter.delete('/:postId',
    basicAuthMiddleware,
    postsControllerInstance.deletePostById.bind(postsControllerInstance))

postsRouter.put('/:postsId/like-status',
    authMiddleware,
    likeStatusValidation,
    inputValidationMiddleware,
    postsControllerInstance.setLikeStatusForPost.bind(postsControllerInstance))