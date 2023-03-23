import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comment-service";
import {CommentsController} from "./routes/comments-route";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./routes/posts-route";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routes/blogs-route";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./routes/users-route";
import {LikeService} from "./domain/like-service";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./routes/auth-route";



const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)

const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository)

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)

export const usersRepository = new UsersRepository()
const usersService = new UsersService(usersRepository)

const likeService = new LikeService(commentsRepository, usersRepository)

const authService = new AuthService(usersRepository)

export const blogsControllerInstance = new BlogsController(blogsService, postsService)
export const commentsControllerInstance = new CommentsController(commentsService, likeService)
export const postsControllerInstance = new PostsController(postsService, commentsService)
export const usersControllerInstance = new UsersController(usersService)
export const authControllerInstance = new AuthController(authService, usersService)

