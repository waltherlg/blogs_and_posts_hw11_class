import {Router} from "express";
import {authMiddleware, refreshTokenCheck} from "../middlewares/basic-auth.middleware";
import {
    confirmationCodeValidation,
    emailResendingValidation,
    emailValidation,
    emailValidationForRecovery,
    inputValidationMiddleware,
    loginValidation,
    newPasswordValidation,
    passwordRecoveryCodeValidation,
    passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authRateLimiter} from "../middlewares/auth-rate-limiter";
import {isEmailExistValidation} from "../middlewares/other-midlevares";
import {authControllerInstance} from "../compositions-root";

export const authRouter = Router({})

authRouter.post('/registration',
    authRateLimiter.registration,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    authControllerInstance.registration.bind(authControllerInstance))

authRouter.post('/registration-email-resending',
    authRateLimiter.emailResending,
    emailResendingValidation,
    inputValidationMiddleware,
    authControllerInstance.registrationEmailResending.bind(authControllerInstance))

authRouter.post('/registration-confirmation',
    authRateLimiter.registrationConfirmation,
    confirmationCodeValidation,
    inputValidationMiddleware,
    authControllerInstance.registrationConfirmation.bind(authControllerInstance))

authRouter.post('/login',
    authRateLimiter.login,
    authControllerInstance.login.bind(authControllerInstance))

authRouter.post('/refresh-token',
    refreshTokenCheck,
    authControllerInstance.refreshToken.bind(authControllerInstance))

authRouter.get('/me',
    authMiddleware,
    authControllerInstance.currentUserInfo.bind(authControllerInstance))

authRouter.post('/logout',
    refreshTokenCheck,
    authControllerInstance.logout.bind(authControllerInstance))

authRouter.post('/password-recovery',
    authRateLimiter.passwordRecovery,
    emailValidationForRecovery,
    inputValidationMiddleware,
    isEmailExistValidation,
    authControllerInstance.passwordRecovery.bind(authControllerInstance))

authRouter.post('/new-password',
    authRateLimiter.newPassword,
    newPasswordValidation,
    passwordRecoveryCodeValidation,
    inputValidationMiddleware,
    authControllerInstance.newPasswordSet.bind(authControllerInstance))

