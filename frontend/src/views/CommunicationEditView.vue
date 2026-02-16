<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
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

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-100">
          <h1 class="text-2xl font-bold text-gray-800">{{ isNew ? 'Nuova comunicazione' : 'Modifica comunicazione' }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ isNew ? 'Compila i campi per creare una comunicazione.' : 'Aggiorna i campi e salva.' }}</p>
        </div>

        <form @submit.prevent="save" class="p-8 space-y-6">
          <!-- Riga: Titolo + Categoria -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 text-sm font-semibold mb-2">Titolo comunicazione *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Titolo della comunicazione"
              />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-semibold mb-2">Categoria *</label>
              <input
                v-model="form.categoria"
                type="text"
                required
                autocomplete="off"
                class="category-input w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="es. Avviso, Allerta"
              />
            </div>
          </div>

          <!-- Testo breve (anteprima) -->
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2">Testo breve (anteprima) *</label>
            <textarea
              v-model="form.short_text"
              required
              rows="2"
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Breve descrizione per le anteprime e le card"
            />
          </div>

          <!-- Spiegazione e contesto (rich text) -->
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2">Spiegazione e contesto *</label>
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
                class="min-h-[200px] max-h-[400px] overflow-y-auto px-4 py-3 text-gray-800 leading-relaxed prose prose-sm max-w-none"
                data-placeholder="Scrivi qui il contenuto della comunicazione..."
                @input="onEditorInput"
                @keyup="updateFormatState"
                @mouseup="updateFormatState"
              />
            </div>
          </div>

          <!-- Importanza -->
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2">Importanza *</label>
            <select
              v-model="form.importance"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="basso rischio">Basso rischio</option>
              <option value="medio rischio">Medio rischio</option>
              <option value="alto rischio">Alto rischio</option>
            </select>
          </div>

          <!-- Bozza -->
          <div class="flex items-center gap-2">
            <input
              id="edit-comm-draft"
              v-model="form.isDraft"
              type="checkbox"
              class="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label for="edit-comm-draft" class="text-sm font-medium text-gray-700">Salva come bozza</label>
          </div>
          <div v-if="!form.isDraft" class="flex items-center gap-2">
            <input
              id="edit-comm-notify"
              v-model="form.notify"
              type="checkbox"
              class="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label for="edit-comm-notify" class="text-sm font-medium text-gray-700">Invia notifica agli utenti</label>
          </div>

          <div class="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-100">
            <router-link
              :to="{ name: 'user-dashboard' }"
              class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Annulla
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-blue-700 disabled:opacity-60 transition-all"
            >
              {{ saving ? 'Salvataggio...' : (isNew ? 'Crea comunicazione' : 'Salva modifiche') }}
            </button>
          </div>
        </form>
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
const isNew = computed(() => !id.value || id.value === 'new');

const loading = ref(true);
const error = ref(null);
const saving = ref(false);
const editorEl = ref(null);
const formatState = reactive({ bold: false, italic: false, underline: false });
const form = reactive({
  title: '',
  short_text: '',
  text: '',
  categoria: '',
  importance: 'medio rischio',
  isDraft: true,
  notify: false,
});

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
  if (editorEl.value) form.text = editorEl.value.innerHTML;
  updateFormatState();
}

function setEditorContent(html) {
  if (editorEl.value) {
    editorEl.value.innerHTML = html || '';
  }
}

async function loadCommunication() {
  if (isNew.value) {
    form.title = '';
    form.short_text = '';
    form.text = '';
    form.categoria = '';
    form.importance = 'medio rischio';
    form.isDraft = true;
    form.notify = false;
    await nextTick();
    setEditorContent('');
    loading.value = false;
    return;
  }
  try {
    const res = await api.getCommunicationById(id.value);
    const c = res.data;
    form.title = c.title || '';
    form.short_text = c.short_text || '';
    form.categoria = c.categoria || '';
    form.importance = c.importance || 'medio rischio';
    form.isDraft = !!c.isDraft;
    form.notify = false;
    const html = c.text != null ? String(c.text) : '';
    form.text = html;
    loading.value = false;
    await nextTick();
    setEditorContent(html);
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Impossibile caricare la comunicazione';
  } finally {
    loading.value = false;
  }
}

async function save() {
  const text = editorEl.value ? editorEl.value.innerHTML : form.text;
  if (!text.trim()) {
    alert('Inserisci il contenuto in Spiegazione e contesto.');
    return;
  }
  saving.value = true;
  try {
    const payload = {
      title: form.title.trim(),
      short_text: form.short_text.trim(),
      text: text.trim(),
      categoria: form.categoria.trim(),
      importance: form.importance,
      isDraft: form.isDraft,
      notify: form.notify,
    };
    if (isNew.value) {
      await api.createCommunication(payload);
    } else {
      await api.updateCommunication(id.value, payload);
    }
    router.push({ name: 'user-dashboard' });
  } catch (err) {
    alert('Errore: ' + (err.response?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadCommunication();
});
</script>

<style scoped>
.category-input::-webkit-calendar-picker-indicator {
  display: none;
  opacity: 0;
  pointer-events: none;
}
.category-input::-webkit-list-button {
  display: none;
}
[contenteditable]:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
}
</style>
