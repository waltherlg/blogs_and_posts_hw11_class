import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
import {RequestWithBody} from "../models/types";
import {UserAuthModel, UserInputModel} from "../models/users-models";
import {Request, Response} from "express";
import {usersQueryRepo} from "../repositories/users-query-repository";

export class AuthController {
    constructor(protected authService: AuthService, protected usersService: UsersService) {
    }

    async registration(req: RequestWithBody<UserInputModel>, res: Response) {
        try {
            const newUserId = await this.authService.registerUser(
                req.body.login,
                req.body.password,
                req.body.email)
            if (newUserId) {
                const user = await usersQueryRepo.getUserById(newUserId)
                res.status(204).send(user)
            } else {
                res.sendStatus(400)
            }
        } catch (error) {
            res.status(400).send(`controller registration error: ${(error as any).message}`)
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        try {
            const result = await this.authService.registrationEmailResending(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(400).send(`controller registration-email-resending error: ${(error as any).message}`)
        }
    }

    async registrationConfirmation(req: Request, res: Response) {
        try {
            const result = await this.authService.confirmEmail(req.body.code)
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(400).send(`controller registration-confirmation error: ${(error as any).message}`)
        }
    }

    async login(req: RequestWithBody<UserAuthModel>, res: Response) {
        try {
            const userId = await this.authService.checkUserCredential(req.body.loginOrEmail, req.body.password)
            if (!userId) {
                res.sendStatus(401)
                return
            }
            const {accessToken, refreshToken} = await this.authService.login(userId, req.ip, req.headers['user-agent']!)
            res.status(200).cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).send({accessToken})
        } catch (error) {
            res.status(400).send(`controller login error: ${(error as any).message}`)
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const {accessToken, newRefreshedToken} = await this.authService.refreshingToken(req.cookies!.refreshToken)
            res.status(200).cookie("refreshToken", newRefreshedToken, {
                httpOnly: true,
                secure: true
            }).send({accessToken})
        } catch (error) {
            res.status(400).send(`controller refresh-token error: ${(error as any).message}`)
        }
    }

    async currentUserInfo(req: Request, res: Response) {
        try {
            const currentUserInfo = await this.usersService.currentUserInfo(req.userId)
            res.status(200).send(currentUserInfo)
        } catch (error) {
            res.status(400).send(`controller me error: ${(error as any).message}`)
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const isLogout = await this.authService.logout(req.userId, req.deviceId)
            if (isLogout) res.cookie("refreshToken", "", {httpOnly: true, secure: true}).sendStatus(204)
            else res.status(404).send("no logout")
        } catch (error) {
            res.status(400).send(`controller logout error: ${(error as any).message}`)
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        try {
            const result = await this.authService.passwordRecovery(req.body.email);
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(404)
        } catch (error) {
            res.status(400).send(`controller password-recovery error: ${(error as any).message}`)
        }

    }

    async newPasswordSet(req: Request, res: Response) {
        try {
            const result = await this.authService.newPasswordSet(req.body.newPassword, req.body.recoveryCode);
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(400).send(`controller new-password error: ${(error as any).message}`)
        }

    }


}