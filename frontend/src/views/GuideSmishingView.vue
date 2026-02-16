<template>
  <div class="flex flex-col">

      <!-- TITLE -->
      <section class="text-center py-10 md:py-14">
        <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-3">Analisi istantanea: SMS sospetto</h1>
        <p class="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Non farti ingannare dallo Smishing. Impara a riconoscere i segnali di pericolo in pochi secondi e proteggi il tuo conto.
        </p>
      </section>

      <!-- MAIN 2-COLUMN: left = image + under section, right = sidebar (equal height) -->
      <section class="container mx-auto px-4 lg:px-8 pb-16">
        <div class="grid lg:grid-cols-3 gap-6 lg:items-stretch">

          <!-- LEFT: image + Dettagli dei segnali under it -->
          <div class="lg:col-span-2 flex flex-col gap-6 min-h-0">
            <img src="/immagine_telefono.png" alt="Esempio di SMS di smishing con segnali di pericolo evidenziati" class="w-full h-auto max-h-[720px] object-contain block shrink-0" />
            <div class="border-t border-gray-200 pt-6 flex-1 min-h-0 flex flex-col">
              <h2 class="text-lg md:text-xl font-black uppercase tracking-wider text-gray-900 mb-4">Dettagli dei segnali di pericolo</h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                  <div class="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 shadow">1</div>
                  <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Mittente sconosciuto</h4>
                  <p class="text-sm text-gray-500 leading-relaxed">Le banche usano mittenti testuali (es. "BANCA") o numeri certificati, non cellulari privati.</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                  <div class="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 shadow">2</div>
                  <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Link sospetto</h4>
                  <p class="text-sm text-gray-500 leading-relaxed">Uso di abbreviatori (bit.ly) o domini simili ma errati. Controlla sempre l'URL ufficiale.</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                  <div class="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 shadow">3</div>
                  <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Urgenza fasulla</h4>
                  <p class="text-sm text-gray-500 leading-relaxed">Il linguaggio mira a spaventarti ("blocco permanente") per farti agire senza pensare.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: sidebar — same height as left (grid stretch) -->
          <div class="lg:col-span-1 flex flex-col gap-5 min-h-0">

            <!-- Azioni da fare -->
            <div class="rounded-2xl overflow-hidden p-4 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col" style="background-color: #e8f5e9;">
              <div class="flex items-center gap-2 mb-4 shrink-0">
                <svg class="w-6 h-6 text-green-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <h3 class="font-bold text-sm uppercase tracking-wider text-green-800">Azioni da fare</h3>
              </div>
              <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Blocca mittente</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Inserisci il numero nella lista nera del tuo smartphone.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Elimina l'SMS</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Rimuovi il messaggio definitivamente per evitare tocchi accidentali.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Segnala alla banca</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Usa i canali ufficiali per avvisare del tentativo di frode.</p>
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
              <div class="space-y-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
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
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Confermeresti che il tuo numero è attivo, attirando altri attacchi.</p>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Non fornire dati</p>
                    <p class="text-sm text-gray-500 leading-relaxed mt-0.5">Nessuna banca chiede PIN o password via SMS.</p>
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
