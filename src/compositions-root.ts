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

class PostUsersSevice {
    getUsersByPosts()
}

const blogsRepository1 = new BlogsMongRepository()
const blogsRepository2 = new BlogsSqlRepository()

const blogsService = new BlogsService(blogsRepository2)
const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository)
export const blogsControllerInstance = new BlogsController(blogsService, postsService)


const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)
export const commentsControllerInstance = new CommentsController(commentsService)



export const postsControllerInstance = new PostsController(postsService)

const usersRepository = new UsersRepository()
const usersService = new UsersService(usersRepository)
export const usersControllerInstance = new UsersController(usersService)

