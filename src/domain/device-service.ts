import {ObjectId} from "mongodb";
import {userDeviceRepo} from "../repositories/users-device-repository";
import {UserDeviceOutputType} from "../models/types";
import {jwtService} from "../application/jwt-service";
import {tr} from "date-fns/locale";

export const deviceService = {

    async getActiveUserDevices(userId: string){
        let foundDevices = await userDeviceRepo.getActiveUserDevices(userId)
        return foundDevices
    },

    async deleteAllUserDevicesExceptCurrent(userId: string, deviceId: string){
        let isDevicesDeleted = await userDeviceRepo.deleteAllUserDevicesExceptCurrent(userId, deviceId)
        return isDevicesDeleted
    },

    async deleteUserDeviceById(userId: string, deviceId: string): Promise<boolean>{
        let isDeviceDeleted = await userDeviceRepo.deleteUserDeviceById(userId, deviceId)
        return isDeviceDeleted
    },

    async getCurrentDevise(userId: string, deviceId: string){
        let currentDevice = await userDeviceRepo.getDeviceByUsersAndDeviceId(userId, deviceId)
        return currentDevice
    },

    async doesUserHaveThisDevice(userId: string, deviceId: string): Promise<boolean>{
        let isDevice = await userDeviceRepo.getDeviceByUsersAndDeviceId(userId, deviceId)
        if (isDevice){
            return true
        } else return false
    },

    async isDeviceExist(deviceId: string){
      let isExist = await userDeviceRepo.getDeviceById(deviceId)
        return !!isExist;
    },

    async deleteAllDevices(): Promise<boolean>{
        return await userDeviceRepo.deleteAllDevices()
    },
}