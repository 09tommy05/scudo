<template>
  <div class="flex flex-col">
    <div class="container mx-auto px-4 lg:px-8 pt-8">
      <router-link to="/"
        class="inline-flex items-center text-gray-500 hover:text-primary transition-colors font-medium group w-fit">
        <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
        Torna alla guida
      </router-link>
    </div>
    <!-- TITLE -->
    <section class="text-center py-10 md:py-14">
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-3">Analisi rapida Social Media & Profili</h1>
      <p class="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
        Impara a riconoscere istantaneamente i segnali di un profilo compromesso.
      </p>
    </section>

    <!-- MAIN 2-COLUMN: left = image + Hai perso l'accesso under it, right = sidebar (equal height) -->
    <section class="container mx-auto px-4 lg:px-8 pb-16">
      <div class="grid lg:grid-cols-3 gap-6 lg:items-stretch">

        <!-- LEFT: image + Hai perso l'accesso under it -->
        <div class="lg:col-span-2 flex flex-col gap-6 min-h-0">
          <div
            class="rounded-2xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden w-full shrink-0">
            <img src="/immagine_social.png" alt="Esempio di chat social con segnali di profilo compromesso evidenziati"
              class="w-full h-auto max-h-[720px] object-contain block" />
          </div>
          <div class="border-t border-gray-200 pt-6 flex-1 min-h-0 flex flex-col">
            <h2
              class="text-lg md:text-xl font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <span
                class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">?</span>
              Hai perso l'accesso?
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                <div
                  class="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 shadow">
                  1</div>
                <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Recupero account</h4>
                <p class="text-sm text-gray-500 leading-relaxed">Usa gli strumenti ufficiali di recupero della
                  piattaforma social.</p>
              </div>
              <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                <div
                  class="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 shadow">
                  2</div>
                <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Informa i follower</h4>
                <p class="text-sm text-gray-500 leading-relaxed">Avvisa i tuoi contatti tramite altri canali che il tuo
                  profilo è compromesso.</p>
              </div>
              <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                <div
                  class="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 shadow">
                  3</div>
                <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Contatta l'assistenza</h4>
                <p class="text-sm text-gray-500 leading-relaxed">Apri un ticket ufficiale con il supporto per
                  ripristinare l'identità.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: sidebar — same height as left (grid stretch), lists scroll if needed -->
        <div class="lg:col-span-1 flex flex-col gap-5 min-h-0">

          <!-- Azioni immediate -->
          <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col"
            style="background-color: #e8f5e9;">
            <div class="flex items-center gap-2 mb-2 shrink-0">
              <svg class="w-6 h-6 text-green-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              <h3 class="font-bold text-sm uppercase tracking-wider text-green-800">Azioni immediate</h3>
            </div>
            <p class="text-sm text-green-800/80 mb-4 shrink-0">Metti in sicurezza il tuo profilo ora</p>
            <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
              <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div class="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">Chiama l'amico</p>
                  <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Verifica tramite telefono che sia davvero lui
                    prima di fare qualsiasi azione.</p>
                </div>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 21v-2.7a2 2 0 012-2h2.1a2 2 0 001.4-.6 2 2 0 002.8 0 2 2 0 001.4.6H19a2 2 0 012 2V21M7 5a2 2 0 012-2h6a2 2 0 012 2v12M7 5v12m10-12v12" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">Segnala profilo</p>
                  <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Usa la funzione "Segnala" della piattaforma
                    per profili clonati o sospetti.</p>
                </div>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">Privacy</p>
                  <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Controlla le impostazioni di sicurezza e
                    attiva l'autenticazione a due fattori.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cosa non fare -->
          <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col"
            style="background-color: #ffebee;">
            <div class="flex items-center gap-2 mb-2 shrink-0">
              <svg class="w-6 h-6 text-red-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
              <h3 class="font-bold text-sm uppercase tracking-wider text-red-800">Cosa non fare</h3>
            </div>
            <p class="text-sm text-red-800/80 mb-4 shrink-0">Evita questi errori fatali</p>
            <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
              <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3 border border-red-200">
                <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">No denaro</p>
                  <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Mai inviare soldi via social o app, anche se
                    sembra un amico.</p>
                </div>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3 border border-red-200">
                <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">No codici 2FA</p>
                  <p class="text-sm text-gray-500 leading-relaxed mt-0.5">I codici sono personali, mai condividerli con
                    nessuno via chat.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
// Static guide page — no dynamic state needed
</script>
