import {createTransport} from 'nodemailer';

const sendMail = async ({email, subject, html}) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.SMTP_USER ,
            pass: process.env.SMTP_PWD
        }
    });

    await transport.sendMail({
        from: "Voxiade",
        to: email,
        subject,
        html

    })
}

export default sendMail;