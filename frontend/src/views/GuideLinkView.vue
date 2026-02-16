<template>
  <div class="flex flex-col">

      <!-- TITLE -->
      <section class="text-center py-10 md:py-14">
        <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-3">Analisi rapida dei link sospetti</h1>
        <p class="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Impara a riconoscere le minacce di phishing analizzando gli elementi chiave di un sito web fasullo.
        </p>
      </section>

      <!-- MAIN 2-COLUMN -->
      <section class="container mx-auto px-4 lg:px-8 pb-12">
        <div class="grid lg:grid-cols-3 gap-6 lg:items-start">

          <!-- LEFT: browser/site image -->
          <div class="lg:col-span-2">
            <img src="/immagine_link.png" alt="Esempio di sito sospetto con segnali di pericolo evidenziati" class="w-full h-auto max-h-[720px] object-contain block" />
          </div>

          <!-- RIGHT: sidebar -->
          <div class="lg:col-span-1 flex flex-col gap-5">

            <!-- Azioni immediate -->
            <div class="rounded-2xl overflow-hidden p-4" style="background-color: #e8f5e9;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-green-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-green-800">Azioni immediate</h3>
              </div>
              <div class="space-y-3">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Controlla l'URL</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Verifica lettera per lettera il dominio del sito.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Analizza la pagina</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Cerca delle problematiche nella pagina web (immagini sfocate, loghi falsi, ecc.).</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Chiudi la scheda</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Non navigare ulteriormente in pagine sospette.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cosa non fare -->
            <div class="rounded-2xl overflow-hidden p-4" style="background-color: #ffebee;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-red-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-red-800">Cosa non fare</h3>
              </div>
              <div class="space-y-3">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non inserire dati</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Mai fornire password o codici OTP su link ricevuti.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non scaricare file</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Gli allegati o i download potrebbero contenere malware.</p>
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
              <h4 class="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Mancanza di HTTPS</h4>
              <p class="text-sm text-gray-500 leading-relaxed">L'assenza del lucchetto (HTTPS) indica che la connessione non è crittografata. I siti legittimi usano sempre https://.</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div class="w-10 h-10 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow">2</div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Dominio sospetto</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Estensioni come .com, .me, .dev al posto di .it per servizi italiani sono un segnale di siti contraffatti.</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div class="w-10 h-10 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow">3</div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Pulsante fuorviante</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Bottoni che invitano all'azione immediata ("ACCEDI", "Verifica ora") sono tipici delle pagine di phishing.</p>
            </div>

          </div>
        </div>
      </section>

  </div>
</template>

<script setup>
// Static guide page — no dynamic state needed
</script>
