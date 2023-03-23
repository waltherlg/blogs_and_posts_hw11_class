import {Request, Response, Router} from "express";
import {RequestWithBody} from "../models/types";
import {UserAuthModel, UserInputModel} from "../models/users-models";
import {authMiddleware, refreshTokenCheck} from "../middlewares/basic-auth.middleware";
import {
    confirmationCodeValidation,
    emailResendingValidation,
    emailValidation, emailValidationForRecovery,
    inputValidationMiddleware,
    loginValidation, newPasswordValidation, passwordRecoveryCodeValidation, passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authRateLimiter} from "../middlewares/auth-rate-limiter";
import {isEmailExistValidation} from "../middlewares/other-midlevares";
import {usersQueryRepo} from "../repositories/users-query-repository";
import {authControllerInstance} from "../compositions-root";
import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";

export const authRouter = Router({})

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
            res.status(500).send(`controller registration error: ${(error as any).message}`)
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        try {
            const result = await this.authService.registrationEmailResending(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(500).send(`controller registration-email-resending error: ${(error as any).message}`)
        }
    }

    async registrationConfirmation(req: Request, res: Response) {
        try {
            const result = await this.authService.confirmEmail(req.body.code)
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(500).send(`controller registration-confirmation error: ${(error as any).message}`)
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
            res.status(500).send(`controller login error: ${(error as any).message}`)
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
            res.status(500).send(`controller refresh-token error: ${(error as any).message}`)
        }
    }

    async currentUserInfo(req: Request, res: Response) {
        try {
            const currentUserInfo = await this.usersService.currentUserInfo(req.userId)
            res.status(200).send(currentUserInfo)
        } catch (error) {
            res.status(500).send(`controller me error: ${(error as any).message}`)
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const isLogout = await this.authService.logout(req.userId, req.deviceId)
            if (isLogout) res.cookie("refreshToken", "", {httpOnly: true, secure: true}).sendStatus(204)
            else res.status(404).send("no logout")
        } catch (error) {
            res.status(500).send(`controller logout error: ${(error as any).message}`)
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        try {
            const result = await this.authService.passwordRecovery(req.body.email);
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(404)
        } catch (error) {
            res.status(500).send(`controller password-recovery error: ${(error as any).message}`)
        }

    }

    async newPasswordSet(req: Request, res: Response) {
        try {
            const result = await this.authService.newPasswordSet(req.body.newPassword, req.body.recoveryCode);
            if (result) {
                res.sendStatus(204)
            } else res.sendStatus(400)
        } catch (error) {
            res.status(500).send(`controller new-password error: ${(error as any).message}`)
        }

}



}

authRouter.post('/registration',
    authRateLimiter.registration,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    authControllerInstance.registration)

authRouter.post('/registration-email-resending',
    authRateLimiter.emailResending,
    emailResendingValidation,
    inputValidationMiddleware,
    authControllerInstance.registrationEmailResending)

authRouter.post('/registration-confirmation',
    authRateLimiter.registrationConfirmation,
    confirmationCodeValidation,
    inputValidationMiddleware,
    authControllerInstance.registrationConfirmation)

authRouter.post('/login',
    authRateLimiter.login,
    authControllerInstance.login)

authRouter.post('/refresh-token',
    refreshTokenCheck,
    authControllerInstance.refreshToken)

authRouter.get('/me',
    authMiddleware,
    authControllerInstance.currentUserInfo)

authRouter.post('/logout',
    refreshTokenCheck,
    authControllerInstance.logout)

authRouter.post('/password-recovery',
    authRateLimiter.passwordRecovery,
    emailValidationForRecovery,
    inputValidationMiddleware,
    isEmailExistValidation,
    authControllerInstance.passwordRecovery)

authRouter.post('/new-password',
    authRateLimiter.newPassword,
    newPasswordValidation,
    passwordRecoveryCodeValidation,
    inputValidationMiddleware,
    authControllerInstance.newPasswordSet)

