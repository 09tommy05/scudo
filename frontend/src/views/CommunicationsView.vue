<template>
  <div class="container mx-auto px-4 py-8 relative">

    <h1 class="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
      Comunicazioni
    </h1>

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-gray-50">
      <div class="w-full md:w-1/2 relative">
        <input v-model="searchQuery" type="text" placeholder="Cerca nelle comunicazioni..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
        <span class="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>

      <div class="w-full md:w-auto flex items-center gap-2">
        <label class="text-gray-600 font-medium whitespace-nowrap flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Ordina:
        </label>
        <div class="relative">
          <select v-model="sortBy"
            class="appearance-none p-2 pl-3 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer">
            <option value="date_desc">Data (più recenti)</option>
            <option value="date_asc">Data (meno recenti)</option>
            <option value="importance_desc">Importanza (alto rischio)</option>
            <option value="importance_asc">Importanza (basso rischio)</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-500">Caricamento comunicazioni...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-600 flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="comm in processedCommunications" :key="comm._id || comm.id"
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-gray-100 group">

        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
          <div class="flex-1 order-2 md:order-1">
            <span
              class="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full text-white whitespace-nowrap w-fit shadow-sm mb-2"
              :class="getImportanceBg(comm.importance)">
              {{ getRischioLabel(comm.importance) }}
            </span>
            <h2 @click="openDetail(comm._id || comm.id)"
              class="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors cursor-pointer hover:underline">
              {{ comm.title }}
            </h2>
          </div>
          <span class="flex items-center gap-1 text-sm text-gray-500 order-1 md:order-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(comm.publication) }}
          </span>
        </div>

        <p class="text-gray-600 mb-4 line-clamp-2">
          {{ comm.short_text }}
        </p>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <span class="flex items-center gap-1 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ comm.categoria }}
          </span>
          <button type="button" @click.prevent="openDetail(comm._id || comm.id)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Leggi dettagli
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="processedCommunications.length === 0" class="text-center py-12 text-gray-400">
        Nessuna comunicazione trovata.
      </div>
    </div>

    <router-view />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

const communications = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const sortBy = ref('date_desc');

const importanceWeight = {
  'alto rischio': 3,
  'medio rischio': 2,
  'basso rischio': 1
};

const fetchCommunications = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getCommunications();
    communications.value = response.data;
  } catch (err) {
    console.error('Error fetching communications:', err);
    error.value = 'Impossibile caricare le comunicazioni. Riprova più tardi.';
  } finally {
    loading.value = false;
  }
};

const processedCommunications = computed(() => {
  let result = [...communications.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.short_text?.toLowerCase().includes(query) ||
      c.categoria?.toLowerCase().includes(query)
    );
  }

  result.sort((a, b) => {
    if (sortBy.value === 'date_desc') return new Date(b.publication) - new Date(a.publication);
    if (sortBy.value === 'date_asc') return new Date(a.publication) - new Date(b.publication);

    if (sortBy.value === 'importance_desc') {
      return (importanceWeight[b.importance] || 0) - (importanceWeight[a.importance] || 0);
    }
    if (sortBy.value === 'importance_asc') {
      return (importanceWeight[a.importance] || 0) - (importanceWeight[b.importance] || 0);
    }
    return 0;
  });

  return result;
});

const openDetail = (id) => {
  router.push({
    name: 'communication-detail',
    params: { id: id }
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getRischioLabel = (importance) => {
  if (!importance) return 'Rischio: Info';
  const i = importance.toLowerCase();
  if (i === 'alto rischio') return 'Rischio: Alto';
  if (i === 'medio rischio') return 'Rischio: Medio';
  if (i === 'basso rischio') return 'Rischio: Basso';
  return 'Rischio: ' + importance.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getImportanceBg = (importance) => {
  switch (importance?.toLowerCase()) {
    case 'alto rischio': return 'bg-red-500';
    case 'medio rischio': return 'bg-yellow-500';
    default: return 'bg-blue-500';
  }
};

onMounted(() => {
  fetchCommunications();
});
</script>

<style scoped></style>