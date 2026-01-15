import { ref, computed } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:3010'
const API_URL = HOST + '/api/v1'
const ARTICLES_URL = API_URL + '/articles'

// Lista articoli
const articles = ref([])
const loading = ref(false)
const error = ref(false)

// Articolo singolo
const article = ref(null)
const articleLoading = ref(false)
const articleError = ref(false)

// Fetch lista articoli
async function fetchArticles() {
  loading.value = true
  error.value = false

  try {
    const res = await fetch(ARTICLES_URL)
    if (!res.ok) throw new Error('Fetch failed')
    const data = await res.json()
    articles.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    error.value = true
    articles.value = []
  } finally {
    loading.value = false
  }
}

// Fetch articolo singolo
async function fetchArticle(id) {
  articleLoading.value = true
  articleError.value = false

  try {
    const res = await fetch(`${ARTICLES_URL}/${id}`)
    if (!res.ok) throw new Error('Fetch failed')

    article.value = await res.json()
  } catch (e) {
    console.error(e)
    articleError.value = true
    article.value = null
  } finally {
    articleLoading.value = false
  }
}

// Raggruppa articoli per categoria
const articlesByCategory = computed(() => {
  return articles.value.reduce((acc, art) => {
    const category = art.categoria || 'Altro'
    if (!acc[category]) acc[category] = []
    acc[category].push(art)
    return acc
  }, {})
})

export {
  articles,
  articlesByCategory,
  loading,
  error,
  fetchArticles,
  article,
  articleLoading,
  articleError,
  fetchArticle
}
