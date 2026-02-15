<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- NAV -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors group">
          <svg class="h-5 w-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="font-bold text-lg">SCUDO</span>
          <span class="text-gray-400 font-normal text-sm">Guide</span>
        </router-link>
        <div class="flex items-center gap-4">
          <span class="hidden sm:inline text-xs font-semibold uppercase tracking-widest text-gray-400">Modulo 01: email sospetta</span>
          <router-link to="/report/create"
            class="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary-dark transition-colors">
            Report
          </router-link>
        </div>
      </div>
    </nav>

    <!-- CONTENT -->
    <main class="flex-1">

      <!-- TITLE -->
      <section class="text-center py-10 md:py-14">
        <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-3">Analisi rapida phishing</h1>
        <p class="text-gray-500 text-base md:text-lg">Identifica i segnali di pericolo in meno di 5 secondi.</p>
      </section>

      <!-- MAIN 2-COLUMN -->
      <section class="container mx-auto px-4 lg:px-8 pb-12">
        <div class="grid lg:grid-cols-3 gap-6 lg:items-stretch">

          <!-- LEFT: email image (no extra border — styling is in the image) -->
          <div class="lg:col-span-2">
            <img src="/immagine_mail.png" alt="Esempio di email di phishing con segnali di pericolo evidenziati" class="w-full h-auto block" />
          </div>

          <!-- RIGHT: sidebar — same height as image (grid stretch), two blocks share space -->
          <div class="lg:col-span-1 flex flex-col gap-5 min-h-0">

            <!-- Azioni da fare -->
            <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col" style="background-color: #e8f5e9;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-green-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-green-800">Azioni da fare</h3>
              </div>
              <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Blocca mittente</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Inserisci l'indirizzo nella lista bloccati del tuo client email.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Elimina l'email</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Rimuovi il messaggio definitivamente per evitare tocchi accidentali.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Segnala al provider</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Usa i canali ufficiali per segnalare il tentativo di phishing.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cosa non fare -->
            <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col" style="background-color: #ffebee;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-red-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-red-800">Cosa non fare</h3>
              </div>
              <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non cliccare il link</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Potrebbe scaricare malware o rubare le tue credenziali.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non rispondere</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Confermeresti che il tuo indirizzo è attivo, attirando altri attacchi.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non fornire dati</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Nessun servizio legittimo chiede password o dati sensibili via email.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- DETTAGLI DEI SEGNALI DI PERICOLO -->
      <section class="container mx-auto px-4 lg:px-8 pb-16">
        <div class="border-t border-gray-200 pt-12">
          <h2 class="text-center text-lg md:text-xl font-black uppercase tracking-wider text-gray-900 mb-10">Dettagli dei segnali di pericolo</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div class="w-10 h-10 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow">1</div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Mittente</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Nome e logo sospetti che imita l'originale. Controlla sempre attentamente l'indirizzo email dopo il simbolo @.</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div class="w-10 h-10 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow">2</div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Tono urgente</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Pressione psicologica per farti agire in fretta senza riflettere. L'urgenza è un'arma classica del phishing.</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div class="w-10 h-10 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow">3</div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Link/bottone</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Punta a un sito falso (simile all'originale) creato per rubare le tue credenziali. Non cliccare su nessun bottone o link.</p>
            </div>

          </div>
        </div>
      </section>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-gray-200 bg-white mt-auto">
      <div class="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <a href="mailto:scudo@comune.trento.it" class="hover:text-primary transition-colors">Contattaci</a>
          <router-link to="/" class="hover:text-primary transition-colors">Documentazione</router-link>
          <a href="#" class="hover:text-primary transition-colors">Privacy</a>
        </div>
        <router-link to="/report/create"
          class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-green-50 border border-green-300 text-green-700 text-xs font-bold hover:bg-green-100 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span class="uppercase tracking-wider">Pensi che questa minaccia possa colpire altri cittadini? Aiutaci a difendere Trento.</span>
        </router-link>
      </div>
    </footer>

  </div>
</template>

<script setup>
// Static guide page — no dynamic state needed
</script>
