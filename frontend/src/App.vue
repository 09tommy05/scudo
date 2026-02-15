<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <NavBar v-if="!route.meta.hideLayout" />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer v-if="!route.meta.hideLayout" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
</script>
