import {Router} from "express";
import {postsControllerInstance} from "../compositions-root";
import {
    commentContentValidation,
    contentValidation,
    existBlogIdValidation,
    inputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authMiddleware, basicAuthMiddleware, optionalAuthMiddleware} from "../middlewares/basic-auth.middleware";

export const postsRouter = Router({})

postsRouter.get('/',
    postsControllerInstance.getAllPosts.bind(postsControllerInstance))

postsRouter.get('/:postId',
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


// postsRouter.get('/', async (req: RequestWithQuery<RequestPostsQueryModel>, res: Response) => {
//     try {
//         let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
//         let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
//         let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
//         let pageSize = req.query.pageSize ? req.query.pageSize : '10'
//         const allPosts = await postsQueryRepo.getAllPosts(sortBy, sortDirection, pageNumber, pageSize)
//         res.status(200).send(allPosts);
//     } catch (error) {
//         res.status(500).send(`controller get all posts error: ${(error as any).message}`)
//     }
// })

//GET return post by id
// postsRouter.get('/:postId', async (req: RequestWithParams<URIParamsPostModel>, res) => {
//     try {
//         let foundPost = await postsQueryRepo.getPostByID(req.params.postId.toString())
//         if (foundPost) {
//             res.status(200).send(foundPost)
//         } else {
//             res.sendStatus(404)
//         }
//     } catch (error) {
//         res.status(500).send(`controller get post by id error: ${(error as any).message}`)
//     }
// })

// POST add post
// postsRouter.post('/',
//     basicAuthMiddleware,
//     titleValidation,
//     shortDescriptionValidation,
//     contentValidation,
//     existBlogIdValidation,
//     inputValidationMiddleware,
//     async (req: RequestWithBody<CreatePostModel>, res: Response<PostTypeOutput>) => {
//         try {
//             const newPostResult = await postsService.createPost(
//                 req.body.title,
//                 req.body.shortDescription,
//                 req.body.content,
//                 req.body.blogId)
//             res.status(201).send(newPostResult)
//         } catch (error) {
//             res.sendStatus(500)
//         }
//     })

// POST add comment by post id
// postsRouter.post('/:postId/comments',
//     authMiddleware,
//     commentContentValidation,
//     inputValidationMiddleware,
//     async (req: RequestWithParamsAndBody<URIParamsCommentModel, CreateCommentModel>, res: Response) => {
//         try {
//             let foundPost = await postsQueryRepo.getPostByID(req.params.postId.toString())
//             if (!foundPost) {
//                 res.sendStatus(404)
//                 return
//             }
//             const newCommentId = await commentService.createComment(
//                 req.params.postId,
//                 req.body.content,
//                 req.userId)
//             const newComment = await commentsQueryRepo.getCommentById(newCommentId)
//             res.status(201).send(newComment)
//         } catch (error) {
//             res.status(500).send(`controller create comment by post id error: ${(error as any).message}`)
//         }
//     })

// GET all comments by post id
// postsRouter.get('/:postId/comments',
//     async (req: RequestWithParamsAndQuery<URIParamsPostModel, RequestCommentsByPostIdQueryModel>, res: Response) => {
//         const foundPost = await postsQueryRepo.getPostByID(req.params.postId.toString())
//         if (!foundPost) {
//             res.sendStatus(404)
//         } else {
//             try {
//                 let postId = req.params.postId.toString()
//                 let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
//                 let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
//                 let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
//                 let pageSize = req.query.pageSize ? req.query.pageSize : '10'
//                 let foundComments = await commentsQueryRepo.getAllCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize)
//                 if (foundComments) {
//                     res.status(200).send(foundComments)
//                 }
//             } catch (error) {
//                 res.status(500).send(error)
//             }
//         }
//     })

// PUT update post
// postsRouter.put('/:postId',
//     basicAuthMiddleware,
//     existBlogIdValidation,
//     shortDescriptionValidation,
//     titleValidation,
//     contentValidation,
//     inputValidationMiddleware,
//     async (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) => {
//         try {
//             const updatePost = await postsService.updatePost(
//                 req.params.postId,
//                 req.body.title,
//                 req.body.shortDescription,
//                 req.body.content,
//                 req.body.blogId)
//             if (updatePost) {
//                 res.sendStatus(204)
//             } else {
//                 res.sendStatus(404)
//             }
//         } catch (error) {
//             res.status(500).send(`controller update post by id error: ${(error as any).message}`)
//         }
//     })

// DELETE post
// postsRouter.delete('/:postId',
//     basicAuthMiddleware,
//     async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
//         try {
//             const isDeleted = await postsService.deletePost(req.params.postId)
//             if (isDeleted) {
//                 return res.sendStatus(204)
//             } else {
//                 res.sendStatus(404);
//             }
//         } catch (error) {
//             res.status(500).send(`controller delete post by id error: ${(error as any).message}`)
//         }
//     })

