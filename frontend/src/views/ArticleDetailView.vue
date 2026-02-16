<template>
  <div class="container mx-auto px-4 py-8 md:py-12">
    
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-600">
      <p class="text-xl font-semibold">{{ error }}</p>
      <div class="mt-6">
        <router-link to="/" class="text-primary hover:underline flex items-center justify-center gap-2">
          <span>&larr;</span> Torna alla guida
        </router-link>
      </div>
    </div>

    <div v-else-if="article" class="max-w-4xl mx-auto animate-fade-in">
      
      <div class="mb-8">
        <router-link 
          to="/" 
          class="inline-flex items-center text-gray-500 hover:text-primary transition-colors font-medium group"
        >
          <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
          Torna alla guida
        </router-link>
      </div>

      <div class="mb-8">
        <div class="flex flex-wrap items-center gap-3 text-sm mb-4">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold uppercase tracking-wide text-xs">
            {{ article.categoria }}
          </span>
          <span class="text-gray-500">
            {{ formatDate(article.last_edit) }}
          </span>
          <span v-if="article.author" class="text-gray-500">
            • di <span class="text-gray-900 font-medium">{{ article.author.name }} {{ article.author.surname }}</span>
          </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {{ article.title }}
        </h1>
      </div>

      <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify">
        <img
          v-if="article.img"
          :src="getImageUrl(article.img)"
          alt="Immagine articolo"
          class="w-full h-auto rounded-xl shadow-lg object-cover mb-6 md:float-right md:w-5/12 md:ml-8 md:mb-6"
        />
        <div v-if="isHtml(article.text)" class="article-body" v-html="article.text"></div>
        <div v-else class="whitespace-pre-line">{{ article.text }}</div>
      </div>
      
      <div class="mt-12 pt-8 border-t border-gray-200 clear-both">
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const article = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchArticle = async () => {
  loading.value = true;
  try {
    const response = await api.getArticle(route.params.id);
    article.value = response.data;
  } catch (err) {
    console.error('Error fetching article:', err);
    error.value = 'Articolo non trovato o errore nel caricamento.';
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (img) => {
  if (!img) return 'https://via.placeholder.com/800x400?text=No+Image';
  if (img.startsWith('http')) return img;
  return `${import.meta.env.VITE_API_HOST}/uploads/images/${img}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
};

const isHtml = (text) => {
  if (!text || typeof text !== 'string') return false;
  return /<[a-zA-Z][^>]*>/.test(text);
};

onMounted(() => {
  fetchArticle();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>