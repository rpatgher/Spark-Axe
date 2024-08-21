import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";


const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    // use handlebars templates
    transport.use('compile', hbs({
        viewEngine: {
            extname: 'handlebars',
            defaultLayout: false
        },
        viewPath: './emails',
        extName: '.handlebars'
    }));


    const { name, email, url, subject, file } = options;
    // Send Mail
    await transport.sendMail({
        from: 'devJobs.com',
        to: email,
        subject,
        template: file,
        context: {
            name,
            url
        }
    });
}

export default sendEmail;