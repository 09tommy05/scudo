<template>
  <div v-if="showBanner"
    class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 transform translate-y-0">
    <div class="container mx-auto max-w-md flex flex-col gap-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showBanner = ref(false);
const deferredPrompt = ref(null);

const isMobile = () => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
  if (isMobile() && !localStorage.getItem('pwa-banner-dismissed')) {
    showBanner.value = true;
  }
};

const installPwa = async () => {
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
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>
