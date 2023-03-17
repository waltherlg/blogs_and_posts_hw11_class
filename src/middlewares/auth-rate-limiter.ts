import rateLimit from "express-rate-limit";

const limit5TryFor10Sec = {
    windowMs: 10 * 1 * 1000, // 10 sec
    max: 5,
    message: "Too many requests, please try again later",
    statusCode: 429
}

export const authRateLimiter = {
    registration: rateLimit(limit5TryFor10Sec),
    emailResending: rateLimit(limit5TryFor10Sec),
    registrationConfirmation: rateLimit(limit5TryFor10Sec),
    login: rateLimit(limit5TryFor10Sec),
    passwordRecovery: rateLimit(limit5TryFor10Sec),
    newPassword: rateLimit(limit5TryFor10Sec),
}

