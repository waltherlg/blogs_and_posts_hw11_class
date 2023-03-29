import {Router} from "express";
// import {blogsControllerInstance} from "../compositions-root";
import {
    contentValidation,
    descriptionValidation,
    inputValidationMiddleware,
    nameValidation,
    shortDescriptionValidation,
    titleValidation,
    websiteUrlValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {basicAuthMiddleware, optionalAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {container} from "../compositions-root";
import {BlogsController} from "../controllers/blogs-controller";

const blogsControllerInstance = container.resolve(BlogsController)
export const blogsRouter = Router({})

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
    optionalAuthMiddleware,
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




