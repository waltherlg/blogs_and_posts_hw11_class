import {UsersQueryRepo} from "../repositories/users-query-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {th} from "date-fns/locale";
import {injectable} from "inversify";
import {PostsRepository} from "../repositories/posts-repository";

@injectable()
export class LikeService {
    constructor(protected commentsRepository: CommentsRepository, protected usersRepository: UsersRepository, protected usersQueryRepo: UsersQueryRepo, protected postsRepository: PostsRepository) {
    }

    async updateCommentLike(userId: string, commentsId: string, status: string): Promise<boolean>{
        const isUserAlreadyLikeComment = await this.usersRepository.isUserAlreadyLikeComment(userId, commentsId)
        console.log('isUserAlreadyLikeComment ', isUserAlreadyLikeComment)
        if (!isUserAlreadyLikeComment){
            const createdAt = new Date()
            const isLikeAdded = await this.usersRepository.createCommentsLikeObject(userId, commentsId, createdAt, status)
            const setCount = await this.commentsRepository.setCountCommentsLike(commentsId, status)
            return isLikeAdded
        }
        const likedComments = await this.usersRepository.getUsersLikedComments(userId)
        if (!likedComments) return false
        const comment = likedComments.find(c => c.commentsId === commentsId)
        const currentStatus = comment ? comment.status : null
        console.log('CurrentStatus ' + currentStatus)

        if(currentStatus !== status){
            await this.usersRepository.updateCommentsLikeObject(userId, commentsId, status)
            if(currentStatus === "None" && status === 'Like'){
                await this.commentsRepository.increaseCommentsLikes(commentsId)
            }
            if(currentStatus === "None" && status === 'Dislike'){
                await this.commentsRepository.increaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Like' && status === 'None'){
                await this.commentsRepository.decreaseCommentsLikes(commentsId)
            }
            if(currentStatus === 'Dislike' && status === 'None'){
                await this.commentsRepository.decreaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Like' && status === 'Dislike'){
                await this.commentsRepository.decreaseCommentsLikes(commentsId)
                await this.commentsRepository.increaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Dislike' && status === 'Like'){
                await this.commentsRepository.decreaseCommentsDislikes(commentsId)
                await this.commentsRepository.increaseCommentsLikes(commentsId)
            }
            return true
        } else return true
    }

    async updatePostLike(userId: string, postsId: string, status: string): Promise<boolean>{
        const user = await this.usersRepository.getUserById(userId)
        if(!user) return false
        const usersLikedPost = user.likedPosts.find(post => post.postsId === postsId);
        console.log('usersLikedPost in like servoce ', usersLikedPost)
        if(!usersLikedPost){
            const createdAt = new Date()
            const newLikedPost = {postsId, createdAt, status}
            user.likedPosts.push(newLikedPost)
            const result = await this.usersRepository.saveUser(user)
            const setCount = await this.postsRepository.setCountPostsLike(postsId, status, createdAt, userId, user.login)
            return result
        }

        // const isUserAlreadyLikePost = await this.usersRepository.isUserAlreadyLikeCPost(userId, postsId)
        // if (!isUserAlreadyLikePost){
        //
        //     const createdAt = new Date()
        //     const isLikeAdded = await this.usersRepository.createPostsLikeObject(userId, postsId, createdAt, status)
        //     const setCount = await this.postsRepository.setCountPostsLike(postsId, status)
        //     return isLikeAdded
        // }

        // const likedPosts = await this.usersRepository.getUsersLikedPosts(userId)
        // if (!likedPosts) return false
        // const post = likedPosts.find(c => c.postsId === postsId)

        const currentStatus = usersLikedPost ? usersLikedPost.status : null

        if(currentStatus !== status){
            await this.usersRepository.updatePostsLikeObject(userId, postsId, status)
            if(currentStatus === "None" && status === 'Like'){
                await this.postsRepository.increasePostsLikes(postsId)
            }
            if(currentStatus === "None" && status === 'Dislike'){
                await this.postsRepository.increasePostsDislikes(postsId)
            }
            if(currentStatus === 'Like' && status === 'None'){
                await this.postsRepository.decreasePostsLikes(postsId)
            }
            if(currentStatus === 'Dislike' && status === 'None'){
                await this.postsRepository.decreasePostsDislikes(postsId)
            }
            if(currentStatus === 'Like' && status === 'Dislike'){
                await this.postsRepository.decreasePostsLikes(postsId)
                await this.postsRepository.increasePostsDislikes(postsId)
            }
            if(currentStatus === 'Dislike' && status === 'Like'){
                await this.postsRepository.decreasePostsDislikes(postsId)
                await this.postsRepository.increasePostsLikes(postsId)
            }
            return true
        } else return true
    }
}