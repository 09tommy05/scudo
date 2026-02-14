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
        const templatePath = path.join(__dirname, './email_templates', templateName);

        const htmlContent = await ejs.renderFile(templatePath, data);

        let info = await transporter.sendMail({
            from: '"SCUDO No-Reply" <' + process.env.NO_REPLY_EMAIL_USER + '>',
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
        linkAction: linkToken,
        logoUrl: process.env.CURRENT_HOST + "/favicon.svg"
    };
    
    return await _sendEmailBase(email, "Imposta la tua password - SCUDO", "set-password.ejs", data);
};

const sendUserNotificationCommunication = async (email, nomeComunicazione, nome, messaggio,link) => {
    const data = {
        nomeUtente: nome,
        nomeComunicazione: nomeComunicazione,
        messaggioContenuto: messaggio,
        linkComunicazione: link,
        logoUrl: process.env.CURRENT_HOST + "/favicon.svg"
    };
    return await _sendEmailBase(email, "SCUDO - Nuova comunicazione: " + nomeComunicazione, "communication_notification.ejs", data);
};

const sendUserNotificationReport = async (email, object, nome, title, link) => {
    const data = {
        nomeUtente: nome,
        title: title,
        link: link,
        logoUrl: process.env.CURRENT_HOST + "/favicon.svg"
    };
    return await _sendEmailBase(email, object, "report_notification.ejs", data);
};

const mailer = {
    sendPasswordSetupEmail,
    sendUserNotificationCommunication,
    sendUserNotificationReport
};

export default mailer;