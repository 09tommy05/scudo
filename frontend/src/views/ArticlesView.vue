<template>
  <div>
    <!-- Header -->
    <section class="bg-primary overflow-hidden">
      <div class="container mx-auto px-4 lg:px-8 py-10 md:py-14 text-center">
        <h1 class="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2">
          Tutti gli articoli
        </h1>
        <p class="text-blue-100 text-sm md:text-base max-w-xl mx-auto">
          Guide e approfondimenti per la tua sicurezza.
        </p>
      </div>
    </section>

    <!-- Search + Filter -->
    <section class="container mx-auto px-4 lg:px-8 -mt-6 relative z-10">
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mx-auto">
        <div class="relative flex-1">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cerca articoli..."
            class="w-full pl-11 pr-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400"
          />
        </div>
        <div class="sm:w-56 shrink-0 relative">
          <select
            v-model="selectedCategory"
            class="w-full appearance-none px-4 py-3 pr-10 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Tutte le categorie</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <svg class="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Articles grid -->
    <section class="container mx-auto px-4 lg:px-8 py-10 md:py-14">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-600 bg-red-50 rounded-2xl max-w-2xl mx-auto">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-else-if="filteredArticles.length === 0" class="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl max-w-2xl mx-auto">
        <p class="font-medium">Nessun articolo trovato.</p>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        <article
          v-for="article in filteredArticles"
          :key="article.id || article._id"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 group flex flex-col"
        >
          <router-link
            :to="{ name: 'article-detail', params: { id: article.id || article._id } }"
            class="flex flex-col flex-1 no-underline"
          >
            <div v-if="article.img" class="w-full aspect-video bg-gray-100 shrink-0 overflow-hidden">
              <img
                :src="getImageUrl(article.img)"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <span
                  class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                  :class="getCategoryBadge(article.categoria)"
                >
                  {{ article.categoria }}
                </span>
                <span class="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ formatDate(article.last_edit) }}
                </span>
              </div>
              <h2 class="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {{ article.title }}
              </h2>
              <p class="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1">
                {{ article.short_text }}
              </p>
              <span class="inline-flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:underline">
                Leggi tutto
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </router-link>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';

const articles = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');

const fetchArticles = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.getArticles({});
    articles.value = Array.isArray(res.data) ? res.data : [];
  } catch {
    error.value = 'Impossibile caricare gli articoli. Riprova più tardi.';
    articles.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await api.getCategories();
    categories.value = res.data?.categories || [];
  } catch {
    categories.value = [];
  }
};

const filteredArticles = computed(() => {
  let list = articles.value;
  const q = (searchQuery.value || '').trim().toLowerCase();
  const cat = selectedCategory.value || '';
  if (cat) list = list.filter((a) => (a.categoria || '') === cat);
  if (q) {
    list = list.filter(
      (a) =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.short_text || '').toLowerCase().includes(q) ||
        (a.categoria || '').toLowerCase().includes(q)
    );
  }
  return list;
});

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  const base = import.meta.env.VITE_API_HOST || '';
  return `${base}/uploads/images/${img}`;
};

const getCategoryBadge = (cat) => {
  if (!cat) return 'bg-gray-100 text-gray-600';
  const c = cat.toLowerCase();
  if (c.includes('phishing')) return 'bg-blue-100 text-blue-700';
  if (c.includes('smishing')) return 'bg-purple-100 text-purple-700';
  if (c.includes('quishing') || c.includes('qr')) return 'bg-amber-100 text-amber-700';
  if (c.includes('sicurezza') || c.includes('password')) return 'bg-gray-200 text-gray-700';
  if (c.includes('social')) return 'bg-pink-100 text-pink-700';
  if (c.includes('link')) return 'bg-red-100 text-red-600';
  return 'bg-blue-100 text-blue-700';
};

onMounted(() => {
  fetchArticles();
  fetchCategories();
});
</script>
