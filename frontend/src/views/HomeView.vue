<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-primary">Guida</h1>

    <!-- Search and Filter -->
    <div class="mb-8 flex flex-col md:flex-row gap-4">
      <input v-model="searchQuery" @input="fetchArticles" type="text" placeholder="Cerca articoli..."
        class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
      <select v-model="selectedCategory" @change="fetchArticles"
        class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
        <option value="">Tutte le categorie</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-500">Caricamento articoli...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
    </div>

    <!-- Articles Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="article in articles" :key="article.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
        <img :src="getImageUrl(article.img)" alt="Article Image" class="w-full h-48 object-cover">
        <div class="p-6 flex flex-col flex-1">
          <div class="flex items-center justify-between mb-2">
            <span class="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {{ article.categoria
              }}</span>
            <span class="flex items-center gap-1 text-xs text-gray-500"><svg xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>{{ formatDate(article.last_edit) }}</span>
          </div>
          <h2 class="text-xl font-bold mb-2 hover:text-primary transition">
            <router-link :to="{ name: 'article-detail', params: { id: article.id } }">
              {{ article.title }}
            </router-link>
          </h2>
          <p class="text-gray-600 mb-4 flex-1 line-clamp-3">{{ article.short_text }}</p>
          <router-link :to="{ name: 'article-detail', params: { id: article.id } }"
            class="text-primary font-bold hover:underline self-start mt-auto">
            Leggi tutto &rarr;
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="!loading && articles.length === 0" class="text-center py-12 text-gray-500">
      Nessun articolo trovato.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref([]);

const fetchArticles = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {};
    if (searchQuery.value) params.q = searchQuery.value;
    if (selectedCategory.value) params.category = selectedCategory.value;

    const response = await api.getArticles(params);
    articles.value = response.data;
  } catch (err) {
    console.error('Error fetching articles:', err);
    error.value = 'Impossibile caricare gli articoli. Riprova più tardi.';
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (img) => {
  if (!img) return 'https://via.placeholder.com/400x200?text=No+Image';
  if (img.startsWith('http')) return img;
  return `${import.meta.env.VITE_API_HOST}/uploads/images/${img}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('it-IT');
};

onMounted(() => {
  fetchArticles();
  api.getCategories().then(response => {
    categories.value = response.data.categories;
  }).catch(err => {
    console.error('Error fetching categories:', err);
  });
});
</script>
