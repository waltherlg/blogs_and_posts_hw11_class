import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {deviceService} from "../domain/device-service";
import {checkService} from "../domain/check-service";


export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("Unauthorized")
    }
    const authType = authHeader.split(' ')[0]
    if (authType !== 'Basic') return res.sendStatus(401)
    let auth = Buffer.from(authHeader.split(' ')[1],
        'base64').toString().split(':');
    let user = auth[0];
    let pass = auth[1];
    if (!(user == 'admin' && pass == 'qwerty')) {
        return res.status(401).send("Unauthorized")
    }
    return next()
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization?.split(' ')[1]

    const userId = await jwtService.getUserIdFromRefreshToken(token)
    if (userId) {
        req.userId = userId
        next()
        return
    }
    res.sendStatus(401)
}

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        next()
        return
    }
    const token = req.headers.authorization?.split(' ')[1]
    const userId = await jwtService.getUserIdFromRefreshToken(token)
    if (userId) {
        req.userId = userId
    }
    next()
}

export const refreshTokenCheck = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(401).send("нет куки")
        return
    }
    const userId = await jwtService.getUserIdFromRefreshToken(refreshToken)
    if (!userId) {
        res.status(401).send("no user in cookies")
        return
    }
    const deviceId = await jwtService.getDeviceIdFromRefreshToken(refreshToken)
    if (!deviceId) {
        res.status(401).send("no device in cookies")
        return
    }
    const isUserExist = await checkService.isUserExist(userId)
    if (!isUserExist) return res.status(401).send('user not found')

    const currentDevise = await deviceService.getCurrentDevise(userId, deviceId)
    if (!currentDevise) return res.status(401).send('device not found')

    let lastActiveRefreshToken = await jwtService.getLastActiveDateFromRefreshToken(refreshToken)
    if (lastActiveRefreshToken !== currentDevise.lastActiveDate){
        res.status(401).send("the last active dates do not match")
        return
    }
    req.userId = userId
    req.deviceId = deviceId
    next()
    return
}
