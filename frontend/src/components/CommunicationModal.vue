<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm animate-fade-in" @click.self="close">
    
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click.self="close"></div>
    
    <div v-if="loading" class="relative z-10 text-white flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
        <p>Caricamento dettagli...</p>
    </div>

    <div v-else-if="error" class="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center animate-slide-up">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Impossibile caricare</h3>
        <p class="text-gray-500 mb-6">{{ error }}</p>
        <button @click="close" class="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium">
            Chiudi
        </button>
    </div>
    
    <div v-else-if="communication" 
         class="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col animate-slide-up overflow-hidden
                max-h-[80vh] md:max-h-[90vh]"> 
        
        <div class="flex-none p-5 border-b bg-white flex justify-between items-start shadow-sm z-20">
            <div class="pr-4 overflow-hidden">
                 <span class="flex items-center gap-1 text-sm text-gray-500 mb-1 font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {{ formatDate(communication.publication) }}
                </span>
                <h2 class="text-xl md:text-2xl font-bold text-gray-900 leading-tight truncate">{{ communication.title }}</h2>
            </div>
            <button @click="close" class="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 sm:p-8">
             <div class="flex flex-wrap gap-2 mb-6">
                <span class="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded text-white shadow-sm" :class="getImportanceBg(communication.importance)">
                    {{ getRischioLabel(communication.importance) }}
                </span>
                <span class="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ communication.categoria }}
                </span>
             </div>

            <div class="prose max-w-none text-justify text-gray-800 whitespace-pre-line leading-relaxed">
                <div v-if="communication.text" class="text-base text-gray-700" v-html="communication.text"></div>
            </div>
            
            <div v-if="communication.author" class="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
                 <div class="bg-gray-200 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </div>
                 Pubblicato da: <span class="font-medium text-gray-700">{{ communication.author.name }} {{ communication.author.surname }}</span>
            </div>
        </div>
        
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api'; 

const props = defineProps(['id']);
const router = useRouter();

const communication = ref(null);
const loading = ref(true);
const error = ref(null);

const close = () => {
    router.push({ name: 'communications' });
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const getRischioLabel = (importance) => {
    if (!importance) return 'Rischio: Info';
    const i = importance.toLowerCase();
    if (i === 'alto rischio') return 'Rischio: Alto';
    if (i === 'medio rischio') return 'Rischio: Medio';
    if (i === 'basso rischio') return 'Rischio: Basso';
    return 'Rischio: ' + importance.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getImportanceBg = (importance) => {
    switch(importance?.toLowerCase()) {
        case 'alto rischio': return 'bg-red-500';
        case 'medio rischio': return 'bg-yellow-500';
        default: return 'bg-blue-500';
    }
};

onMounted(async () => {
    document.body.style.overflow = 'hidden';
    loading.value = true;
    error.value = null;
    communication.value = null;

    try {
        const response = await api.getCommunicationById(props.id);
        if (!response.data) throw new Error("Dati vuoti");
        communication.value = response.data;
    } catch (err) {
        console.error("Errore recupero dettaglio:", err);
        if (err.response && err.response.status === 404) {
            error.value = "La comunicazione cercata non esiste o è stata rimossa.";
        } else {
            error.value = "Si è verificato un problema nel caricamento. Riprova più tardi.";
        }
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    document.body.style.overflow = '';
});
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>