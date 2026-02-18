<template>
  <div v-if="showBanner"
    class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 transform translate-y-0">
    
    <!-- STANDARD BANNER CONTENT -->
    <div v-if="!showIosInstructions" class="container mx-auto max-w-md flex flex-col gap-4">
      <div class="flex items-start gap-4">
        <div class="bg-primary/10 p-3 rounded-xl shrink-0">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-gray-900 text-sm mb-1">Installa l'App SCUDO</h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            Aggiungi alla schermata home per un accesso più rapido e sicuro.
          </p>
        </div>
        <button @click="dismissBanner" class="text-gray-400 hover:text-gray-600 p-1">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3">
         <button @click="dismissBanner"
          class="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
          Più tardi
        </button>
        <button @click="installPwa"
          class="w-full py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
          Installa
        </button>
      </div>
    </div>

    <!-- IOS MANUAL INSTRUCTIONS -->
    <div v-else class="container mx-auto max-w-md flex flex-col gap-4 animate-fade-in">
        <div class="flex items-start gap-3">
             <div class="bg-primary/10 p-2 rounded-lg shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h3 class="font-bold text-gray-900 text-sm mb-2">Come installare su iOS:</h3>
                <ol class="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                    <li>Premi il tasto <strong>Condividi</strong> <span class="inline-block align-middle"><svg class="w-4 h-4 inline text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></span> nella barra in basso.</li>
                    <li>Scorri e seleziona <strong>"Aggiungi alla schermata Home"</strong>.</li>
                    <li>Premi <strong>Aggiungi</strong> in alto a destra.</li>
                </ol>
            </div>
             <button @click="dismissBanner" class="text-gray-400 hover:text-gray-600 p-1 self-start">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <button @click="dismissBanner" class="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Ho capito
        </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showBanner = ref(false);
const showIosInstructions = ref(false);
const deferredPrompt = ref(null);
const isIos = ref(false);

const checkIsMobile = () => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

const checkIsIos = () => {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua);
};

const checkIsStandalone = () => {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
};

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
  if (checkIsMobile() && !localStorage.getItem('pwa-banner-dismissed')) {
    showBanner.value = true;
  }
};

const installPwa = async () => {
  if (isIos.value) {
      showIosInstructions.value = true;
      return;
  }

  if (!deferredPrompt.value) return;
  
  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  deferredPrompt.value = null;
  showBanner.value = false;
};

const dismissBanner = () => {
  showBanner.value = false;
  localStorage.setItem('pwa-banner-dismissed', 'true');
};

onMounted(() => {
  isIos.value = checkIsIos();
  
  if (isIos.value && !checkIsStandalone() && !localStorage.getItem('pwa-banner-dismissed')) {
      showBanner.value = true;
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>