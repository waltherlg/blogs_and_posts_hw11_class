//import {client} from "./db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../models/types";
import {CommentTypeOutput} from "../models/types";
import {CommentModel} from "../schemes/schemes";

//export const commentsCollection = client.db("blogsAndPosts").collection<commentType>("comments")

export const commentsRepository = {

    async createComment(newComment: CommentDBType): Promise<string> {
        const comment = new CommentModel(newComment)
        await comment.save()
        return comment._id.toString()
    },

    async deleteComment(id: string): Promise<boolean> {
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await CommentModel.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    },

    async updateComment(id: string, content: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await CommentModel
                .updateOne({_id: _id},{$set: {content: content}})
            return result.matchedCount === 1
        }
        else return false
    },

    async setCountCommentsLike(commentsId: string, status: string) {
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        if (status === 'Like') {
            comment.likesCount += 1
        }
        if (status === 'Dislike') {
            comment.dislikesCount =+ 1
        }
        await comment.save()
        return true
    },

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
    },

    async decreaseCommentsLikes(commentsId: string){
        if (!ObjectId.isValid(commentsId)) {
            return false
        }
        let _id = new ObjectId(commentsId)
        let comment = await CommentModel.findOne({_id: _id})
        if (!comment) return false
        comment.likesCount -= 1
        await comment.save()
        return true
    },

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
    },

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
    },

    async deleteAllComments(): Promise<boolean>{
        const result = await CommentModel.deleteMany({})
        return result.acknowledged
    }
}