<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Accedi a SCUDO
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Scegli la modalità di accesso
        </p>
      </div>
      
      <div class="flex justify-center space-x-4 mb-6">
        <button 
          @click="loginMode = 'operator'" 
          :class="['px-4 py-2 rounded-md transition font-medium', loginMode === 'operator' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          Operatore
        </button>
        <button 
          @click="loginMode = 'user'" 
          :class="['px-4 py-2 rounded-md transition font-medium', loginMode === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          SPID / CIE
        </button>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Indirizzo Email</label>
            <input 
              v-model="email" 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
              placeholder="Indirizzo Email"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input 
              v-model="password" 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
              placeholder="Password"
            >
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center font-semibold">
          {{ error }}
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-300 group-hover:text-blue-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-if="loading">Accesso in corso...</span>
            <span v-else>Accedi</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Aggiunto import onMounted
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const loginMode = ref('operator');

// --- NUOVO CODICE: Controllo sessione esistente ---
onMounted(() => {
  const token = localStorage.getItem('token');
  // Se c'è un token, reindirizza direttamente alla dashboard
  if (token) {
    router.replace('/dashboard'); // Usa replace per evitare che il tasto "indietro" riporti al login
  }
});
// --------------------------------------------------

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    let response;
    if (loginMode.value === 'operator') {
      response = await api.loginOperator(email.value, password.value);
    } else {
       response = await api.loginSpid(email.value, password.value);
    }

    const { token, id, self, role } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ id, self, role }));

    const redirectPath = route.query.redirect;
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push('/dashboard');
    }
    
    setTimeout(() => {
       window.location.reload(); 
    }, 100);
    
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'Credenziali non valide o errore del server.';
  } finally {
    loading.value = false;
  }
};
</script>