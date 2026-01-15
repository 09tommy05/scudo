<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  article,
  articleLoading,
  articleError,
  fetchArticle
} from '@/stores/articles'

const route = useRoute()

onMounted(() => {
  fetchArticle(route.params.id)
})
</script>

<template>
  <section>
    <p v-if="articleLoading">Caricamento articolo...</p>
    <p v-else-if="articleError || !article">Articolo non trovato</p>
    <article v-else>
      <h1>{{ article.title }}</h1>
      <p class="meta">
        {{ article.author?.name }} {{ article.author?.surname }}
        • {{ new Date(article.last_edit).toLocaleDateString('it-IT') }}
      </p>
      <div v-html="article.text"></div>
    </article>
  </section>
</template>