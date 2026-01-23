import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Importazione dei modelli dai file forniti
import Report from '../app/models/report.js';
import ReportAnswer from '../app/models/reportAnswer.js';
import Communication from '../app/models/communication.js';
import Operator from '../app/models/operator.js';
import Article from '../app/models/article.js';
import User from '../app/models/user.js';

dotenv.config();

const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017/';

const seedDatabase = async () => {
    try {
        console.log('Connessione al database in corso...');
        await mongoose.connect(MONGO_URI);
        console.log('Connesso a MongoDB.');

        console.log('Pulizia delle collezioni esistenti...');
        await Promise.all([
            Operator.deleteMany({}),
            Article.deleteMany({}),
            Report.deleteMany({}),
            ReportAnswer.deleteMany({}),
            Communication.deleteMany({}),
            User.deleteMany({})
        ]);

        console.log('Creazione Operatori...');

        const plainPassword = '12345678';
        const plainPasswordEditor = 'e12345678';
        const plainPasswordReporter = 'r12345678';
        const hashedPassword = bcrypt.hashSync(plainPassword, 10);
        const hashedPasswordEditor = bcrypt.hashSync(plainPasswordEditor, 10);
        const hashedPasswordReporter = bcrypt.hashSync(plainPasswordReporter, 10);
        const admin = await Operator.create({
            name: 'Mario',
            surname: 'Rossi',
            email: process.env.ADMIN_EMAIL,
            password: bcrypt.hashSync(process.env.ADMIN_PSW, 10),
            role: 'admin',
            isActive: true
        });

        const operatorReporter = await Operator.create({
            name: 'Luca',
            surname: 'Bianchi',
            email: 'segnalazioni@scudo.tn.it',
            password: hashedPasswordReporter,
            role: 'reporter',
            isActive: true
        });

        const operatorEditor = await Operator.create({
            name: 'Giulia',
            surname: 'Verdi',
            email: 'redazione@scudo.tn.it',
            password: hashedPasswordEditor,
            role: 'editor',
            isActive: true
        });

        const users = await User.insertMany([
            {
                name: "Francesco",
                surname: "Marrone",
                email: "francesco.marrone@example.com",
                cf: "MRRFNC90A01H501S",
                password: hashedPassword,
                allow_notifications: true
            },
            {
                name: "Luigi",
                surname: "Verdi",
                email: "luigi.verdi@example.com",
                cf: "VRDLGU85B02H501V",
                password: hashedPassword,
                allow_notifications: true
            },
            {
                name: "Anna",
                surname: "Bianchi",
                email: "anna.bianchi@example.com",
                cf: "BNCHAN90C03H501W",
                password: hashedPassword,
                allow_notifications: false
            }
        ]);
        const francesco = users[0];
        const luigi = users[1];
        console.log("Test users created");

        console.log('Creazione Articoli della Guida...');
        await Article.create([
            {
                title: 'Come riconoscere una mail di Phishing',
                short_text: 'Guida rapida per analizzare mittente e contenuto.',
                text: 'Il phishing è una truffa digitale. Controlla sempre l\'indirizzo del mittente. Se contiene errori grammaticali o richiede urgenza, fai attenzione. Non cliccare mai su link sospetti.',
                author: operatorEditor._id,
                categoria: 'Email',
                isDraft: false,
                img: 'phishing_example.png'
            },
            {
                title: 'Password Sicure: le migliori pratiche',
                short_text: 'Come proteggere i tuoi account con password forti.',
                text: 'Usa almeno 12 caratteri, includi numeri e simboli. Non usare la stessa password per più servizi. Attiva l\'autenticazione a due fattori (2FA) dove possibile.',
                author: operatorEditor._id,
                categoria: 'Password',
                isDraft: false,
                img: 'password.jpg'
            },
            {
                title: 'Attenti agli SMS (Smishing)',
                short_text: 'Non cliccare sui link negli SMS della banca o delle poste.',
                text: 'Le banche non chiedono mai di cliccare su link via SMS per sbloccare il conto. Se ricevi un messaggio allarmante, chiama direttamente la filiale.',
                author: operatorEditor._id,
                categoria: 'SMS',
                isDraft: true // Questo rimane in bozza
            }
        ]);

        console.log('Creazione Comunicazioni...');
        await Communication.create({
            title: 'Allerta Truffa: False mail TARI',
            short_text: 'Circolano false email relative al pagamento della TARI.',
            text: 'Si avvisano i cittadini che stanno circolando email fraudolente relative a mancati pagamenti TARI. Il Comune di Trento non invia solleciti di pagamento tramite link diretti.',
            author: operatorReporter._id,
            categoria: 'Phishing',
            importance: 'alto rischio',
            isDraft: false
        });

        console.log('Creazione Segnalazioni...');

        const report1 = await Report.create({
            title: 'Ricevuto SMS strano da numero sconosciuto',
            text: 'Ho ricevuto un SMS che dice "Il tuo pacco è bloccato alla dogana", ma non aspetto nulla.',
            author: francesco._id,
            categoria: 'SMS',
            status: 'da elaborare',
            created: new Date()
        });

        const report2 = await Report.create({
            title: 'Email sospetta dalla Banca',
            text: 'Allego screenshot di una mail che sembra della mia banca ma l\'indirizzo è gmail.com.',
            author: luigi._id,
            categoria: 'Email',
            status: 'risolta', // Questa la segniamo come risolta
            attachments: ['screenshot_mail.jpg'],
            created: new Date(Date.now() - 86400000) // Creata ieri
        });

        console.log('Creazione Risposta...');
        await ReportAnswer.create({
            report: report2._id,
            title: 'Conferma tentativo di Phishing',
            text: 'Gentile utente, grazie per la segnalazione. Le confermiamo che si tratta di un tentativo di phishing. La banca non usa indirizzi Gmail. Provvederemo a segnalare il dominio.',
            author: operatorReporter._id
        });

        console.log('Seeding completato con successo!');
        console.log('------------------------------------------------');
        console.log(`Admin: ${admin.email} / ${plainPassword}`);
        console.log(`Reporter: ${operatorReporter.email} / ${plainPasswordReporter}`);
        console.log(`Editor: ${operatorEditor.email} / ${plainPasswordEditor}`);
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('Errore durante il seeding:', error);
    } finally {
        mongoose.disconnect();
        console.log('Connessione chiusa.');
        process.exit();
    }
};

seedDatabase();