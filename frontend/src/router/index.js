import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ArticleDetailView from '@/views/ArticleDetailView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SetPasswordView from '@/views/SetPasswordView.vue'
import CommunicationsView from '@/views/CommunicationsView.vue'
import CommunicationModal from '@/components/CommunicationModal.vue'
import GuidePhishingView from '@/views/GuidePhishingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/guide/email-sospetta',
      name: 'guide-phishing',
      component: GuidePhishingView
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: ArticleDetailView,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'user-dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/set-first-password',
      name: 'set-first-password',
      component: SetPasswordView
    },
    {
      path: '/communications',
      name: 'communications',
      component: CommunicationsView,
      children: [
        {
          path: ':id',
          name: 'communication-detail',
          component: CommunicationModal,
          props: true
        }
      ]
    },
    //QUESTO DEVE RIMANERE PER ULTIMO è IL FALLBACK PER 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresOperator && user.role !== 'operator') {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router