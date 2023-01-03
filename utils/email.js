const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

// user have name and email and url is click button url
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.from = `<${process.env.EMAIL_FROM}>`;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // send the actual email
    async send(template, subject) {
        // 1) render html based on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                subject,
                firstName: this.firstName,
                url: this.url
            }
        );

        // 2) define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        };

        //3) create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'welcome to the natours family');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'your reset password token is valid only for 10 minutes'
        );
    }
};
