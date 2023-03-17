import {ObjectId} from "mongodb";
import {CommentDBType, CommentTypeOutput} from "../models/comments-types";
import {commentsRepository} from "../repositories/comments-repository";
import {usersQueryRepo} from "../repositories/users-query-repository";


class CommentService {
    async createComment(postId: string, content: string, userId: string,): Promise<string> {
        const user = await usersQueryRepo.getUserById(userId)
        const newComment = new CommentDBType(
            new ObjectId(),
            "post",
            postId,
            content,
            userId!,
            user!.login,
            new Date().toISOString(),
            0,
            0,
            'None')
        const createdCommentId = await commentsRepository.createComment(newComment)
        return createdCommentId
    }

    async updateComment(
        id: string,
        content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean>{
        return await commentsRepository.deleteComment(id)
    }

    async deleteAllComments(): Promise<boolean>{
        return await commentsRepository.deleteAllComments()
    }
}

export const commentService = new CommentService()

// export const commentService = {
//
//     async createComment(postId: string, content: string, userId: string,): Promise<string> {
//         const user = await usersQueryRepo.getUserById(userId)
//         const newComment = new CommentDBType(
//             new ObjectId(),
//             "post",
//             postId,
//             content,
//             userId!,
//             user!.login,
//             new Date().toISOString(),
//             0,
//             0,
//             'None')
//         const createdCommentId = await commentsRepository.createComment(newComment)
//         return createdCommentId
//     },
//
//     async updateComment(
//         id: string,
//         content: string): Promise<boolean> {
//          return await commentsRepository.updateComment(id, content)
//     },
//
//     async deleteComment(id: string): Promise<boolean>{
//         return await commentsRepository.deleteComment(id)
//         },
//
//     async deleteAllComments(): Promise<boolean>{
//         return await commentsRepository.deleteAllComments()
//     },
// }