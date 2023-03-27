import "reflect-metadata"
import {Container} from "inversify";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comment-service";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {LikeService} from "./domain/like-service";
import {AuthService} from "./domain/auth-service";
import {CommentsQueryRepo} from "./repositories/comments-query-repository";
import {CommentsController} from "./controllers/comments-controller";
import {AuthController} from "./controllers/auth-controller";
import {BlogsController} from "./controllers/blogs-controller";
import {PostsController} from "./controllers/posts-controller";
import {UsersController} from "./controllers/users-controller";
import {BlogsQueryRepo} from "./repositories/blog-query-repository";
import {PostsQueryRepo} from "./repositories/post-query-repository";
import {UsersQueryRepo} from "./repositories/users-query-repository";


export const container = new Container()



container.bind(BlogsQueryRepo).toSelf()
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(CommentsQueryRepo).to(CommentsQueryRepo)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(PostsQueryRepo).to(PostsQueryRepo)
container.bind(PostsRepository).to(PostsRepository)
container.bind(UsersQueryRepo).to(UsersQueryRepo)
container.bind(UsersRepository).to(UsersRepository)

container.bind(AuthService).to(AuthService)
container.bind(BlogsService).to(BlogsService)
container.bind(CommentsService).to(CommentsService)
container.bind(LikeService).to(LikeService)
container.bind(PostsService).to(PostsService)
container.bind(UsersService).to(UsersService)

container.bind(AuthController).to(AuthController)
container.bind(BlogsController).to(BlogsController)
container.bind(CommentsController).to(CommentsController)
container.bind(PostsController).to(PostsController)
container.bind(UsersController).to(UsersController)


export const checkUsersRepo = new UsersRepository()
//
// const commentsQueryRepo = new CommentsQueryRepo()
//
// const blogsRepository = new BlogsRepository()
// const blogsService = new BlogsService(blogsRepository)
//
// const postsRepository = new PostsRepository()
// const postsService = new PostsService(postsRepository)
//
// const commentsRepository = new CommentsRepository()
// const commentsService = new CommentsService(commentsRepository)
//
// const usersRepository = new UsersRepository()
// const usersService = new UsersService(usersRepository)
//
// const likeService = new LikeService(commentsRepository, usersRepository)
//
// const authService = new AuthService(usersRepository)
//
// export const blogsControllerInstance = new BlogsController(blogsService, postsService)
// export const commentsControllerInstance = new CommentsController(commentsService, likeService, commentsQueryRepo)
// export const postsControllerInstance = new PostsController(postsService, commentsService)
// export const usersControllerInstance = new UsersController(usersService)
// export const authControllerInstance = new AuthController(authService, usersService)

