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
            <div class="w-full aspect-video shrink-0 overflow-hidden flex items-center justify-center"
              :style="article.img ? {} : { backgroundColor: '#dbeafe' }">
              <img v-if="article.img"
                :src="getImageUrl(article.img)"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              <svg v-else class="w-16 h-16 text-blue-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                :viewBox="getArticlePlaceholderIcon(article).viewBox">
                <path :d="getArticlePlaceholderIcon(article).path"/>
              </svg>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <span
                  class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                  :class="getCategoryBadge(article.categoria)"
                >
                  <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M214.7 .7c17.3 3.7 28.3 20.7 24.6 38l-19.1 89.3 126.5 0 22-102.7C372.4 8 389.4-3 406.7 .7s28.3 20.7 24.6 38L412.2 128 480 128c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-27.4 128 67.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38l19.1-89.3-126.5 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38L99.8 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 27.4-128-67.8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 22-102.7C180.4 8 197.4-3 214.7 .7zM206.4 192l-27.4 128 126.5 0 27.4-128-126.5 0z"/></svg>
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

const ARTICLE_PLACEHOLDER_ICONS = [
  { viewBox: '0 0 512 512', path: 'M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0 512 114.6 512 256l0 32c0 53-43 96-96 96-29.3 0-55.6-13.2-73.2-33.9-22.8 21-53.3 33.9-86.8 33.9-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1 5.7-5 13.1-8.1 21.3-8.1 17.7 0 32 14.3 32 32l0 112c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z' },
  { viewBox: '0 0 448 512', path: 'M64 160l64 0 0-64-64 0 0 64zM0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48L0 80zM64 416l64 0 0-64-64 0 0 64zM0 336c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96zM320 96l0 64 64 0 0-64-64 0zM304 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zM288 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm96 32c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm32-96a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-32 32a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z' },
  { viewBox: '0 0 512 512', path: 'M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z' },
  { viewBox: '0 0 512 512', path: 'M48 256c0-114.9 93.1-208 208-208 63.1 0 119.6 28.1 157.8 72.5 8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0 114.6 0 0 114.6 0 256l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6-15.2 5-18.7 23.7-8.3 35.9 7.1 8.3 18.8 10.8 29.4 7.9 10.6-2.9 21.8-4.4 33.4-4.4 70.7 0 128 57.3 128 128l0 24.9c0 25.2-1.5 50.3-4.4 75.3-1.7 14.6 9.4 27.8 24.2 27.8 11.8 0 21.9-8.6 23.3-20.3 3.3-27.4 5-55 5-82.7l0-24.9c0-97.2-78.8-176-176-176zM150.7 148.7c-9.1-10.6-25.3-11.4-33.9-.4-23.1 29.8-36.8 67.1-36.8 107.7l0 24.9c0 24.2-2.6 48.4-7.8 71.9-3.4 15.6 7.9 31.1 23.9 31.1 10.5 0 19.9-7 22.2-17.3 6.4-28.1 9.7-56.8 9.7-85.8l0-24.9c0-27.2 8.5-52.4 22.9-73.1 7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96l0 24.9c0 35.9-4.6 71.5-13.8 106.1-3.8 14.3 6.7 29 21.5 29 9.5 0 17.9-6.2 20.4-15.4 10.5-39 15.9-79.2 15.9-119.7l0-24.9c0-28.7 23.3-52 52-52s52 23.3 52 52l0 24.9c0 36.3-3.5 72.4-10.4 107.9-2.7 13.9 7.7 27.2 21.8 27.2 10.2 0 19-7 21-17 7.7-38.8 11.6-78.3 11.6-118.1l0-24.9c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3C267.9 411.9 280 346.7 280 280.9l0-24.9z' },
  { viewBox: '0 0 384 512', path: 'M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z' },
  { viewBox: '0 0 576 512', path: 'M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z' },
  { viewBox: '0 0 512 512', path: 'M256.2 48c114.8 .1 207.8 93.2 207.8 208 0 22.1-3.4 43.4-9.8 63.4-2 .4-4.1 .6-6.2 .6l-2.7 0c-8.5 0-16.6-3.4-22.6-9.4l-29.3-29.3c-6-6-9.4-14.1-9.4-22.6l0-50.7c0-8.8 7.2-16 16-16s16-7.2 16-16-7.2-16-16-16l-24 0c-13.3 0-24 10.7-24 24s-10.7 24-24 24l-56 0c-8.8 0-16 7.2-16 16s-7.2 16-16 16l-25.4 0c-12.5 0-22.6-10.1-22.6-22.6 0-6 2.4-11.8 6.6-16l70.1-70.1c2.1-2.1 3.3-5 3.3-8 0-6.2-5.1-11.3-11.3-11.3l-14.1 0c-12.5 0-22.6-10.1-22.6-22.6 0-6 2.4-11.8 6.6-16l23.1-23.1c.8-.8 1.6-1.5 2.5-2.2zM438.4 356.1c-32.8 59.6-93.9 101.4-165.2 107.2-.7-2.3-1.1-4.8-1.1-7.3 0-13.3-10.7-24-24-24l-26.7 0c-8.5 0-16.6-3.4-22.6-9.4l-29.3-29.3c-6-6-9.4-14.1-9.4-22.6l0-66.7c0-17.7 14.3-32 32-32l98.7 0c8.5 0 16.6 3.4 22.6 9.4l29.3 29.3c6 6 14.1 9.4 22.6 9.4l5.5 0c8.5 0 16.6 3.4 22.6 9.4l16 16c4.2 4.2 10 6.6 16 6.6 4.8 0 9.3 1.5 13 4.1zM256 512l26.2-1.3c-8.6 .9-17.3 1.3-26.2 1.3zm26.2-1.3C411.3 497.6 512 388.6 512 256 512 114.6 397.4 0 256 0l0 0C114.6 0 0 114.6 0 256 0 383.5 93.2 489.3 215.3 508.8 228.5 510.9 242.1 512 256 512zM187.3 123.3l-32 32c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l32-32c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z' },
  { viewBox: '0 0 512 512', path: 'M253.4 2.9C249.2 1 244.7 0 240 0s-9.2 1-13.4 2.9L38.3 82.8c-22 9.3-38.4 31-38.3 57.2 .5 99.2 41.3 280.7 213.6 363.2 16.7 8 36.1 8 52.8 0 172.4-82.5 213.2-264 213.6-363.2 .1-26.2-16.3-47.9-38.3-57.2L253.4 2.9zM240 128c13.3 0 24 10.7 24 24 0 22.9 27.7 34.4 43.9 18.2 9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9c-16.2 16.2-4.7 43.9 18.2 43.9 13.3 0 24 10.7 24 24s-10.7 24-24 24c-22.9 0-34.4 27.7-18.2 43.9 9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0c-16.2-16.2-43.9-4.7-43.9 18.2 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-22.9-27.7-34.4-43.9-18.2-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9c16.2-16.2 4.7-43.9-18.2-43.9-13.3 0-24-10.7-24-24s10.7-24 24-24c22.9 0 34.4-27.7 18.2-43.9-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0c16.2 16.2 43.9 4.7 43.9-18.2 0-13.3 10.7-24 24-24zM208 264a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm88 40a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z' }
];

const getArticlePlaceholderIcon = (article) => {
  const id = String(article?.id || article?._id || article?.title || '');
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return ARTICLE_PLACEHOLDER_ICONS[n % ARTICLE_PLACEHOLDER_ICONS.length];
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
