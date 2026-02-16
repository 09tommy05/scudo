<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-3xl font-bold text-gray-900 mb-3">Invia una Segnalazione</h1>
    <p class="text-gray-600 mb-10">
      Aiutaci a proteggere la città. Segnala email sospette, SMS truffaldini o siti web pericolosi.
      I nostri esperti analizzeranno i dati per prevenire attacchi alla comunità.
    </p>

    <form @submit.prevent="submit" class="space-y-10">
      <!-- 1. Tipo di minaccia -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <span class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-lg">1</span>
          <h2 class="text-xl font-bold text-gray-900">Tipo di minaccia</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            v-for="opt in threatTypes"
            :key="opt.value"
            type="button"
            @click="form.categoria = opt.value"
            :class="[
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-white text-left transition-all duration-200',
              form.categoria === opt.value
                ? 'border-primary bg-primary-light/30 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            ]"
          >
            <component :is="opt.icon" class="w-8 h-8 shrink-0" :class="form.categoria === opt.value ? 'text-primary' : 'text-gray-400'" />
            <span class="text-sm font-medium text-gray-800 text-center">{{ opt.label }}</span>
          </button>
        </div>
        <p v-if="submitted && !form.categoria" class="mt-2 text-sm text-red-600">Seleziona un tipo di minaccia.</p>
      </section>

      <!-- 2. Dettagli della segnalazione -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <span class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-lg">2</span>
          <h2 class="text-xl font-bold text-gray-900">Dettagli della segnalazione</h2>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Descrizione della minaccia</label>
          <textarea
            v-model="form.text"
            rows="5"
            placeholder="Descrivi cosa è successo. Includi il mittente, il link ricevuto o qualsiasi comportamento anomalo riscontrato."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y"
          />
          <p v-if="submitted && !form.text.trim()" class="mt-1 text-sm text-red-600">Inserisci una descrizione.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Carica prove (Screenshot, File)</label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors"
            :class="{ 'border-primary bg-primary-light/10': isDragging, 'bg-gray-50/50': !isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
              class="hidden"
              @change="onFileSelect"
            />
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p class="text-gray-600 text-sm">
              Trascina i file qui o <button type="button" @click="fileInput?.click()" class="text-primary font-medium hover:underline">sfoglia</button>
            </p>
            <p class="text-gray-400 text-xs mt-1">PNG, JPG o PDF fino a 10MB</p>
            <ul v-if="files.length > 0" class="mt-4 text-left text-sm text-gray-600 space-y-1">
              <li v-for="(f, i) in files" :key="i" class="flex items-center justify-between gap-2">
                <span class="truncate">{{ f.name }}</span>
                <button type="button" @click="removeFile(i)" class="text-red-600 hover:text-red-700 shrink-0">Rimuovi</button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- GDPR e invio -->
      <section class="pt-4">
        <label class="flex items-start gap-3 cursor-pointer">
          <input v-model="form.consent" type="checkbox" class="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
          <span class="text-sm text-gray-700">
            <span class="font-semibold text-gray-900">Consenso al trattamento dati GDPR</span><br/>
            Dichiaro di aver preso visione dell'informativa sulla privacy. I dati forniti verranno utilizzati esclusivamente per scopi di pubblica sicurezza e analisi delle minacce.
          </span>
        </label>
        <p v-if="submitted && !form.consent" class="mt-1 text-sm text-red-600">È necessario accettare l'informativa sulla privacy.</p>

        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
          <router-link v-if="error.includes('accesso')" to="/login/cittadino" class="block mt-2 font-medium text-primary hover:underline">Accedi con SPID/CIE</router-link>
        </div>
        <div v-if="success" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Segnalazione inviata con successo. Grazie per il tuo contributo.
        </div>

        <button
          type="submit"
          :disabled="sending"
          class="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="!sending" class="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span v-else class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ sending ? 'Invio in corso...' : 'Invia Segnalazione' }}
        </button>
      </section>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const fileInput = ref(null);
const isDragging = ref(false);
const submitted = ref(false);
const sending = ref(false);
const error = ref(null);
const success = ref(false);
const files = ref([]);

const threatTypes = [
  { value: 'Email Phishing', label: 'Email Phishing', icon: IconEnvelope },
  { value: 'SMS Truffa', label: 'SMS Truffa', icon: IconSms },
  { value: 'Sito Sospetto', label: 'Sito Sospetto', icon: IconLink },
  { value: 'Social Media', label: 'Social Media', icon: IconShare },
  { value: 'Vishing (Voce)', label: 'Vishing (Voce)', icon: IconPhone },
  { value: 'Altro', label: 'Altro', icon: IconDots },
];

const form = reactive({
  categoria: '',
  text: '',
  consent: false,
});

function IconEnvelope(props) {
  return h('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
  ]);
}
function IconSms(props) {
  return h('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
  ]);
}
function IconLink(props) {
  return h('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' })
  ]);
}
function IconShare(props) {
  return h('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' })
  ]);
}
function IconPhone(props) {
  return h('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })
  ]);
}
function IconDots(props) {
  return h('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z' })
  ]);
}

function onDrop(e) {
  isDragging.value = false;
  addFiles(e.dataTransfer?.files);
}

function onFileSelect(e) {
  addFiles(e.target?.files);
  if (fileInput.value) fileInput.value.value = '';
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPT = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

function addFiles(fileList) {
  if (!fileList?.length) return;
  for (let i = 0; i < fileList.length; i++) {
    const f = fileList[i];
    if (files.value.length >= 10) break;
    if (!ACCEPT.includes(f.type) && !/\.(png|jpe?g|pdf)$/i.test(f.name)) continue;
    if (f.size > MAX_SIZE) continue;
    files.value.push(f);
  }
}

function removeFile(index) {
  files.value.splice(index, 1);
}

async function submit() {
  submitted.value = true;
  error.value = null;
  success.value = false;
  if (!form.categoria || !form.text.trim() || !form.consent) return;

  sending.value = true;
  try {
    const formData = new FormData();
    formData.append('title', 'Segnalazione ' + form.categoria);
    formData.append('text', form.text.trim());
    formData.append('categoria', form.categoria);
    files.value.forEach(f => formData.append('attachments', f));

    await api.createReport(formData);
    success.value = true;
    form.categoria = '';
    form.text = '';
    form.consent = false;
    files.value = [];
    submitted.value = false;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    if (err.response?.status === 401) {
      error.value = 'Effettua l\'accesso con SPID/CIE per inviare una segnalazione.';
    } else {
      error.value = msg || 'Errore durante l\'invio. Riprova.';
    }
  } finally {
    sending.value = false;
  }
}
</script>
