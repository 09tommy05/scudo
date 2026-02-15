<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <img src="/logo-white.svg" alt="SCUDO Logo" class="h-9 w-9 rounded-md bg-primary p-1.5" />
          <div class="leading-tight">
            <span class="text-lg font-bold text-gray-900 tracking-tight">SCUDO</span>
            <span class="hidden sm:block text-[10px] uppercase tracking-widest text-gray-400 font-medium">Comune di Trento</span>
          </div>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <router-link to="/"
            class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
            Home
          </router-link>
          <router-link to="/communications"
            class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
            Comunicazioni
          </router-link>
          <router-link to="/report/create"
            class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
            Segnala
          </router-link>

          <div class="w-px h-6 bg-gray-200 mx-2"></div>

          <template v-if="!isAuthenticated">
            <router-link to="/login"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
              Area operatori
            </router-link>
            <router-link to="/login"
              class="ml-1 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Accedi con SPID/CIE
            </router-link>
          </template>
          <template v-else>
            <router-link to="/dashboard"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
              Dashboard
            </router-link>
            <button @click="logout"
              class="ml-1 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Esci
            </button>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen"
            class="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden border-t border-gray-100 bg-white shadow-lg">
      <div class="px-4 py-3 space-y-1">
        <router-link to="/" @click="isOpen = false"
          class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
          Home
        </router-link>
        <router-link to="/communications" @click="isOpen = false"
          class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
          Comunicazioni
        </router-link>
        <router-link to="/report/create" @click="isOpen = false"
          class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
          Segnala
        </router-link>

        <div class="border-t border-gray-100 my-2"></div>

        <template v-if="!isAuthenticated">
          <router-link to="/login" @click="isOpen = false"
            class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
            Area operatori
          </router-link>
          <router-link to="/login" @click="isOpen = false"
            class="block w-full text-center px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors mt-2">
            Accedi con SPID/CIE
          </router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard" @click="isOpen = false"
            class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
            Dashboard
          </router-link>
          <button @click="logout"
            class="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Esci
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const router = useRouter();

const isAuthenticated = computed(() => !!localStorage.getItem('token'));

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
  window.location.reload();
};
</script>
