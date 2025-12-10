import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.NO_REPLY_EMAIL_USER,
        pass: process.env.NO_REPLY_EMAIL_PASSWORD,
    },
});

async function _sendEmailBase(destinatario, oggetto, templateName, data) {
    try {
        const templatePath = path.join(__dirname, '../email_templates', templateName);

        const htmlContent = await ejs.renderFile(templatePath, data);

        let info = await transporter.sendMail({
            from: '"SCUDO No-Reply" <no-reply@scudo.tn.it>',
            to: destinatario,
            replyTo: "assistenza@scudo.tn.it",
            subject: oggetto,
            html: htmlContent,
        });

        console.log(`[MAIL] Inviata a ${destinatario} | ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[MAIL ERROR] Invio fallito a ${destinatario}:`, error);
        throw error;
    }
}

const sendPasswordSetupEmail = async (email, nome, linkToken) => {
    const data = {
        nomeUtente: nome,
        linkAction: linkToken
    };
    
    return await _sendEmailBase(email, "Imposta la tua password - SCUDO", "set-password.ejs", data);
};

const sendUserNotification = async (email, nome, messaggio) => {
    const data = {
        nomeUtente: nome,
        messaggioContenuto: messaggio
    };
    return await _sendEmailBase(email, "Nuova comunicazione da SCUDO", "notification.ejs", data);
};

const mailer = {
    sendPasswordSetupEmail,
    sendUserNotification
};

export default mailer;