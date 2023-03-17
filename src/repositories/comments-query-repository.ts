
import {sort} from "../application/functions";
import {skipped} from "../application/functions";
import {CommentDBType, CommentTypeOutput} from "../models/types";
import {CommentModel} from "../schemes/schemes";
import {ObjectId} from "mongodb";

export const commentsQueryRepo = {

    async getAllCommentsByPostId(
        postId: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let commentsCount = await CommentModel.countDocuments({$and: [{parentType: "post"}, {parentId: postId}]})

        let comments = await CommentModel.find({$and: [{parentType: "post"}, {parentId: postId}]})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .lean()

        let outComments = comments.map((comments: CommentDBType) => {
            return {
                id: comments._id.toString(),
                content: comments.content,
                commentatorInfo: {
                    userId: comments.userId,
                    userLogin: comments.userLogin,
                },
                createdAt: comments.createdAt,
                LikesInfo: {
                    likesCount: comments.likesCount,
                    dislikesCount: comments.dislikesCount,
                    myStatus: 'None'
                }
            }
        })

        let pageCount = Math.ceil(commentsCount / +pageSize)

        let outputComments = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: commentsCount,
            items: outComments
        }
        return outputComments
    },

    async getCommentById(id: string): Promise<CommentTypeOutput | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        let _id = new ObjectId(id)
        const comment: CommentDBType | null = await CommentModel.findOne({_id: _id})
        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: comment.userLogin,
            },
            createdAt: comment.createdAt,
            LikesInfo: {
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
                myStatus: 'None'
            }
        }
    },
}

