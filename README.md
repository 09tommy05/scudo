# SCUDO

**Primo classificato nel contest "100 progetti per il Comune di Trento"**

## Introduzione
Il **Servizio Comunale Unico per la Difesa Online (SCUDO)** nasce con l'obiettivo di offrire uno strumento pratico e affidabile sul quale ogni cittadino possa contare in caso di minacce informatiche.

L'analfabetismo digitale e la scarsa consapevolezza dei rischi legati alla sicurezza informatica rappresentano oggi fattori critici che non possono essere ignorati. Il Comune svolge un ruolo centrale nel promuovere una comunicazione trasparente e nel fornire ai cittadini gli strumenti necessari per la difesa informatica.

Attraverso SCUDO, il Comune di Trento consolida il proprio impegno nella promozione della sicurezza digitale, offrendo una piattaforma di supporto e collaborazione accessibile a tutti.

Tramite una webapp, i cittadini possono consultare una guida pratica, semplice e concisa, pensata per aiutarli a prendere le decisioni corrette in caso di attacco informatico, anche in assenza di una connessione internet. Organizzata per argomenti (ad esempio email, SMS, link, QR code, ecc.), la guida illustra quali elementi osservare per riconoscere una possibile minaccia e, soprattutto, quali azioni intraprendere in caso positivo.

Le guide disponibili online risultano essere spesso troppo complesse per chi non ha dimestichezza con il mondo digitale e, soprattutto, risulta ancora più difficile verificare la correttezza e l'attendibilità delle informazioni. SCUDO supera questi limiti, offrendo contenuti chiari, corredati da esempi visivi e indicazioni semplici e concrete.

Un'altra colonna portante del progetto è la comunicazione tra il Comune e i cittadini. Attraverso la piattaforma, infatti, i cittadini possono segnalare (tramite un modulo dedicato) potenziali minacce che riguardano la collettività, come email di phishing relative a servizi comunali o richieste sospette di dati da parte di enti locali.

Gli operatori specializzati del Comune analizzano le segnalazioni ricevute e, in caso di riscontro positivo, possono diramare un'allerta a tutti gli utenti registrati al servizio, che riceveranno una notifica direttamente sul proprio dispositivo. Tutte le segnalazioni vengono raccolte in uno storico consultabile, pensato come strumento di consapevolezza e di educazione attiva alla sicurezza informatica.

Per garantire un corretto monitoraggio del sistema di segnalazioni e per poterne usufruire, è necessaria la registrazione tramite SPID/CIE.

## Struttura del repository
Il progetto è suddiviso in due componenti principali:
- **`backend`**: Contiene il codice sorgente del server, sviluppato in Node.js con Express. Implementa le API RESTful per gestire l'autenticazione (tramite JWT), i contenuti della guida, le segnalazioni degli utenti e le comunicazioni ufficiali.
- **`frontend`**: Ospita il codice della webapp, realizzata con Vue.js. Gestisce l'interfaccia utente, permettendo l'interazione fluida sia da parte dei cittadini che degli operatori.

## Installazione e avvio

### Prerequisiti
- Node.js (versione minima raccomandata: 18)
- MongoDB installato localmente oppure un URL di connessione a un database in cloud (es. MongoDB Atlas)

### 1. Clonare il repository
```bash
git clone https://github.com/09tommy05/scudo.git
cd scudo
```

### 2. Configurazione Backend
1. Spostarsi nella cartella `backend` e installare le dipendenze:
   ```bash
   cd backend
   npm install
   ```
2. Configurare le variabili d'ambiente creando un file `.env` (è possibile basarsi sul file `.env.example`). Assicurarsi di impostare correttamente le credenziali di connessione a MongoDB e i dati dell'operatore admin o di default per il primo accesso.
3. Se è il primo avvio del sistema, eseguire lo script di setup per creare l'admin iniziale e gli utenti di test per il login tramite SPID/CIE:
   ```bash
   npm run setup
   ```
4. Avviare il server backend:
   ```bash
   npm start
   ```

### 3. Configurazione Frontend
1. Aprire una nuova finestra del terminale, spostarsi nella cartella `frontend` e installare le dipendenze:
   ```bash
   cd frontend
   npm install
   ```
2. Creare un file `.env` (basandosi su `.env.example`) indicando l'endpoint corretto del backend a cui la webapp si connetterà.
3. Compilare l'applicazione per la produzione:
   ```bash
   npm run build
   ```
4. Avviare l'anteprima della webapp:
   ```bash
   npm run preview
   ```
La webapp sarà ora accessibile all'indirizzo `http://localhost:4173`.

## Documentazione API
La documentazione delle API segue lo standard OpenAPI 3.0 ed è disponibile nel file `oas3.yml` all'interno della cartella `backend`.

A server avviato, è possibile consultarla interattivamente tramite Swagger UI all'indirizzo: `http://localhost:PORT/api-docs`

In alternativa, la documentazione è ospitata e liberamente accessibile sui seguenti portali:
- [Apiary (scudo.docs.apiary.io)](https://scudo.docs.apiary.io/)
- [SwaggerHub](https://app.swaggerhub.com/apis/scudo-912/scudo/1.0)