import {emailAdapter} from "../adapters/email-adapter";
import {emailManager} from "../managers/email-manager";

export const businesService = {
    async doOperation(){
        await emailManager.sendEmailRecoveryMessage({})
    }
}