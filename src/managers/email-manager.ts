import {emailAdapter} from "../adapters/email-adapter";
import {PasswordRecoveryModel} from "../models/users-models";

export const emailManager = {
    async sendEmailRecoveryMessage(user: any){
        await emailAdapter.sendEmail(user.email, "password recovery", "")
    },

    async sendEmailConfirmationMessage(user: any){
        const confirmationCode = `<a href="https://some-front.com/confirm-registration?code=${user.confirmationCode}">complete registration</a>`
        await emailAdapter.sendEmail(user.email, "confirmation code", confirmationCode)
    },

    async resendEmailConfirmationMessage(refreshConfirmationData: any){
        const confirmationCode = '<a href="https://some-front.com/confirm-registration?code=' + refreshConfirmationData.confirmationCode + '">complete registration</a>'
        await emailAdapter.sendEmail(refreshConfirmationData.email, "resending confirmation code", confirmationCode)
    },

    async sendPasswordRecoveryMessage(passwordRecoveryData: PasswordRecoveryModel){
        const passwordRecoveryCodeLink = `<a href='https://somesite.com/password-recovery?recoveryCode=${passwordRecoveryData.passwordRecoveryCode}">recovery password code</a>`
        await emailAdapter.sendEmail(passwordRecoveryData.email, "password recovery code", passwordRecoveryCodeLink)
    }
}
