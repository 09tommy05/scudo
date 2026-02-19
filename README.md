# SCUDO
## Introduzione
Il Servizio Comunale Unico per la Difesa Online (SCUDO) nasce con l’obiettivo di offrire uno strumento pratico e affidabile sul quale ogni cittadino possa contare in caso di minacce informatiche.
L’analfabetismo digitale e la scarsa consapevolezza dei rischi legati alla sicurezza informatica rappresentano oggi fattori critici che non possono essere ignorati.
Il comune svolge un ruolo centrale nel promuovere una comunicazione trasparente e nel fornire ai cittadini gli strumenti necessari per la difesa informatica.
Attraverso SCUDO, il Comune di Trento consolida il proprio impegno nella promozione della sicurezza digitale, offrendo una piattaforma di supporto e collaborazione accessibile a tutti.
Tramite una webapp, i cittadini possono consultare una guida pratica, semplice e concisa, pensata per aiutarli a prendere le decisioni corrette in caso di attacco informatico, anche in assenza di una connessione internet.
Organizzata per argomenti (ad esempio email, SMS, link, QR code, ecc.), la guida illustra quali elementi osservare per riconoscere una possibile minaccia e, soprattutto, quali azioni intraprendere in caso di positivo.
Le guide disponibili online risultano essere troppo complesse per chi non ha dimestichezza con il mondo digitale e, soprattutto, risulta ancora più difficile verificare la correttezza e l’attendibilità delle informazioni.
SCUDO supera questi limiti, offrendo contenuti chiari, corredati da esempi visivi e indicazioni semplici e concrete.

Un’altra colonna portante del progetto è la comunicazione tra il comune e i cittadini. Attraverso la piattaforma, infatti, i cittadini possono segnalare  (tramite un modulo dedicato) potenziali minacce che riguardano la collettività, come email di phishing relative a servizi comunali o richieste sospette di dati da parte di enti locali.
Gli operatori specializzati del comune analizzano le segnalazioni ricevute e, in caso di riscontro positivo, possono diramare un’allerta a tutti gli utenti registrati al servizio, che riceveranno una notifica direttamente sul proprio dispositivo.
Tutte le segnalazioni vengono raccolte in uno storico consultabile, pensato come strumento di consapevolezza e di educazione attiva alla sicurezza informatica. 
Per garantire un corretto e monitorato funzionamento del sistema di segnalazioni, per poter usufruirne sarà necessaria la registrazione tramite SPID/CIE.

## Struttura del repository
Il repository è strutturato in due cartelle principali: `backend` e `frontend`.
- La cartella `backend` contiene il codice sorgente del server, sviluppato utilizzando Node.js con il framework Express. Qui sono implementate le API RESTful che gestiscono l'autenticazione (tramite JWT), la gestione della guida, le segnalazioni e le comunicazioni.
- La cartella `frontend` ospita il codice sorgente della webapp, sviluppata con Vue.js. Questa parte del progetto si occupa dell'interfaccia utente, permettendo ai cittadini e agli operatori di interagire con le funzionalità offerte dal servizio SCUDO.

## Installazione e avvio
1. Clonare il repository:
   ```bash
    git clone https://github.com/09tommy05/scudo.git
    cd scudo
    ```
### Backend
Per avviare il progetto in locale, è necessario seguire questi passaggi:
1. Installare le dipendenze per il backend:
    ```bash
     cd backend
     npm install
     ```
2. Configurare le variabili d'ambiente:
    Creare un file `.env` nella cartella `backend` con le variabili presenti nel file `.env.example`. Qui vengono impostate anche le credenziali per la connessione al database MongoDB. E le credenziali per l'operatore admin, che può essere utilizzato per il primo accesso al sistema.
3. Avvio del database MongoDB:
    Assicurarsi di avere MongoDB installato e in esecuzione sulla propria macchina locale o utilizzare un servizio di database cloud.
4. Avviare il server backend:
    Se si dovesse trattare del primo avvio del server, eseguire il comando:
    ```bash
     npm run setup
     ```
     Che permette di creare l'operatore admin iniziale. E degli utenti di test per provare la funzionalità del login tramite SPID o CIE.
    Successivamente, avviare il server con:
    ```bash
    npm start
    ```

### Frontend
1. Installare le dipendenze per il frontend:
    ```bash
     cd frontend
     npm install
     ```
2. Configurare le variabili d'ambiente:
    Creare un file `.env` nella cartella `frontend` con le variabili presenti nel file `.env.example`. Qui viene impostato l'endpoint del server backend a cui la webapp si connetterà per effettuare le richieste API.
3. Buildare la webapp:
    ```bash
     npm run build
     ```
4. Avviare la webapp:
    ```bash
     npm run preview
     ```
La webapp sarà accessibile all'indirizzo `http://localhost:4173`.
## Documentazione
La documentazione delle API è disponibile nel file `oas3.yml` presente nella cartella `backend`. Questa documentazione segue lo standard OpenAPI 3.0 e può essere visualizzata utilizzando strumenti come Swagger UI o Redoc. Inoltre se il server backend è in esecuzione, la documentazione è accessibile all'indirizzo `http://localhost:PORT/api-docs`. Inoltre è possibile consultare la documentazione anche ai link: [https://scudo.docs.apiary.io/](https://scudo.docs.apiary.io/) e [https://app.swaggerhub.com/apis/scudo-912/scudo/1.0](https://app.swaggerhub.com/apis/scudo-912/scudo/1.0).