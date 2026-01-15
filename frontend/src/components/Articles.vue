<template>
  <section>
    <!-- Loading -->
    <p v-if="loading">Caricamento articoli...</p>

    <!-- Nessun articolo -->
    <p v-else-if="error || Object.keys(articlesByCategory).length === 0">
      Nessun articolo presente
    </p>

    <!-- Categorie -->
    <div v-else>
      <section
        v-for="(categoryArticles, category) in articlesByCategory"
        :key="category"
        class="category"
      >
        <h1 class="category-title">{{ category }}</h1>

        <Article
          v-for="article in categoryArticles"
          :key="article.id"
          :article="article"
        />
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import {
  articlesByCategory,
  loading,
  error,
  fetchArticles
} from '@/stores/articles'

import Article from './Article.vue'

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.category {
  margin-bottom: 2rem;
}

.category-title {
  margin-bottom: 1rem;
  border-bottom: 2px solid #ddd;
}
</style>
