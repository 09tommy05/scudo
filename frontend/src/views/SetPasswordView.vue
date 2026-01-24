<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">

      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Attiva il tuo Account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Imposta la tua password per accedere a SCUDO
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="success" class="text-center space-y-6">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Password impostata correttamente!</h3>
        <p class="text-sm text-gray-500">Ora puoi effettuare l'accesso con le tue nuove credenziali.</p>
        <router-link to="/login"
          class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none transition">
          Vai al Login
        </router-link>
      </div>

      <div v-else-if="invalidLink" class="text-center space-y-4">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Link non valido o scaduto</h3>
        <p class="text-sm text-gray-500">Assicurati di aver copiato l'intero link ricevuto via email.</p>
        <router-link to="/" class="text-primary hover:underline font-medium">Torna alla home</router-link>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
            <input v-model="form.password" id="password" name="password" type="password" required minlength="8"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Minimo 8 caratteri">
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Conferma Password</label>
            <input v-model="form.confirmPassword" id="confirm-password" name="confirm-password" type="password" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Ripeti la password">
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
          <div class="flex">
            <div class="ml-3">
              <p class="text-sm text-red-700 font-bold">Errore</p>
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading || isFormInvalid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition">
            Imposta Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();

const loading = ref(false);
const success = ref(false);
const invalidLink = ref(false);
const error = ref('');

const form = reactive({
  password: '',
  confirmPassword: ''
});

const token = route.query.token;
const userId = route.query.id;

const isFormInvalid = computed(() => {
  return !form.password || form.password.length < 8 || form.password !== form.confirmPassword;
});

onMounted(() => {
  if (!token || !userId) {
    invalidLink.value = true;
  }
});

const handleSubmit = async () => {
  error.value = '';

  // Validazione password match
  if (form.password !== form.confirmPassword) {
    error.value = "Le password non coincidono.";
    return;
  }

  if (form.password.length < 8) {
    error.value = "La password deve essere di almeno 8 caratteri.";
    return;
  }

  loading.value = true;

  try {
    await api.setFirstPassword(userId, token, form.password);
    success.value = true;

  } catch (err) {
    console.error("Errore impostazione password:", err);
    error.value = err.response?.data?.message || "Impossibile impostare la password. Il link potrebbe essere scaduto.";
  } finally {
    loading.value = false;
  }
};
</script>