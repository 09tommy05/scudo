<template>
  <router-link
    :to="`/article/${article.id}`"
    class="article-link"
  >
    <article class="article-card">
      <h2>
        {{ article.title }}
        <span class="author">
          • {{ article.author?.name }} {{ article.author?.surname }}
        </span>
      </h2>

      <p>{{ article.excerpt }}</p>

      <small>
        {{ new Date(article.last_edit).toLocaleDateString('it-IT') }}
      </small>
    </article>
  </router-link>
</template>

<script setup>
defineProps({
  article: Object
})
</script>

<style scoped>
.article-link {
  text-decoration: none;
  color: inherit;
}

.article-card {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.article-card:hover {
  transform: translateY(-2px);
}
</style>