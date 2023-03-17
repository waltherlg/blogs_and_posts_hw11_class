import nodemailer from "nodemailer";
import * as dotenv from 'dotenv'
dotenv.config()

const emailUser = process.env.MAIL_USER
const emailPassword = process.env.MAIL_PASSWORD
if (!emailUser || !emailPassword){
    throw new Error('password or user for emailAdapter not found')
}

export const emailAdapter = {
    async sendEmail(email: string, subject: string, massage: string){
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPassword
            },
        })
        let info = await transport.sendMail({
            from: 'Ruslan <ruslanluft>',
            to: email,
            subject: subject,
            html: massage
        })
    }
}

