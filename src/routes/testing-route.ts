import {Request, Response, Router} from "express";
import {BlogModelClass, CommentModel, PostModel, UserDeviceModel, UserModel} from "../schemes/schemes";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        try {
            await PostModel.deleteMany({})
            await BlogModelClass.deleteMany({})
            await UserModel.deleteMany({})
            await CommentModel.deleteMany({})
            await UserDeviceModel.deleteMany({})
            return res.sendStatus(204)
        } catch (error) {
            res.status(500).send(`controller testing (delete all data) error: ${(error as any).message}`)
        }
    })

