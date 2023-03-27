import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {
    emailValidation,
    inputValidationMiddleware,
    loginValidation,
    passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {container} from "../compositions-root";
import {UsersController} from "../controllers/users-controller";
//import {usersControllerInstance} from "../compositions-root";

const usersControllerInstance = container.resolve(UsersController)
export const usersRouter = Router({})

usersRouter.post('/',
    basicAuthMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    usersControllerInstance.createUser.bind(usersControllerInstance))

usersRouter.delete('/:id',
    basicAuthMiddleware,
    usersControllerInstance.deleteUser.bind(usersControllerInstance))

usersRouter.get('/',
    basicAuthMiddleware,
    usersControllerInstance.getUsers.bind(usersControllerInstance))

