import User from '../models/user.js';
import mailer from './mailer.js'; // assicurati che punti al tuo mailer reale

const DELAY_MS = 1200; // ~1 mail/sec per non superare limiti SMTP
const BATCH_SIZE = 20;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendCommunicationNotifications(nomeComunicazione, messaggio, link) {
    let page = 0;
    let sentCount = 0;

    while (true) {
        const users = await User.find({
            allow_notifications: true,
            email: { $exists: true, $ne: '' }
        })
            .select('email name surname')
            .limit(BATCH_SIZE)
            .skip(page * BATCH_SIZE)
            .lean();

        if (users.length === 0) break;

        for (const user of users) {
            try {
                const fullName = `${user.name} ${user.surname}`;

                await mailer.sendUserNotificationCommunication(
                    user.email,
                    nomeComunicazione,
                    fullName,
                    messaggio,
                    link
                );

                sentCount++;
                await sleep(DELAY_MS); // piccolo delay per non superare limiti

            } catch (err) {
                console.error(`Errore invio mail a ${user.email}:`, err.message);
            }
        }
        page++;
    }

    console.log(`Inviate ${sentCount} notifiche`);
    return sentCount;
}
