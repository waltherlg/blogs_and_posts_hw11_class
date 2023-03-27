import {usersQueryRepo} from "../repositories/users-query-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {th} from "date-fns/locale";
import {injectable} from "inversify";

@injectable()
export class LikeService {
    constructor(protected commentsRepository: CommentsRepository, protected usersRepository: UsersRepository) {
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
        const likedComments = await usersQueryRepo.getUsersLikedComments(userId)
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
}