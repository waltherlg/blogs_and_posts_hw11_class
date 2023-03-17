import {usersQueryRepo} from "../repositories/users-query-repository";
import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";


export const likeService = {
    async updateCommentLike(userId: string, commentsId: string, status: string){
        const isUserAlreadyLikeComment = await usersQueryRepo.isUserAlreadyLikeComment(userId, commentsId)
        if (!isUserAlreadyLikeComment){
            const createdAt = new Date()
            const addedLike = await usersRepository.createCommentsLikeObject(userId, commentsId, createdAt, status)
            const setCount = await commentsRepository.setCountCommentsLike(commentsId, status)
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
                await commentsRepository.increaseCommentsLikes(commentsId)
            }
            if(currentStatus === "None" && status === 'Dislike'){
                await commentsRepository.increaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Like' && status === 'None'){
                await commentsRepository.decreaseCommentsLikes(commentsId)
            }
            if(currentStatus === 'Dislike' && status === 'None'){
                await commentsRepository.decreaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Like' && status === 'Dislike'){
                await commentsRepository.decreaseCommentsLikes(commentsId)
                await commentsRepository.increaseCommentsDislikes(commentsId)
            }
            if(currentStatus === 'Dislike' && status === 'Like'){
                await commentsRepository.decreaseCommentsDislikes(commentsId)
                await commentsRepository.increaseCommentsLikes(commentsId)
            }
            return true
        } else return true
        




    }
}