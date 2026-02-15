<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8 text-primary">
            {{ userRole === 'user' ? 'Il mio profilo' : 'Dashboard operatore' }}
        </h1>

        <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <div v-else>
            <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
                    :class="['px-6 py-3 font-medium text-sm focus:outline-none transition whitespace-nowrap', currentTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700']">
                    {{ tab.label }}
                </button>
            </div>

            <div v-if="currentTab === 'profile'" class="space-y-8">
                <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <h2 class="text-xl font-bold mb-4 text-gray-800">I miei dati</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Nome completo</label>
                            <p class="text-lg font-semibold">{{ user.name }} {{ user.surname }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Email</label>
                            <p class="text-lg font-semibold">{{ user.email }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Codice fiscale</label>
                            <p class="text-lg font-semibold">{{ user.cf || 'N/D' }}</p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500 mb-1">Notifiche</span>

                            <label class="flex items-center cursor-pointer select-none">
                                <div class="relative">
                                    <input type="checkbox" class="sr-only" v-model="user.allow_notifications"
                                        @change="toggleNotificationStatus(user)">

                                    <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>

                                    <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform duration-300 ease-in-out"
                                        :class="{ 'transform translate-x-full bg-primary': user.allow_notifications }">
                                    </div>
                                </div>

                                <div class="ml-3 text-gray-700 font-medium text-sm w-16">
                                    {{ user.allow_notifications ? 'Attivo' : 'Disattivo' }}
                                </div>
                            </label>
                        </div>

                    </div>
                </div>

                <div>
                    <h2 class="text-xl font-bold mb-4">Lo storico delle tue segnalazioni</h2>
                    <div v-if="reports.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded">Non hai
                        ancora inviato segnalazioni.</div>
                    <div v-else class="bg-white shadow overflow-hidden rounded-md">
                        <ul class="divide-y divide-gray-200">
                            <li v-for="report in reports" :key="report.id" class="p-4 hover:bg-gray-50">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-bold text-lg text-gray-800">{{ report.title }}</div>
                                        <div class="text-sm text-gray-500 mb-2">
                                            <span class="mr-3">📅 {{ formatDate(report.created_at) }}</span>
                                            <span
                                                class="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{{
                                                    report.categoria }}</span>
                                        </div>
                                        <p class="text-gray-700 line-clamp-2">{{ report.text }}</p>
                                    </div>
                                    <div>
                                        <span
                                            :class="['px-2 py-1 text-xs font-bold rounded-full uppercase', getStatusColor(report.status)]">
                                            {{ report.status }}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div v-if="currentTab === 'reports'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Coda di lavorazione segnalazioni</h2>
                    <div class="flex gap-2">
                        <select v-model="reportFilterStatus" @change="fetchReports" class="border rounded p-2 text-sm">
                            <option value="">Tutti gli stati</option>
                            <option value="da elaborare">Da elaborare</option>
                            <option value="in lavorazione">In lavorazione</option>
                            <option value="risolta">Risolta</option>
                        </select>
                    </div>
                </div>

                <div v-if="reports.length === 0" class="text-gray-500 text-center py-8">Nessuna segnalazione trovata.
                </div>

                <div v-else class="bg-white shadow overflow-hidden rounded-md">
                    <ul class="divide-y divide-gray-200">
                        <li v-for="report in reports" :key="report.id" class="p-4 hover:bg-gray-50">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="font-bold text-lg text-gray-800">{{ report.title }}</div>
                                    <div class="text-sm text-gray-500 mb-2">
                                        <span class="mr-3">📅 {{ formatDate(report.created_at) }}</span>
                                        <span class="mr-3">🧑🏻 {{ report.author?.name || 'Utente' }}</span>
                                        <span
                                            class="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{{
                                                report.categoria }}</span>
                                    </div>
                                    <p class="text-gray-700 line-clamp-2">{{ report.text }}</p>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <span
                                        :class="['px-2 py-1 text-xs font-bold rounded-full uppercase', getStatusColor(report.status)]">
                                        {{ report.status }}
                                    </span>
                                    <button class="text-primary text-sm font-semibold hover:underline">Gestisci</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="currentTab === 'communications'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Gestione comunicazioni</h2>
                    <button class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Nuova
                        comunicazione</button>
                </div>

                <div class="bg-white shadow overflow-hidden rounded-md">
                    <ul class="divide-y divide-gray-200">
                        <li v-for="comm in communications" :key="comm.id" class="p-4 hover:bg-gray-50">
                            <div class="flex justify-between">
                                <div>
                                    <div class="font-bold">{{ comm.title }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ comm.importance }} - {{ formatDate(comm.publication) }}
                                    </div>
                                </div>
                                <div class="flex gap-2 text-sm text-primary">
                                    <button>Modifica</button>
                                    <button class="text-red-600">Elimina</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="currentTab === 'articles'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Gestione articoli</h2>
                    <button class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Nuovo
                        articolo</button>
                </div>

                <div class="bg-white shadow overflow-hidden rounded-md">
                    <ul class="divide-y divide-gray-200">
                        <li v-for="article in articles" :key="article.id" class="p-4 hover:bg-gray-50">
                            <div class="flex justify-between">
                                <div>
                                    <div class="font-bold">{{ article.title }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ article.categoria }} - {{ formatDate(article.last_edit) }}
                                    </div>
                                </div>
                                <div class="flex gap-2 text-sm text-primary">
                                    <button>Modifica</button>
                                    <button class="text-red-600">Elimina</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="currentTab === 'operators'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Amministrazione operatori</h2>
                    <button @click="showCreateOperatorModal = true"
                        class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Nuovo
                        operatore</button>
                </div>

                <div class="bg-white shadow overflow-hidden rounded-md">
                    <ul class="divide-y divide-gray-200">
                        <li v-for="op in operators" :key="op.id" class="p-4 hover:bg-gray-50 bg-white">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-bold text-gray-900">{{ op.name }} {{ op.surname }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ op.email }}
                                    </div>
                                    <div class="mt-1">
                                        <span
                                            class="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700 uppercase">{{
                                                op.role }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="flex flex-col items-end">
                                        <span class="text-xs text-gray-500 mb-1">Stato account</span>
                                        <label class="flex items-center cursor-pointer">
                                            <div class="relative">
                                                <input type="checkbox" class="sr-only" :checked="op.isActive"
                                                    @change="toggleOperatorStatus(op)">
                                                <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                                                <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"
                                                    :class="{ 'transform translate-x-full bg-primary': op.isActive }">
                                                </div>
                                            </div>
                                            <div class="ml-3 text-gray-700 font-medium text-sm w-16">
                                                {{ op.isActive ? 'Attivo' : 'Disattivo' }}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <Transition name="modal-fade">
            <div v-if="showCreateOperatorModal"
                class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                    @click="showCreateOperatorModal = false"></div>

                <div class="relative w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all">

                    <div class="mb-6 text-center">
                        <h2 class="text-2xl font-bold text-gray-800">Crea nuovo operatore</h2>
                        <p class="text-sm text-gray-500 mt-1">Inserisci i dettagli del nuovo membro del team.</p>
                    </div>

                    <form @submit.prevent="createOperator">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Nome</label>
                            <input v-model="newOperator.name" type="text" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Mario">
                        </div>

                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Cognome</label>
                            <input v-model="newOperator.surname" type="text" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Rossi">
                        </div>

                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                            <input v-model="newOperator.email" type="email" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="mario.rossi@example.com">
                        </div>

                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Ruolo</label>
                            <div class="relative">
                                <select v-model="newOperator.role"
                                    class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors">
                                    <option value="reporter">Reporter</option>
                                    <option value="editor">Editor</option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end gap-3">
                            <button type="button" @click="showCreateOperatorModal = false"
                                class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                                Annulla
                            </button>
                            <button type="submit"
                                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-blue-700 hover:shadow-primary/50 transition-all transform active:scale-95">
                                Crea operatore
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue';
import api from '@/services/api';

const currentUser = reactive(JSON.parse(localStorage.getItem('user') || '{}'));
const userRole = computed(() => currentUser.role || 'user');

const currentTab = ref('');

const tabs = computed(() => {
    switch (userRole.value) {
        case 'user':
            return [
                { id: 'profile', label: 'Il mio profilo' }
            ];
        case 'editor':
            return [
                { id: 'articles', label: 'Gestione articoli' }
            ];
        case 'reporter':
            return [
                { id: 'reports', label: 'Gestione segnalazioni' },
                { id: 'communications', label: 'Comunicazioni' }
            ];
        case 'admin':
            return [
                { id: 'operators', label: 'Gestione operatori' },
            ];
        default:
            return [];
    }
});

watch(tabs, (newTabs) => {
    if (newTabs.length > 0 && !currentTab.value) {
        currentTab.value = newTabs[0].id;
    }
}, { immediate: true });


const loading = ref(false);
const reports = ref([]);
const user = ref({});
const communications = ref([]);
const articles = ref([]);
const operators = ref([]);
const reportFilterStatus = ref('');

const showCreateOperatorModal = ref(false);
const newOperator = reactive({
    name: '',
    surname: '',
    email: '',
    role: 'reporter',
});

// --- API FETCH FUNCTIONS ---
const fetchReports = async () => {
    loading.value = true;
    try {
        const params = {};
        if (reportFilterStatus.value) params.status = reportFilterStatus.value;
        let response;
        if (userRole.value === 'user') {
            response = await api.getMyReports();
        } else {
            response = await api.getReports(params);

        }

        reports.value = response.data.map(item => {
            const r = item.report;
            r.created_at = r.created;
            return r;
        });

    } catch (err) {
        console.error("Error fetching reports", err);
    } finally {
        loading.value = false;
    }
}

const fetchUser = async () => {
    loading.value = true;
    try {
        const response = await api.getMe();
        user.value = response.data;
    } catch (err) {
        console.error("Error fetching user", err);
    } finally {
        loading.value = false;
    }
}

const fetchCommunications = async () => {
    loading.value = true;
    try {
        const response = await api.getCommunications({ sort: 'publication', direction: 'desc' });
        communications.value = response.data;
    } catch (err) {
        console.error("Error fetching communications", err);
    } finally {
        loading.value = false;
    }
}

const fetchArticles = async () => {
    loading.value = true;
    try {
        const response = await api.getArticles();
        articles.value = response.data;
    } catch (err) {
        console.error("Error fetching articles", err);
    } finally {
        loading.value = false;
    }
}

const fetchOperators = async () => {
    if (userRole.value !== 'admin') return;
    loading.value = true;
    try {
        const response = await api.getOperators();
        operators.value = response.data;
    } catch (err) {
        console.error("Error fetching operators", err);
    } finally {
        loading.value = false;
    }
}

const createOperator = async () => {
    try {
        await api.createOperator(newOperator);
        showCreateOperatorModal.value = false;
        fetchOperators();
        newOperator.name = '';
        newOperator.surname = '';
        newOperator.email = '';
        newOperator.role = 'reporter';
    } catch (err) {
        alert("Errore creazione operatore: " + (err.response?.data?.message || err.message));
    }
}

const toggleNotificationStatus = async () => {
    try {
        await api.updateNotificationStatus(!user.allow_notifications);
        user.allow_notifications = !user.allow_notifications;
    } catch (err) {
        console.error("Error upgrading notification status", err);
        alert("Impossibile aggiornare lo stato delle notifiche.");
    }
}

const toggleOperatorStatus = async (op) => {
    try {
        await api.updateOperatorStatus(op.id, !op.isActive);
        op.isActive = !op.isActive;
    } catch (err) {
        console.error("Error upgrading status", err);
        alert("Impossibile aggiornare lo stato dell'operatore.");
    }
}

const loadTabContent = () => {
    // Carica dati in base alla tab corrente
    if (currentTab.value === 'reports') fetchReports();
    if (currentTab.value === 'profile') { fetchUser(); fetchReports(); }
    if (currentTab.value === 'communications') fetchCommunications();
    if (currentTab.value === 'articles') fetchArticles();
    if (currentTab.value === 'operators') fetchOperators();
}

watch(currentTab, () => {
    loadTabContent();
});

const getStatusColor = (status) => {
    switch (status) {
        case 'risolta': return 'bg-green-100 text-green-800';
        case 'in lavorazione': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-red-100 text-red-800';
    }
}

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
};

onMounted(() => {
    if (currentTab.value) loadTabContent();
});
</script>


<style scoped>
/*taken somewhere over the internet */
.modal-fade-enter-active {
    transition: opacity 0.3s ease-out;
}

.modal-fade-leave-active {
    transition: opacity 0.2s ease-in;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-active .transform {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-duration: 0.4s;
}

.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}
</style>