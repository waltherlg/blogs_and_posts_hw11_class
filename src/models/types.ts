import {ObjectId} from "mongodb";
import {Request} from "express";



// type | interface | class



export type UserDeviceDBType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expirationDate: string
}

export type UserDeviceOutputType = {
    ip: string,
    title: string | unknown | null,
    lastActiveDate: string,
    deviceId: string
}

export type RequestWithBody<B> = Request<{},{}, B>
export type RequestWithQuery<Q> = Request<{},{},{}, Q>
export type RequestWithParams<P> = Request<P>
export type RequestWithParamsAndBody<P, B> = Request<P,{},B>
export type RequestWithParamsAndQuery<P, Q> = Request<P,{},{}, Q>