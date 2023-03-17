import {v4 as uuid4} from "uuid";
import add from "date-fns/add";

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