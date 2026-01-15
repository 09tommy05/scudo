import { createRouter, createWebHistory } from 'vue-router'
import Articles from '@/components/Articles.vue'
import ArticleDetail from '@/components/ArticleDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'articles',
      component: Articles
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: ArticleDetail,
      props: true
    }
  ]
})

export default router