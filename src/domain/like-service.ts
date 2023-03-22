import {usersQueryRepo} from "../repositories/users-query-repository";
import {UsersRepository, usersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {th} from "date-fns/locale";


export class LikeService {
    usersRepository: UsersRepository
    commentsRepository: CommentsRepository
    constructor(){
        this.usersRepository = new UsersRepository()
        this.commentsRepository = new CommentsRepository()
        this.usersRepository = new UsersRepository()
    }
    async updateCommentLike(userId: string, commentsId: string, status: string){
        const isUserAlreadyLikeComment = this.usersRepository.isUserAlreadyLikeComment(userId, commentsId)
        if (!isUserAlreadyLikeComment){
            const createdAt = new Date()
            const addedLike = await this.usersRepository.createCommentsLikeObject(userId, commentsId, createdAt, status)
            const setCount = await this.commentsRepository.setCountCommentsLike(commentsId, status)
            return addedLike
        }
        const likedComments = await usersQueryRepo.getUsersLikedComments(userId)
        if (!likedComments) return false
        const comment = likedComments.find(c => c.commentsId === commentsId)
        const currentStatus = comment ? comment.status : null
        console.log('CurrentStatus ' + currentStatus)

        if(currentStatus !== status){
            await usersRepository.updateCommentsLikeObject(userId, commentsId, status)
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
}