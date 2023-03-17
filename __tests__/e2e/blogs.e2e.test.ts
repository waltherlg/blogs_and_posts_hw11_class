import request from "supertest"
import {app} from '../../src/index'
import {describe} from "node:test";
import {response} from "express";
import {blogsService} from "../../src/domain/blogs-service";
import mongoose from "mongoose";
import {postsService} from "../../src/domain/posts-service";
import {ObjectId} from "mongodb";
import {usersQueryRepo} from "../../src/repositories/users-query-repository";
import {UserModel} from "../../src/schemes/schemes";
import {UserTypeOutput} from "../../src/models/types";


const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
const basicAuthWrongPassword = Buffer.from('admin:12345').toString('base64');
const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

const notExistingId = new ObjectId()
describe('01 /blogs', () => {

    let createdBlogId: string

    beforeAll(async () => {
        await request(app).delete(('/testing/all-data'))
        await blogsService.createBlog('newBlogName2', 'newDescription2', 'https://www.someweb2.com');
        await blogsService.createBlog('newBlogName3', 'newDescription3', 'https://www.someweb3.com');
        await blogsService.createBlog('newBlogName4', 'newDescription4', 'https://www.someweb4.com');
        await blogsService.createBlog('newBlogName5', 'newDescription5', 'https://www.someweb5.com');
    })

    // afterAll( async () => {
    //     await mongoose.disconnect()
    // })

    it ('01-00 /blogs GET  = 200 and array with 4 object (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [
                    {
                        id: expect.any(String),
                        name: 'newBlogName5',
                        description: 'newDescription5',
                        websiteUrl: 'https://www.someweb5.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'https://www.someweb4.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'https://www.someweb3.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'https://www.someweb2.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    }
                ]
            }
        )
    })

    it ('00-01 /blogs POST  = 401 if no authorization data', async () => {
        await request(app)
            .post('/blogs')
            .send({name: "newBlog",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('01-02 /blogs POST  = 401 if wrong password', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthWrongPassword}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('01-03 /blogs POST  = 401 if wrong login', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthWrongLogin}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('01-04 /blogs POST  = 201 create new blog if all is OK', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "createdBlog6",
                description: 'newDescription6',
                websiteUrl: 'https://www.someweb6.com'
            })
            .expect(201)

            const createdResponse = createResponse.body
        createdBlogId = createdResponse.id;

        expect(createdResponse).toEqual({
            id: createdBlogId,
            name: 'createdBlog6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: createdResponse.createdAt,
            isMembership: false

        })
    })

    it ('01-05 /blogs GET = 200 return blog by id', async () => {
        const createResponse = await request(app)
            .get(`/blogs/${createdBlogId}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: createdBlogId,
            name: 'createdBlog6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: expect.any(String),
            isMembership: false

        })
    })

    it ('01-06 /blogs/:{blogId} PUT = 401 if wrong login', async () => {
        await request(app)
            .put(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${basicAuthWrongLogin}`)
            .send({name: "updatedName6",
                description: 'updatedDescription6',
                websiteUrl: 'https://www.updatedsomeweb6.com'
            })
            .expect(401)
    })

    it ('01-07 /blogs/:{blogId} PUT = 204 204 if id and auth is OK', async () => {
        await request(app)
            .put(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "updatedName6",
                description: 'updatedDescription6',
                websiteUrl: 'https://www.updatedsomeweb6.com'
            })
            .expect(204)
    })

    it ('01-08 /blogs GET = 200 and array with 5 object (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 5,
                items: [
                    {
                        id: expect.any(String),
                        name: 'updatedName6',
                        description: 'updatedDescription6',
                        websiteUrl: 'https://www.updatedsomeweb6.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName5',
                        description: 'newDescription5',
                        websiteUrl: 'https://www.someweb5.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'https://www.someweb4.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'https://www.someweb3.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'https://www.someweb2.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    }
                ]
            }
        )
    })

    it ('01-09 /blogs/:{blogId} DELETE = 401 if no authorization data', async () => {
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .expect(401)
    })

    it ('01-10 /blogs/:{blogId} DELETE = 404 if blogId not exist', async () => {
        await request(app)
            .delete(`/blogs/${notExistingId}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(404)
    })

    it ('01-11 /blogs/:{blogId} DELETE = 204 if id and auth is OK', async () => {
        const auth = Buffer.from('admin:qwerty').toString('base64');
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(204)
    })

    it ('01-12 /blogs GET = 200 and array with 4 object (with pagination, after deleting blog bi Id)', async () => {
        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [
                    {
                        id: expect.any(String),
                        name: 'newBlogName5',
                        description: 'newDescription5',
                        websiteUrl: 'https://www.someweb5.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'https://www.someweb4.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'https://www.someweb3.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'https://www.someweb2.com',
                        createdAt: expect.any(String),
                        isMembership: false

                    }
                ]
            }
        )
    })

    it ('01-13 /blogs POST = 400 if no description', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "description"
                    }
                ]
            })
    })

    it ('01-14 /blogs POST = 400 if description not a string', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: 1564852,
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "description"
                    }
                ]
            })
    })

    it ('01-15 /blogs POST = 400 if description is empty', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: '',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "description"
                    }
                ]
            })
    })

    it ('01-16 /blogs POST = 400 if websiteUrl has the wrong format', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'www.somewebcom'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "websiteUrl"
                    }
                ]})
    })

    it ('01-17 /blogs POST = 400 if no websiteUrl in body', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: 'newDescription'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "websiteUrl"
                    }
                ]})
    })

    it ('01-18 /blogs POST = 400 if name is empty', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "",
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    it ('01-19 /blogs POST = 400 if name is empty', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "",
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    it ('01-20 /blogs POST = 400 if the name is more than 15 characters', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "onemoreoneonemoreoneandonamore",
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    it ('01-21 /blogs POST = 400 if the name is not a string', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: 45623485935,
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    let blogIdForPostsOperations: string
    let blogNameForPostsOperations: string

    it('02-00 /posts POST = 201 Create new blog for tests', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                name: "blogForPost",
                description: 'this blog was created for testing posts',
                websiteUrl: 'https://www.blog-for-post.com'
            })
            .expect(201)

        const createdResponse = createResponse.body
        blogIdForPostsOperations = createdResponse.id;
        blogNameForPostsOperations = createdResponse.name

        expect(createdResponse).toEqual({
            id: blogIdForPostsOperations,
            name: 'blogForPost',
            description: 'this blog was created for testing posts',
            websiteUrl: 'https://www.blog-for-post.com',
            createdAt: createdResponse.createdAt,
            isMembership: false

        })

    })

    it('02-01 /posts POST = 400 with error massage if no title in body', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-02 /posts POST = 400 with error massage if empty title', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: "",
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-03 /posts POST = 400 with error massage if title not string', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 543657445774,
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-04 /posts POST = 400 with error massage if no shortDescription in body', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    }
                ]
            })
    })

    it('02-05 /posts POST = 400 with error massage if shortDescription is empty', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: '',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    }
                ]
            })
    })

    it('02-06 /posts POST = 400 with error massage if content is not a string', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: 'some short description',
                content: 1565468623,
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "content"
                    }
                ]
            })
    })

    it('02-07 /posts POST = 400 with error massage if blogId not exist', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: notExistingId
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "blogId"
                    }
                ]
            })
    })

    it('02-07-1 /posts GET = 200 and empty array (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [
                ]
            }
        )
    })

    let postIdForPostOperations: string

    it('02-08 /posts POST = 201 with created post if all is OK', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(201)

        const createdResponse = createResponse.body
        postIdForPostOperations = createdResponse.id

        expect(createdResponse).toEqual({
            id: postIdForPostOperations,
            title: 'somePostTitle',
            shortDescription: 'some short description',
            content: 'some new content',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: createdResponse.createdAt
        })
    })

    it('02-09 /posts GET = 200 and array with one post (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: postIdForPostOperations,
                        title: 'somePostTitle',
                        shortDescription: 'some short description',
                        content: 'some new content',
                        blogId: blogIdForPostsOperations,
                        blogName: blogNameForPostsOperations,
                        createdAt: expect.any(String)
                    }
                ]
            }
        )
    })

    it('02-10 /posts/:{postId} GET = 404 if postId is not exist', async  () => {
        await request(app)
            .get(`/posts/:111111111111111111111111`)
            .expect(404)
    })

    it('02-11 /posts/:{postId} GET = 200 and post', async  () => {
        const createResponse = await request(app)
            .get(`/posts/${postIdForPostOperations}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: postIdForPostOperations,
            title: 'somePostTitle',
            shortDescription: 'some short description',
            content: 'some new content',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: expect.any(String)
        })
    })

    it('02-12 /posts/:{postId} PUT = 401 if no auth data', async  () => {
        await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(401)
    })

    it('02-13 /posts/:{postId} PUT = 401 if wrong login', async  () => {
        await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthWrongLogin}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(401)
    })

    it('02-14 /posts/:{postId} PUT = 400 if title too long', async  () => {
        const createResponse = await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitleupdatedTitleupdatedTitleupdatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-15 /posts/:{postId} PUT = 400 if shortDescription is empty', async  () => {
        const createResponse = await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitle',
                shortDescription: '',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    }
                ]
            })
    })

    it('02-16 /posts/:{postId} PUT = 400 if no content in body', async  () => {
        const createResponse = await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "content"
                    }
                ]
            })
    })

    it('02-17 /posts/:{postId} PUT = 204 if all is OK', async  () => {
        await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(204)
    })

    it('02-18 /posts/:{postId} GET = 200 and post after updating', async  () => {
        const createResponse = await request(app)
            .get(`/posts/${postIdForPostOperations}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: postIdForPostOperations,
            title: 'updatedTitle',
            shortDescription: 'some updated short description',
            content: 'some updated content',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: expect.any(String)
        })
    })

    it('02-19 /posts/:{postId} DELETE = 401 if no auth data', async  () => {
        await request(app)
            .delete(`/posts/${postIdForPostOperations}`)
            .expect(401)
    })

    it('02-20 /posts/:{postId} DELETE = 204 if all OK', async  () => {
        await request(app)
            .delete(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(204)
    })

    it('02-21 /posts/:{postId} GET = 404 after deleting post by id', async  () => {
        await request(app)
            .get(`/posts/${postIdForPostOperations}`)
            .expect(404)
    })

    it('02-22 /posts GET = 200 and empty array (with pagination after deleting post by id)', async () => {

        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [
                ]
            }
        )
    })

    let blogIdForPostsOperations2: string

    it ('02-23 /blogs POST = creating one more blog for test', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "blogForPost2",
                description: 'one more blog for post operation',
                websiteUrl: 'https://www.one-more-blog-for-post.com'
            })
            .expect(201)

        const createdResponse = createResponse.body
        blogIdForPostsOperations2 = createdResponse.id;

        expect(createdResponse).toEqual({
            id: blogIdForPostsOperations2,
            name: 'blogForPost2',
            description: 'one more blog for post operation',
            websiteUrl: 'https://www.one-more-blog-for-post.com',
            createdAt: createdResponse.createdAt,
            isMembership: false

        })
    })

    it ('02-24 /blogs/:{blogId}/posts POST = 201 create post, using blogs Id', async () => {

        await postsService.createPost('postBFP2',
            'post2, created for check BFP2',
            'some content, post2, created for check BFP2',
            blogIdForPostsOperations2)
        await postsService.createPost('postBFP3',
            'post3, created for check BFP2',
            'some content, post3, created for check BFP2',
            blogIdForPostsOperations2)
        await postsService.createPost('postBFP4',
            'post4, created for check BFP2',
            'some content, post4, created for check BFP2',
            blogIdForPostsOperations2)

        const createResponse = await request(app)
            .post(`/blogs/${blogIdForPostsOperations}/posts`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({title: 'titleCreated1',
                shortDescription: 'post created by blogsId1 in params',
                content: 'some content, created by blogsId1 in params'
            })
            .expect(201)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: expect.any(String),
            title: 'titleCreated1',
            shortDescription: 'post created by blogsId1 in params',
            content: 'some content, created by blogsId1 in params',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: expect.any(String)
        })
    })

    it('02-22 /posts GET = 200 and array with 4 posts with pagination (before check getting posts by blogsId)', async () => {

        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [
                    {
                        id: expect.any(String),
                        title: 'titleCreated1',
                        shortDescription: 'post created by blogsId1 in params',
                        content: 'some content, created by blogsId1 in params',
                        blogId: blogIdForPostsOperations,
                        blogName: blogNameForPostsOperations,
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        title: 'postBFP4',
                        shortDescription: 'post4, created for check BFP2',
                        content: 'some content, post4, created for check BFP2',
                        blogId: blogIdForPostsOperations2,
                        blogName: 'blogForPost2',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        title: 'postBFP3',
                        shortDescription: 'post3, created for check BFP2',
                        content: 'some content, post3, created for check BFP2',
                        blogId: blogIdForPostsOperations2,
                        blogName: 'blogForPost2',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        title: 'postBFP2',
                        shortDescription: 'post2, created for check BFP2',
                        content: 'some content, post2, created for check BFP2',
                        blogId: blogIdForPostsOperations2,
                        blogName: 'blogForPost2',
                        createdAt: expect.any(String)
                    },
                ]
        })
    })

    it ('02-24 /blogs/:{blogId}/posts GET = 404 if this blog id not exist', async () => {
        const createResponse = await request(app)
            .get(`/blogs/${111111111}/posts`)
            .expect(404)
    })

    it ('02-24 /blogs/:{blogId}/posts GET = 200 and all 3 posts for this blog (with pagination', async () => {
        const createResponse = await request(app)
            .get(`/blogs/${blogIdForPostsOperations2}/posts`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [
                    {
                        id: expect.any(String),
                        title: 'postBFP4',
                        shortDescription: 'post4, created for check BFP2',
                        content: 'some content, post4, created for check BFP2',
                        blogId: blogIdForPostsOperations2,
                        blogName: 'blogForPost2',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        title: 'postBFP3',
                        shortDescription: 'post3, created for check BFP2',
                        content: 'some content, post3, created for check BFP2',
                        blogId: blogIdForPostsOperations2,
                        blogName: 'blogForPost2',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        title: 'postBFP2',
                        shortDescription: 'post2, created for check BFP2',
                        content: 'some content, post2, created for check BFP2',
                        blogId: blogIdForPostsOperations2,
                        blogName: 'blogForPost2',
                        createdAt: expect.any(String)
                    },
                ]
        })
    })

    let userIdForTests: string

    it('03-00 /users POST = 201 with return new user if all is OK', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslantest',
                password: 'qwerty',
                email: 'ruslan.it@luft-mail.com'
            })
            .expect(201)

        const createdResponse = createResponse.body
        userIdForTests = createdResponse.id

        expect(createdResponse).toEqual({
            id: userIdForTests,
            login: 'ruslantest',
            email: 'ruslan.it@luft-mail.com',
            createdAt: expect.any(String)
        })
    })

    it('03-01 /users POST = 401 if no auth data', async () => {
        const createResponse = await request(app)
            .post('/users')
            .send({login: 'ruslantest',
                password: 'qwerty',
                email: 'ruslan.it@luft-mail.com'
            })
            .expect(401)
    })

    it('03-02 /users POST = 401 if wrong password', async () => {
        await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthWrongPassword}`)
            .send({login: 'ruslantest',
                password: 'qwerty',
                email: 'ruslan.it@luft-mail.com'
            })
            .expect(401)
    })

    it('03-03 /users POST = 400 with error message if no login in body', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                password: 'qwerty',
                email: 'ruslan0303.it@luft-mail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "login"
                    }
                ]
            })
    })

    it('03-04 /users POST = 400 with error message if no login too many character', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslanbestrulessupermega',
                password: 'qwerty',
                email: 'ruslan0304.it@luft-mail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "login"
                    }
                ]
            })
    })

    it('03-05 /users POST = 400 with error message if login already exist', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslantest',
                password: 'qwerty',
                email: 'ruslan0305.it@luft-mail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "login"
                    }
                ]
            })
    })

    it('03-06 /users POST = 400 with error message if password is empty', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslan',
                password: '',
                email: 'ismailovrt.it@luft-mail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "password"
                    }
                ]
            })
    })

    it('03-07 /users POST = 400 with error message if password les then 6 character', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslan2',
                password: 'qwe',
                email: 'ismailovrt.it@luft-mail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "password"
                    }
                ]
            })
    })

    it('03-08 /users POST = 400 with error message if email has wrong format v1', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslan2',
                password: 'qwerty',
                email: 'ismailovrt.it@gmailcom'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "email"
                    }
                ]
            })
    })

    it('03-09 /users POST = 400 with error message if email has wrong format v2', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslan2',
                password: 'qwerty',
                email: 'ismailovrt.itgmail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "email"
                    }
                ]
            })
    })

    it('03-10 /users POST = 400 with error message if email already using', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({login: 'ruslan2',
                password: 'qwerty',
                email: 'ruslan.it@luft-mail.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "email"
                    }
                ]
            })
    })

    it('03-11 /users GET = 200 and array of users with pagination', async () => {
        const createResponse = await request(app)
            .get('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                    id: userIdForTests,
                    login: 'ruslantest',
                    email: 'ruslan.it@luft-mail.com',
                    createdAt: expect.any(String)
                },
            ]
        })
    })

    it('03-11 /users GET = 200 and array of users with pagination', async () => {
        const createResponse = await request(app)
            .get('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                    id: userIdForTests,
                    login: 'ruslantest',
                    email: 'ruslan.it@luft-mail.com',
                    createdAt: expect.any(String)
                },
            ]
        })
    })

    it('03-12 /users GET = 401 if no auth data', async () => {
        await request(app)
            .get('/users')
            .expect(401)
    })

    it('03-13 /users/:{userId} DELETE = 401 if no auth data', async () => {
        await request(app)
            .delete(`/users/${userIdForTests}`)
            .expect(401)
    })

    it('03-13 /users/:{userId} DELETE = 404 if id not exist', async () => {
        await request(app)
            .delete(`/users/1111111111111111`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(404)
    })

    it('03-13 /users/:{userId} DELETE = 404 if all is OK', async () => {
        await request(app)
            .delete(`/users/${userIdForTests}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(204)
    })

    it('03-11 /users GET = 200 and empty array with pagination (after deleting user by id)', async () => {
        const createResponse = await request(app)
            .get('/users')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [
            ]
        })
    })

    let userEmailForTestsRegistration = 'ismailovrt.it@gmail.com'

    it('04-00 /auth/registration POST = 204 and return new created user if all is OK', async () => {
        await request(app)
            .post('/auth/registration')
            .send({login: 'ruslan',
                password: 'qwerty',
                email: userEmailForTestsRegistration
            })
            .expect(204)
    })

    it('04-01 /auth/registration POST = 204 if all is OK', async () => {
        await request(app)
            .post('/auth/registration')
            .send({login: 'ruslan2',
                password: 'qwerty',
                email: 'ismailovrt.it@luft-mail.com'
            })
            .expect(204)
    })


    it('04-02 /auth/registration-confirmation POST = 204 if all is OK', async () => {
        const user = await UserModel.findOne({email: userEmailForTestsRegistration}).lean()
            expect(user).not.toBeNull()
        const confirmationCode = user!.confirmationCode
        await request(app)
            .post('/auth/registration-confirmation')
            .send({code: confirmationCode})
            .expect(204)
    })

    it('04-03 /auth//registration-email-resending POST = 400 with error message if already confirmed', async () => {

        const createResponse = await request(app)
            .post('/auth/registration-email-resending')
            .send({email: 'ismailovrt.it@gmail.com'})
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": "email already confirmed",
                        "field": "email"
                    }
                ]
        })
    })

    it('04-04 /auth/registration-confirmation POST = 400 with error message if code not exist', async () => {
        const createResponse = await request(app)
            .post('/auth/registration-confirmation')
            .send({code: "111111111"})
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": "confirmation code not exist",
                        "field": "code"
                    }
                ]
            })
    })

    it('04-00 /auth/registration POST = 400 with error message if email already using', async () => {
        const createResponse = await request(app)
            .post('/auth/registration')
            .send({login: 'ruslan34',
                password: 'qwerty',
                email: userEmailForTestsRegistration
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": "email already using",
                        "field": "email"
                    }
                ]
            })
    })






})




// describe('02 /posts validation', () => {
//
//     beforeAll(async () => {
//         await request(app).delete(('/testing/all-data'))
//     })
//
//
//
//
//
// })