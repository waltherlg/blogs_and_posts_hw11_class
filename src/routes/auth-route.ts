import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../models/types";
import {UserAuthModel, UserInputModel} from "../models/users-models";
import {jwtService} from "../application/jwt-service";
import {authMiddleware, refreshTokenCheck} from "../middlewares/basic-auth.middleware";
import {
    confirmationCodeValidation,
    emailResendingValidation,
    emailValidation, emailValidationForRecovery,
    inputValidationMiddleware,
    loginValidation, newPasswordValidation, passwordRecoveryCodeValidation, passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authService} from "../domain/auth-service";
import {authRateLimiter} from "../middlewares/auth-rate-limiter";
import {isEmailExistValidation} from "../middlewares/other-midlevares";
import {usersQueryRepo} from "../repositories/users-query-repository";


export const authRouter = Router({})

authRouter.post('/registration',
    authRateLimiter.registration,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
        try {
            const newUserId = await authService.registerUser(
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
            res.status(500).send(`controller registration error: ${(error as any).message}`)
        }

    })

authRouter.post('/registration-email-resending',
    authRateLimiter.emailResending,
    emailResendingValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const result = await authService.registrationEmailResending(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(500).send(`controller registration-email-resending error: ${(error as any).message}`)
        }
    })

authRouter.post('/registration-confirmation',
    authRateLimiter.registrationConfirmation,
    confirmationCodeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const result = await authService.confirmEmail(req.body.code)
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(500).send(`controller registration-confirmation error: ${(error as any).message}`)
        }
    })

authRouter.post('/login',
    authRateLimiter.login,
    async (req: RequestWithBody<UserAuthModel>, res: Response) => {
        try {
            const userId = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (userId) {
                const {accessToken, refreshToken} = await authService.login(userId, req.ip, req.headers['user-agent']!)
                res.status(200).cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).send({accessToken})
            } else res.sendStatus(401)
        } catch (error) {
            res.status(500).send(`controller login error: ${(error as any).message}`)
        }
    })

authRouter.post('/refresh-token',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        try {
            const {accessToken, newRefreshedToken} = await authService.refreshingToken(req.cookies!.refreshToken)
            res.status(200).cookie("refreshToken", newRefreshedToken, {
                httpOnly: true,
                secure: true
            }).send({accessToken})
        } catch (error) {
            res.status(500).send(`controller refresh-token error: ${(error as any).message}`)
        }
    })

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const currentUserInfo = await usersService.currentUserInfo(req.userId)
            res.status(200).send(currentUserInfo)
        } catch (error) {
            res.status(500).send(`controller me error: ${(error as any).message}`)
        }
    })

authRouter.post('/logout',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        try {
            const isLogout = await authService.logout(req.userId, req.deviceId)
            if (isLogout) res.cookie("refreshToken", "", {httpOnly: true, secure: true}).sendStatus(204)
            else res.status(404).send("no logout")
        } catch (error) {
            res.status(500).send(`controller logout error: ${(error as any).message}`)
        }
    })

authRouter.post('/password-recovery',
    authRateLimiter.passwordRecovery,
    emailValidationForRecovery,
    inputValidationMiddleware,
    isEmailExistValidation,
    async (req: Request, res: Response) => {
        try {
            const result = await authService.passwordRecovery(req.body.email);
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(404)
        } catch (error) {
            res.status(500).send(`controller password-recovery error: ${(error as any).message}`)
        }

    })

authRouter.post('/new-password',
    authRateLimiter.newPassword,
    newPasswordValidation,
    passwordRecoveryCodeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const result = await authService.newPasswordSet(req.body.newPassword, req.body.recoveryCode);
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(500).send(`controller new-password error: ${(error as any).message}`)
        }

    })

