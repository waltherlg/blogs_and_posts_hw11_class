

import express from 'express'
import {blogsRouter} from "./routes/blogs-route";
import {postsRouter} from "./routes/posts-route";
import {usersRouter} from "./routes/users-route";
import {testingRouter} from "./routes/testing-route";
import {runDb} from "./repositories/db";
import {authRouter} from "./routes/auth-route";
import {commentsRouter} from "./routes/comments-route";
import cookieParser from 'cookie-parser'
import {securityRouter} from "./routes/security-route";

const bodyParser = require('body-parser');


export const app = express()
app.set('trust proxy', true)
const port = process.env.PORT || 3000

//пора делать классы
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
