import {ObjectId} from "mongodb";
import {CommentDBType, CommentTypeOutput} from "../models/comments-types";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersQueryRepo} from "../repositories/users-query-repository";
import {injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository, protected usersQueryRepo: UsersQueryRepo) {}
    async createComment(postId: string, content: string, userId: string,): Promise<string> {
        const user = await this.usersQueryRepo.getUserById(userId)
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
        const createdCommentId = await this.commentsRepository.createComment(newComment)
        return createdCommentId
    }

    async updateComment(
        id: string,
        content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean>{
        return await this.commentsRepository.deleteComment(id)
    }
}