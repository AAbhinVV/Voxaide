import {createTransport} from 'nodemailer';

const sendMail = async ({email, subject, html}) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "test",
            password: 'test123'
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