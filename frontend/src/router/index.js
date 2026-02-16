import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ArticleDetailView from '@/views/ArticleDetailView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SetPasswordView from '@/views/SetPasswordView.vue'
import CommunicationsView from '@/views/CommunicationsView.vue'
import CommunicationModal from '@/components/CommunicationModal.vue'
import GuidePhishingView from '@/views/GuidePhishingView.vue'
import GuideSmishingView from '@/views/GuideSmishingView.vue'
import GuideLinkView from '@/views/GuideLinkView.vue'
import GuideQrView from '@/views/GuideQrView.vue'
import GuideSocialView from '@/views/GuideSocialView.vue'
import GuideChiamateView from '@/views/GuideChiamateView.vue'

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
      path: '/guide/sms-sospetto',
      name: 'guide-smishing',
      component: GuideSmishingView
    },
    {
      path: '/guide/link-sospetto',
      name: 'guide-link',
      component: GuideLinkView
    },
    {
      path: '/guide/qr-sospetto',
      name: 'guide-qr',
      component: GuideQrView
    },
    {
      path: '/guide/social-sospetto',
      name: 'guide-social',
      component: GuideSocialView
    },
    {
      path: '/guide/chiamate-sospette',
      name: 'guide-chiamate',
      component: GuideChiamateView
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: ArticleDetailView,
      props: true
    },
    {
      path: '/login/operator',
      name: 'login-operator',
      component: LoginView,
      props: { mode: 'operator' }
    },
    {
      path: '/login/cittadino',
      name: 'login-citizen',
      component: LoginView,
      props: { mode: 'user' }
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
    next({ name: 'home' });
  } else if (to.meta.requiresOperator && user.role !== 'operator') {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router