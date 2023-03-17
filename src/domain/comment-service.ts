import {ObjectId} from "mongodb";
import {CommentDBType, CommentTypeOutput} from "../models/types";
import {commentsRepository} from "../repositories/comments-repository";
import {jwtService} from "../application/jwt-service";
import {usersService} from "./users-service";
import {usersRepository} from "../repositories/users-repository";
import {commentsQueryRepo} from "../repositories/comments-query-repository";
import {usersQueryRepo} from "../repositories/users-query-repository";

export const commentService = {

    async createComment(postId: string, content: string, userId: string,): Promise<string> {
        const user = await usersQueryRepo.getUserById(userId)
        const newComment: CommentDBType = {
            "_id": new ObjectId(),
            "parentType": "post",
            "parentId": postId,
            "content":	content,
            "userId": userId!,
            "userLogin": user!.login,
            "createdAt": new Date().toISOString(),
            "likesCount": 0,
            'dislikesCount': 0,
            "myStatus": 'None'
        }
        const createdCommentId = await commentsRepository.createComment(newComment)
        return createdCommentId
    },

    async updateComment(
        id: string,
        content: string): Promise<boolean> {
         return await commentsRepository.updateComment(id, content)
    },

    async deleteComment(id: string): Promise<boolean>{
        return await commentsRepository.deleteComment(id)
        },

    async deleteAllComments(): Promise<boolean>{
        return await commentsRepository.deleteAllComments()
    },
}