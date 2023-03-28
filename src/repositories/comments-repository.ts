//import {client} from "./db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../models/comments-types";
import {CommentModel} from "../schemes/schemes";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository{

    async createComment(newComment: CommentDBType): Promise<string> {
        const comment = new CommentModel(newComment)
        await comment.save()
        return comment._id.toString()
    }

    async deleteComment(id: string): Promise<boolean> {
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await CommentModel.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    }

    async updateComment(id: string, content: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await CommentModel
                .updateOne({_id: _id},{$set: {content: content}})
            return result.matchedCount === 1
        }
        else return false
    }

    async setCountCommentsLike(commentsId: string, status: string) {
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        if (status === 'Like') {
            comment.likesCount++
        }
        if (status === 'Dislike') {
            comment.dislikesCount++
        }
        await comment.save()
        return true
    }

    async increaseCommentsLikes(commentsId: string){
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        comment.likesCount += 1
        await comment.save()
        return true
    }

    async decreaseCommentsLikes(commentsId: string){
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        comment.likesCount -= 1
        const result = await comment.save()
        return result ? true : false
    }

    async increaseCommentsDislikes(commentsId: string){
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        comment.dislikesCount += 1
        await comment.save()
        return true
    }

    async decreaseCommentsDislikes(commentsId: string){
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        comment.dislikesCount -= 1
        await comment.save()
        return true
    }
}

