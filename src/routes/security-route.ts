import {Request, Response, Router} from "express";
import {refreshTokenCheck} from "../middlewares/basic-auth.middleware";
import {deviceService} from "../domain/device-service";
import {RequestWithParams} from "../models/types";
import {ObjectId} from "mongodb";
import {isUserOwnerOfDevice} from "../middlewares/other-midlevares";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        try {
            const usersDevises = await deviceService.getActiveUserDevices(req.userId!)
            res.status(200).send(usersDevises)
        } catch (error) {
            res.status(500).send(`controller security get devices error: ${(error as any).message}`)
        }
    })

securityRouter.delete('/devices',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        try {
            const isAllUsersDevisesDeleted = await deviceService.deleteAllUserDevicesExceptCurrent(req.userId, req.deviceId)
            if (isAllUsersDevisesDeleted) return res.sendStatus(204)
            else res.sendStatus(404)
        } catch (error) {
            res.status(500).send(`controller security delete devices error: ${(error as any).message}`)
        }
    })

securityRouter.delete('/devices/:deviceId',
    refreshTokenCheck,
    isUserOwnerOfDevice,
    async (req: RequestWithParams<any>, res: Response) => {
        try {
            const isDeviceDeleted = await deviceService.deleteUserDeviceById(req.userId, req.params.deviceId)
            if (isDeviceDeleted) {
                return res.sendStatus(204)
            } else {
                res.status(404).send("some error")
            }
        } catch (error) {
            res.status(500).send(`controller security delete device by id error: ${(error as any).message}`)
        }
    })

