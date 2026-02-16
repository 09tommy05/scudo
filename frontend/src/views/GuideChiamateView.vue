<template>
  <div class="flex flex-col">

      <!-- TITLE -->
      <section class="text-center py-10 md:py-14">
        <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-3">Analisi rapida chiamate sospette (Vishing)</h1>
        <p class="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Impara a riconoscere le tecniche di manipolazione telefonica in tempo reale.
        </p>
      </section>

      <!-- MAIN 2-COLUMN: left = image + Il consiglio, right = sidebar (Azioni + Cosa non fare) -->
      <section class="container mx-auto px-4 lg:px-8 pb-12">
        <div class="grid lg:grid-cols-3 gap-6 lg:items-stretch">

          <!-- LEFT: image + Il consiglio -->
          <div class="lg:col-span-2 flex flex-col gap-6 min-h-0 order-1">
            <img src="/immagine_call.png" alt="Esempio di chiamata sospetta con segnali di vishing evidenziati" class="w-full h-auto max-h-[720px] object-contain block shrink-0" />
            <div class="rounded-2xl border-2 p-5 flex-1 min-h-0 flex flex-col shrink-0" style="border-color: #bbdefb; background-color: #e3f2fd;">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background-color: #2196f3;">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">Il consiglio</h3>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Ricorda: le banche non chiedono mai password, codici OTP o dati sensibili tramite chiamata vocale non sollecitata.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: sidebar — Azioni immediate + Cosa non fare -->
          <div class="lg:col-span-1 flex flex-col gap-5 min-h-0 order-2">

            <!-- Azioni immediate -->
            <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col" style="background-color: #e8f5e9;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-green-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M13 10V3L4 14h7v7l9-11h-7z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-green-800">Azioni immediate</h3>
              </div>
              <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Chiudi la chiamata</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Interrompi subito la conversazione se sospetti una truffa.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Chiama numero ufficiale</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Verifica contattando il numero sul sito ufficiale della banca o del servizio.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Blocca il numero</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Aggiungi il numero alla lista dei bloccati sul tuo smartphone.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cosa non fare -->
            <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col" style="background-color: #ffebee;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-red-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-red-800">Cosa non fare</h3>
              </div>
              <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non rispondere mai con "Sì"</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">La risposta può essere registrata e usata per autorizzazioni fraudolente.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non fornire codici OTP via telefono</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Nessun operatore legittimo chiederà mai codici ricevuti per SMS o app.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- HAI DATO INFORMAZIONI? (full width below grid) -->
      <section class="container mx-auto px-4 lg:px-8 pb-16">
        <div class="border-t border-gray-200 pt-12">
          <h2 class="text-center text-lg md:text-xl font-black uppercase tracking-wider text-gray-900 mb-10">Hai dato informazioni?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
              <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              </div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Blocca le carte</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Contatta immediatamente la tua banca tramite l'app ufficiale per sospendere ogni operatività.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
              <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Avvisa i familiari</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Informa i tuoi contatti stretti: i truffatori potrebbero usare i tuoi dati per colpire loro.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
              <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Denuncia l'accaduto</h4>
              <p class="text-sm text-gray-500 leading-relaxed">Recati presso le autorità o la Polizia Postale per sporgere una querela formale.</p>
            </div>
          </div>
        </div>
      </section>

  </div>
</template>

<script setup>
// Static guide page — no dynamic state needed
</script>
