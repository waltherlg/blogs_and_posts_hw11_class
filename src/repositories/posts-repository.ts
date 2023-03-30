import {ObjectId} from "mongodb";
import {PostDBType, PostTypeOutput} from "../models/posts-types";
import {CommentModel, PostModel} from "../schemes/schemes";
import {injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {UserDBType} from "../models/users-types";
@injectable()
export class PostsRepository {

    async savePost(post: HydratedDocument<PostDBType>){
        const result = await post.save()
        return !!result
    }

    async createPost(postDTO: PostDBType): Promise<string> {
        const newPost = new PostModel(postDTO)
        await newPost.save()
        return newPost._id.toString();
    }

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await PostModel
                .updateOne({_id: _id},{$set: {
                        title: title,
                        shortDescription: shortDescription,
                        content: content,
                        blogId: blogId,
                    }})
            return result.matchedCount === 1
        }
        else return false
    }

    async deletePost(id: string): Promise<boolean> {
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const  result = await PostModel.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    }

    async setCountPostsLike(postsId: string, status: string, createdAt: Date, userId: string, userLogin: string): Promise<boolean> {
        if (!ObjectId.isValid(postsId)) {
            return false
        }
        let _id = new ObjectId(postsId)
        let post = await PostModel.findOne({_id: _id})
        if (!post) return false
        const newLike = {
            addedAt: createdAt.toISOString(),
            userId,
            login: userLogin,
            status: status
        }
        post.likesCollection.push(newLike)
        if (status === 'Like') {
            post.likesCount++
        }
        if (status === 'Dislike') {
            post.dislikesCount++
        }
        const result = await post.save()
        return !!result
    }

    async increasePostsLikes(postsId: string): Promise<boolean>{
        if (!ObjectId.isValid(postsId)) {
            return false
        }
        let _id = new ObjectId(postsId)
        let post = await PostModel.findOne({_id: _id})
        if (!post) return false
        post.likesCount += 1
        const result = await post.save()
        return !!result
    }

    async decreasePostsLikes(postsId: string): Promise<boolean>{
        if (!ObjectId.isValid(postsId)) {
            return false
        }
        let _id = new ObjectId(postsId)
        let post = await PostModel.findOne({_id: _id})
        if (!post) return false
        post.likesCount -= 1
        const result = await post.save()
        return !!result
    }

    async increasePostsDislikes(postsId: string): Promise<boolean>{
        if (!ObjectId.isValid(postsId)) {
            return false
        }
        let _id = new ObjectId(postsId)
        let post = await PostModel.findOne({_id: _id})
        if (!post) return false
        post.dislikesCount += 1
        const result = await post.save()
        return !!result
    }

    async decreasePostsDislikes(postsId: string): Promise<boolean>{
        if (!ObjectId.isValid(postsId)) {
            return false
        }
        let _id = new ObjectId(postsId)
        let post = await PostModel.findOne({_id: _id})
        if (!post) return false
        post.dislikesCount -= 1
        const result = await post.save()
        return !!result
    }

    async getPostByID(id: string): Promise<HydratedDocument<PostDBType> | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        let _id = new ObjectId(id)
        const post = await PostModel.findOne({_id: _id})
        if (!post) {
            return null
        }
        return post
    }
}