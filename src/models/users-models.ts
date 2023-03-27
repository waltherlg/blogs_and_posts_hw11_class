
export type UserParamURIModel = {
    id: string
}

export type UserInputModel = {
    login: string,
    password: string,
    email: string,
}

export type UserAuthModel = {
    loginOrEmail: string,
    password: string
}

export type PasswordRecoveryModel = {
    email: string,
    passwordRecoveryCode: string,
    expirationDateOfRecoveryCode: Date
}