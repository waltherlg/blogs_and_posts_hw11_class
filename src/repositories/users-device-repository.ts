import {UserDeviceDBType, UserDeviceOutputType} from "../models/types";
import {ObjectId} from "mongodb";
import {UserDeviceModel} from "../schemes/schemes";

//export const userDeviceCollection = client.db("blogsAndPosts").collection<userDeviceDBType>("userDevices")
export const userDeviceRepo = {

    async addDeviceInfo(newDevice: UserDeviceDBType): Promise<boolean> {
        const result = await UserDeviceModel.insertMany(newDevice);
        return true
    },

    async getDeviceById(deviceId: string){
        if (ObjectId.isValid(deviceId)){
            let _id = new ObjectId(deviceId)
            const foundDevice = await UserDeviceModel.findOne({"_id": _id})
            if (foundDevice){
                return foundDevice
            } else return null
        }
    },

    async getActiveUserDevices(userId: string){
        if (ObjectId.isValid(userId)){
            const activeUserDevices = await UserDeviceModel.find({"userId": new ObjectId(userId)}).lean()
            return  activeUserDevices.map((device) => ({
                ip: device.ip,
                title: device.title,
                lastActiveDate: device.lastActiveDate,
                deviceId: device._id.toString()
            }))
        } else return null

    },

    async deleteAllUserDevicesExceptCurrent(userId: string, deviceId: string): Promise<boolean>{
        if (ObjectId.isValid(deviceId && userId)){
            let _id = new ObjectId(deviceId)
            const result = await UserDeviceModel.deleteMany({$and: [{"userId": new ObjectId(userId)}, {"_id": {$ne: _id}}]})
            return result.acknowledged
        }
        else return false
    },

    async deleteUserDeviceById(userId: string, deviceId: string): Promise<boolean>{
        if (ObjectId.isValid(deviceId && userId)){
            let _id = new ObjectId(deviceId)
            const result = await UserDeviceModel.deleteOne({$and:[{"_id": _id},{"userId": new ObjectId(userId)}]})
            return result.deletedCount === 1
        }
        else return false
    },

    async getDeviceByUsersAndDeviceId(userId: string, deviceId: string){
        if (ObjectId.isValid(userId) && ObjectId.isValid(deviceId)){
            let _id = new ObjectId(deviceId)
            let userIdObj = new ObjectId(userId)
            const device = await UserDeviceModel.findOne({$and:[{"_id": _id},{"userId": userIdObj}]})
            if (device){
                return device
            }
            else return null
        }
    },

    async refreshDeviceInfo (deviceId: string, lastActiveDate: string, expirationDate: string): Promise<boolean>{
        if (ObjectId.isValid(deviceId)) {
            let _id = new ObjectId(deviceId)
            const result = await UserDeviceModel.updateOne({"_id": _id},{
                $set: {
                    "lastActiveDate": lastActiveDate,
                    "expirationDate": expirationDate
                }
            })
            return result.matchedCount === 1
        }
        else return false
    },

    async deleteAllDevices(): Promise<boolean>{
        const result = await UserDeviceModel.deleteMany({})
        return result.acknowledged
    }

    //async refreshDeviceInfo

}