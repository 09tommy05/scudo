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
          Torna alla dashboard
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p class="text-red-600 font-medium">{{ error }}</p>
        <router-link :to="{ name: 'user-dashboard' }" class="mt-4 inline-block text-primary hover:underline">Torna alla dashboard</router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card: Dettaglio segnalazione -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM120 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/></svg>
              Dettaglio segnalazione
            </h2>
            <span v-if="report" :class="['inline-flex px-2.5 py-1 text-xs font-semibold rounded-full uppercase shrink-0', getStatusColor(report.status)]">
              {{ report.status }}
            </span>
          </div>
          <div v-if="report" class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Cittadino</p>
                <p class="text-gray-900 font-bold">{{ report.author?.name }} {{ report.author?.surname }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Data</p>
                <p class="text-gray-900 font-bold">{{ formatDate(report.created_at || report.created) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Categoria</p>
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M214.7 .7c17.3 3.7 28.3 20.7 24.6 38l-19.1 89.3 126.5 0 22-102.7C372.4 8 389.4-3 406.7 .7s28.3 20.7 24.6 38L412.2 128 480 128c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-27.4 128 67.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38l19.1-89.3-126.5 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38L99.8 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 27.4-128-67.8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 22-102.7C180.4 8 197.4-3 214.7 .7zM206.4 192l-27.4 128 126.5 0 27.4-128-126.5 0z"/></svg>
                  {{ report.categoria }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descrizione della minaccia</p>
              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <p class="text-sm text-gray-700 whitespace-pre-line italic">{{ report.text }}</p>
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
                  target="_blank"
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

        <!-- Card: Form di risposta -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-800">Risposta al cittadino</h2>
          </div>
          <form v-if="report" @submit.prevent="submitReply" class="p-6 space-y-5">
            <div>
              <label class="block text-gray-700 text-sm font-semibold mb-2">Titolo risposta *</label>
              <input
                v-model="replyForm.title"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Titolo della risposta"
              />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-semibold mb-2">Messaggio *</label>
              <div class="rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <div class="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
                  <button type="button" title="Grassetto" @mousedown.prevent="execCmd('bold')"
                    :class="['p-2 rounded min-w-[36px] flex items-center justify-center', formatState.bold ? 'bg-primary/20 text-primary' : 'hover:bg-gray-200 text-gray-700']">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l32 0 0 320-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c70.7 0 128-57.3 128-128 0-46.5-24.8-87.3-62-109.7 18.7-22.3 30-51 30-82.3 0-70.7-57.3-128-128-128L32 32zM288 160c0 35.3-28.7 64-64 64l-96 0 0-128 96 0c35.3 0 64 28.7 64 64zM128 416l0-128 128 0c35.3 0 64 28.7 64 64s-28.7 64-64 64l-128 0z"/></svg>
                  </button>
                  <button type="button" title="Corsivo" @mousedown.prevent="execCmd('italic')"
                    :class="['p-2 rounded min-w-[36px] flex items-center justify-center', formatState.italic ? 'bg-primary/20 text-primary' : 'hover:bg-gray-200 text-gray-700']">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0-133.3 320 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0 133.3-320-64 0c-17.7 0-32-14.3-32-32z"/></svg>
                  </button>
                  <button type="button" title="Sottolineato" @mousedown.prevent="execCmd('underline')"
                    :class="['p-2 rounded min-w-[36px] flex items-center justify-center', formatState.underline ? 'bg-primary/20 text-primary' : 'hover:bg-gray-200 text-gray-700']">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M0 32C0 14.3 14.3 0 32 0L96 0c17.7 0 32 14.3 32 32S113.7 64 96 64l0 160c0 53 43 96 96 96s96-43 96-96l0-160c-17.7 0-32-14.3-32-32S270.3 0 288 0l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 160c0 88.4-71.6 160-160 160S32 312.4 32 224L32 64C14.3 64 0 49.7 0 32zM0 480c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32z"/></svg>
                  </button>
                </div>
                <div
                  ref="editorEl"
                  contenteditable="true"
                  class="min-h-[180px] max-h-[320px] overflow-y-auto px-4 py-3 text-gray-800 leading-relaxed prose prose-sm max-w-none"
                  :data-placeholder="replyPlaceholder"
                  @input="onEditorInput"
                  @keyup="updateFormatState"
                  @mouseup="updateFormatState"
                />
              </div>
            </div>
            <div class="flex flex-wrap justify-end gap-3 pt-2">
              <router-link
                :to="{ name: 'user-dashboard' }"
                class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Annulla
              </router-link>
              <button
                type="submit"
                :disabled="saving || report.status === 'risolta'"
                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
              >
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                {{ report.status === 'risolta' ? 'Già risolta' : (saving ? 'Invio...' : 'Contrassegna come risolta') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const loading = ref(true);
const error = ref(null);
const saving = ref(false);
const report = ref(null);
const editorEl = ref(null);
const formatState = reactive({ bold: false, italic: false, underline: false });
const replyForm = reactive({ title: '', text: '' });

const replyPlaceholder = computed(() => {
  const name = report.value?.author ? [report.value.author.name, report.value.author.surname].filter(Boolean).join(' ') : 'cittadino';
  return `Scrivi qui il messaggio per ${name}...`;
});

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
  if (att.startsWith('http')) return att;
  return `${baseUrl}/uploads/attachments/${att}`;
}
function getAttachmentFileName(att) {
  if (!att || typeof att !== 'string') return 'allegato';
  const parts = att.split(/[/\\]/);
  return parts[parts.length - 1] || att;
}

function execCmd(cmd, ...args) {
  editorEl.value?.focus();
  document.execCommand(cmd, false, args[0]);
  updateFormatState();
}

function updateFormatState() {
  if (!editorEl.value) return;
  const sel = document.getSelection();
  if (!sel || !sel.anchorNode || !editorEl.value.contains(sel.anchorNode)) {
    formatState.bold = false;
    formatState.italic = false;
    formatState.underline = false;
    return;
  }
  formatState.bold = document.queryCommandState('bold');
  formatState.italic = document.queryCommandState('italic');
  formatState.underline = document.queryCommandState('underline');
}

function onEditorInput() {
  if (editorEl.value) replyForm.text = editorEl.value.innerHTML;
  updateFormatState();
}

async function loadReport() {
  try {
    const res = await api.getReport(id.value);
    report.value = res.data;
    if (!report.value) throw new Error('Segnalazione non trovata');
    if (!report.value.created_at) report.value.created_at = report.value.created;
    const nomeUtente = [report.value.author?.name, report.value.author?.surname].filter(Boolean).join(' ') || 'utente';
    const titolo = report.value?.title || "Titolo";
    replyForm.title = `Risposta alla segnalazione ${titolo} di ${nomeUtente}`;
    replyForm.text = 'Gentile utente,<br><br>In riferimento alla tua segnalazione, ti comunichiamo quanto segue.<br><br>Cordiali saluti.';
    await nextTick();
    if (editorEl.value) editorEl.value.innerHTML = replyForm.text;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Impossibile caricare la segnalazione';
  } finally {
    loading.value = false;
  }
}

async function submitReply() {
  if (!report.value || report.value.status === 'risolta') return;
  const text = editorEl.value ? editorEl.value.innerHTML : replyForm.text;
  if (!text.trim()) {
    alert('Inserisci il messaggio di risposta.');
    return;
  }
  saving.value = true;
  try {
    await api.createReportAnswer({
      reportID: report.value.id || report.value._id,
      title: replyForm.title.trim(),
      text: text.trim(),
    });
    router.push({ name: 'user-dashboard' });
  } catch (err) {
    alert('Errore: ' + (err.response?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadReport();
});
</script>

<style scoped>
[contenteditable]:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
}
</style>
