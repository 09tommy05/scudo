<template>
  <nav class="bg-primary text-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="text-2xl font-bold flex items-center gap-2">
           <img src="/logo-white.svg" alt="SCUDO Logo" class="h-8 w-8 sm:h-10 sm:w-10" />
        </router-link>
        
        <div class="hidden md:flex space-x-8">
          <router-link to="/" class="hover:text-gray-200 transition">Guida</router-link>
          <router-link to="/communications" class="hover:text-gray-200 transition">Comunicazioni</router-link>
          <router-link to="/report/create" class="hover:text-gray-200 transition">Segnala</router-link>

          
          <template v-if="!isAuthenticated">
             <router-link to="/login" class="hover:text-gray-200 transition">Accedi</router-link>
          </template>
          <template v-else>
              <router-link to="/dashboard" class="hover:text-gray-200 transition">Dashboard</router-link>
              <button @click="logout" class="hover:text-gray-200 transition">Esci</button>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen" class="focus:outline-none">
             <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
             </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden bg-primary pb-4">
      <router-link to="/" class="block py-2 px-4 text-sm hover:bg-blue-700">Guida</router-link>
      <router-link to="/communications" class="hover:text-gray-200 transition">Comunicazioni</router-link>
      <router-link to="/report/create" class="block py-2 px-4 text-sm hover:bg-blue-700">Segnala</router-link>
      
      <template v-if="!isAuthenticated">
         <router-link to="/login" class="block py-2 px-4 text-sm hover:bg-blue-700">Accedi</router-link>
      </template>
      <template v-else>
          <router-link to="/dashboard" class="block py-2 px-4 text-sm hover:bg-blue-700">Dashboard</router-link>
          <button @click="logout" class="block w-full text-left py-2 px-4 text-sm hover:bg-blue-700">Esci</button>
      </template>
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
