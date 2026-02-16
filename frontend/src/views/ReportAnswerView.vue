<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="mb-6">
        <router-link
          :to="{ name: 'user-dashboard' }"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32L109.3 224 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
          </svg>
          Torna al profilo
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p class="text-red-600 font-medium">{{ error }}</p>
        <router-link :to="{ name: 'user-dashboard' }" class="mt-4 inline-block text-primary hover:underline">Torna al profilo</router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Colonna sinistra: i miei dati + la mia segnalazione -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-800">I miei dati</h2>
            </div>
            <div v-if="report?.author" class="p-6 space-y-3 text-sm">
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Nome</p>
                <p class="text-gray-900 font-semibold">{{ report.author.name }} {{ report.author.surname }}</p>
              </div>
              <div v-if="user?.email">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
                <p class="text-gray-900 font-semibold">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-800">La mia segnalazione</h2>
              <span v-if="report" :class="['inline-flex px-2.5 py-1 text-xs font-semibold rounded-full uppercase', getStatusColor(report.status)]">
                {{ report.status }}
              </span>
            </div>
            <div v-if="report" class="p-6 space-y-4">
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Data</p>
                <p class="text-gray-900 font-semibold">{{ formatDate(report.created_at || report.created) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Titolo</p>
                <p class="text-gray-900 font-bold">{{ report.title }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Categoria</p>
                <span class="inline-flex px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">{{ report.categoria }}</span>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descrizione</p>
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p class="text-sm text-gray-700 whitespace-pre-line">{{ report.text }}</p>
                </div>
              </div>
              <div v-if="report.attachments && report.attachments.length">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Allegati</p>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="(att, i) in report.attachments"
                    :key="i"
                    :href="getAttachmentUrl(att)"
                    :download="getAttachmentFileName(att)"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:border-primary transition-colors"
                  >
                    <svg class="w-4 h-4 text-gray-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM175 441c9.4 9.4 24.6 9.4 33.9 0l64-64c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-23 23 0-86.1c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 86.1-23-23c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64z"/></svg>
                    <span class="truncate max-w-[180px]">{{ getAttachmentFileName(att) }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonna destra: operatore + risposta -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-800">Risposta dell'operatore</h2>
            </div>
            <div v-if="answerLoading" class="p-6 flex justify-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="!answer" class="p-6 text-center text-gray-500">
              <p>Risposta non disponibile.</p>
            </div>
            <div v-else class="p-6 space-y-4">
              <div v-if="answer.author">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Operatore</p>
                <p class="text-gray-900 font-semibold">{{ answer.author.name }} {{ answer.author.surname }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Data risposta</p>
                <p class="text-gray-900 font-semibold">{{ formatDate(answer.created_at || answer.created) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Titolo</p>
                <p class="text-gray-900 font-bold">{{ answer.title }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Messaggio</p>
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 prose prose-sm max-w-none" v-html="answer.text"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const id = computed(() => route.params.id);

const loading = ref(true);
const error = ref(null);
const report = ref(null);
const user = ref(null);
const answer = ref(null);
const answerLoading = ref(true);

function getStatusColor(status) {
  const map = { 'da elaborare': 'bg-amber-100 text-amber-800', 'in lavorazione': 'bg-yellow-100 text-yellow-800', 'risolta': 'bg-green-100 text-green-800' };
  return map[status] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const baseUrl = import.meta.env.VITE_API_HOST || '';
function getAttachmentUrl(att) {
  if (!att) return '#';
  if (typeof att === 'string' && att.startsWith('http')) return att;
  return `${baseUrl}/uploads/attachments/${att}`;
}
function getAttachmentFileName(att) {
  if (!att || typeof att !== 'string') return 'allegato';
  const parts = att.split(/[/\\]/);
  return parts[parts.length - 1] || att;
}

async function loadReport() {
  try {
    const res = await api.getReport(id.value);
    report.value = res.data;
    if (!report.value) throw new Error('Segnalazione non trovata');
    if (!report.value.created_at) report.value.created_at = report.value.created;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Impossibile caricare la segnalazione';
  } finally {
    loading.value = false;
  }
}

async function loadUser() {
  try {
    const res = await api.getMe();
    user.value = res.data;
  } catch {
    user.value = {};
  }
}

async function loadAnswer() {
  if (!report.value || report.value.status !== 'risolta') {
    answerLoading.value = false;
    return;
  }
  answerLoading.value = true;
  try {
    const res = await api.getAnswerByReportId(id.value);
    const data = res.data;
    if (Array.isArray(data) && data.length > 0) {
      answer.value = data[0].reportAnswer || data[0];
    } else if (data && (data.reportAnswer || data.title || data.text)) {
      answer.value = data.reportAnswer || data;
    } else {
      answer.value = null;
    }
  } catch {
    answer.value = null;
  } finally {
    answerLoading.value = false;
  }
}

onMounted(async () => {
  await loadReport();
  if (!error.value) {
    loadUser();
    await loadAnswer();
  }
});
</script>
