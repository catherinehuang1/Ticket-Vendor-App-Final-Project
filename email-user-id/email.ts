
import "dotenv/config";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

class EmailConnection {

    transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    send(recipient: string, subject: string, body: string): void {
        const mail_options: Mail.Options = {
            from: process.env.EMAIL_ADDRESS,
            to: recipient,
            subject,
            text: body
        };
        this.transporter.sendMail(mail_options, function(error: Error | null, info: any) {
            if (error) {
                console.log(error);
            }
        });
    }
}

export default EmailConnection;