import {ObjectId} from "mongodb";
import {PostDBType, PostTypeOutput} from "../models/posts-types";
import {PostModel} from "../schemes/schemes";

class PostsRepository {

    async createPost(newPost: PostDBType): Promise<PostTypeOutput> {
        const result = await PostModel.insertMany(newPost)
        let createdPost = {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        };
        return createdPost;
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

    async deleteAllPosts(): Promise<boolean> {
        const result = await PostModel.deleteMany({})
        return result.acknowledged
    }
}

export const postsRepository = new PostsRepository()

// export const postsRepository = {
//
//     async createPost(newPost: PostDBType): Promise<PostTypeOutput> {
//         const result = await PostModel.insertMany(newPost)
//         let createdPost = {
//             id: newPost._id.toString(),
//             title: newPost.title,
//             shortDescription: newPost.shortDescription,
//             content: newPost.content,
//             blogId: newPost.blogId,
//             blogName: newPost.blogName,
//             createdAt: newPost.createdAt
//         };
//         return createdPost;
//     },
//
//     async updatePost(
//         id: string,
//         title: string,
//         shortDescription: string,
//         content: string,
//         blogId: string): Promise<boolean> {
//         if (ObjectId.isValid(id)){
//             let _id = new ObjectId(id)
//             const result = await PostModel
//                 .updateOne({_id: _id},{$set: {
//                         title: title,
//                         shortDescription: shortDescription,
//                         content: content,
//                         blogId: blogId,
//                     }})
//             return result.matchedCount === 1
//         }
//         else return false
//     },
//
//     async deletePost(id: string): Promise<boolean> {
//         if (ObjectId.isValid(id)){
//             let _id = new ObjectId(id)
//             const  result = await PostModel.deleteOne({_id: _id})
//             return result.deletedCount === 1
//         }
//         else return false
//
//     },
//
//     async deleteAllPosts(): Promise<boolean> {
//         const result = await PostModel.deleteMany({})
//         return result.acknowledged
//     },
// }