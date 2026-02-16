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
                    <button @click="openCreateCommunication"
                        class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Nuova
                        comunicazione</button>
                </div>

                <div v-if="communicationsLoading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div v-else-if="communications.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                    Nessuna comunicazione. Clicca "Nuova comunicazione" per crearne una.
                </div>
                <div v-else class="bg-white shadow overflow-hidden rounded-md">
                    <ul class="divide-y divide-gray-200">
                        <li v-for="comm in communications" :key="comm.id || comm._id" class="p-4 hover:bg-gray-50">
                            <div class="flex justify-between items-start gap-4">
                                <div class="min-w-0 flex-1">
                                    <div class="font-bold text-gray-800">{{ comm.title }}</div>
                                    <div class="text-sm text-gray-500 mt-1">
                                        {{ comm.importance }} · {{ comm.categoria }} · {{ formatDate(comm.publication) }}
                                    </div>
                                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ comm.short_text }}</p>
                                    <span v-if="comm.isDraft"
                                        class="inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 uppercase">
                                        Bozza
                                    </span>
                                </div>
                                <div class="flex flex-col sm:flex-row items-end gap-2 shrink-0">
                                    <button v-if="comm.isDraft" @click="publishCommunication(comm)"
                                        class="text-sm font-semibold text-primary hover:underline">Pubblica</button>
                                    <button @click="openEditCommunication(comm)"
                                        class="text-sm font-semibold text-primary hover:underline">Modifica</button>
                                    <button @click="confirmDeleteCommunication(comm)"
                                        class="text-sm font-semibold text-red-600 hover:underline">Elimina</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="currentTab === 'articles'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Gestione articoli</h2>
                    <button @click="openCreateArticle"
                        class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Nuovo
                        articolo</button>
                </div>

                <div v-if="articlesLoading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div v-else-if="articles.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                    Nessun articolo. Clicca "Nuovo articolo" per crearne uno.
                </div>
                <div v-else class="bg-white shadow overflow-hidden rounded-md">
                    <ul class="divide-y divide-gray-200">
                        <li v-for="article in articles" :key="article.id || article._id" class="p-4 hover:bg-gray-50">
                            <div class="flex justify-between items-start gap-4">
                                <div class="min-w-0 flex-1">
                                    <div class="font-bold text-gray-800">{{ article.title }}</div>
                                    <div class="text-sm text-gray-500 mt-1">
                                        {{ article.categoria }} · {{ formatDate(article.last_edit) }}
                                    </div>
                                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ article.short_text }}</p>
                                    <span v-if="article.isDraft"
                                        class="inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 uppercase">
                                        Bozza
                                    </span>
                                </div>
                                <div class="flex flex-col sm:flex-row items-end gap-2 shrink-0">
                                    <button v-if="article.isDraft" @click="publishArticle(article)"
                                        class="text-sm font-semibold text-primary hover:underline">Pubblica</button>
                                    <button @click="openEditArticle(article)"
                                        class="text-sm font-semibold text-primary hover:underline">Modifica</button>
                                    <button @click="confirmDeleteArticle(article)"
                                        class="text-sm font-semibold text-red-600 hover:underline">Elimina</button>
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

        <!-- Article create/edit modal -->
        <Transition name="modal-fade">
            <div v-if="showArticleModal"
                class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                    @click="closeArticleModal"></div>

                <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
                    <div class="mb-6 text-center">
                        <h2 class="text-2xl font-bold text-gray-800">{{ editingArticleId ? 'Modifica articolo' : 'Nuovo articolo' }}</h2>
                        <p class="text-sm text-gray-500 mt-1">{{ editingArticleId ? 'Aggiorna i campi e salva.' : 'Compila i campi per creare un articolo (bozza o pubblicato).' }}</p>
                    </div>

                    <form @submit.prevent="saveArticle" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Titolo *</label>
                            <input v-model="articleForm.title" type="text" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Titolo dell'articolo">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Testo breve (anteprima) *</label>
                            <textarea v-model="articleForm.short_text" required rows="2"
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Breve descrizione per le anteprime"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Testo completo *</label>
                            <textarea v-model="articleForm.text" required rows="6"
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Contenuto dell'articolo"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Categoria *</label>
                            <input v-model="articleForm.categoria" type="text" required list="article-categories"
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="es. Phishing, Smishing">
                            <datalist id="article-categories">
                                <option v-for="c in articleCategories" :key="c" :value="c"></option>
                            </datalist>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Immagine</label>
                            <p v-if="editingArticleId && articleForm.currentImg" class="text-xs text-gray-500 mb-1">Attuale: {{ articleForm.currentImg }}</p>
                            <input type="file" accept="image/*" @change="onArticleImageChange"
                                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white file:font-semibold">
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="article-draft" v-model="articleForm.isDraft" type="checkbox"
                                class="rounded border-gray-300 text-primary focus:ring-primary">
                            <label for="article-draft" class="text-sm font-medium text-gray-700">Salva come bozza</label>
                        </div>
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="closeArticleModal"
                                class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                                Annulla
                            </button>
                            <button type="submit"
                                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-blue-700 hover:shadow-primary/50 transition-all transform active:scale-95">
                                {{ editingArticleId ? 'Salva modifiche' : 'Crea articolo' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Delete article confirmation -->
        <Transition name="modal-fade">
            <div v-if="articleToDelete"
                class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="articleToDelete = null"></div>
                <div class="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Elimina articolo</h3>
                    <p class="text-gray-600 mb-6">Eliminare «{{ articleToDelete.title }}»? Questa azione non si può annullare.</p>
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="articleToDelete = null"
                            class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
                        <button type="button" @click="doDeleteArticle"
                            class="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">Elimina</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Communication create/edit modal -->
        <Transition name="modal-fade">
            <div v-if="showCommunicationModal"
                class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                    @click="closeCommunicationModal"></div>

                <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
                    <div class="mb-6 text-center">
                        <h2 class="text-2xl font-bold text-gray-800">{{ editingCommunicationId ? 'Modifica comunicazione' : 'Nuova comunicazione' }}</h2>
                        <p class="text-sm text-gray-500 mt-1">{{ editingCommunicationId ? 'Aggiorna i campi e salva.' : 'Compila i campi per creare una comunicazione (bozza o pubblicata).' }}</p>
                    </div>

                    <form @submit.prevent="saveCommunication" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Titolo *</label>
                            <input v-model="communicationForm.title" type="text" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Titolo della comunicazione">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Testo breve (anteprima) *</label>
                            <textarea v-model="communicationForm.short_text" required rows="2"
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Breve descrizione per le anteprime"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Testo completo *</label>
                            <textarea v-model="communicationForm.text" required rows="6"
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="Contenuto della comunicazione"></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Categoria *</label>
                            <input v-model="communicationForm.categoria" type="text" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors"
                                placeholder="es. Avviso, Allerta">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-semibold mb-2">Importanza *</label>
                            <select v-model="communicationForm.importance" required
                                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-colors">
                                <option value="basso rischio">Basso rischio</option>
                                <option value="medio rischio">Medio rischio</option>
                                <option value="alto rischio">Alto rischio</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="comm-draft" v-model="communicationForm.isDraft" type="checkbox"
                                class="rounded border-gray-300 text-primary focus:ring-primary">
                            <label for="comm-draft" class="text-sm font-medium text-gray-700">Salva come bozza</label>
                        </div>
                        <div v-if="!communicationForm.isDraft" class="flex items-center gap-2">
                            <input id="comm-notify" v-model="communicationForm.notify" type="checkbox"
                                class="rounded border-gray-300 text-primary focus:ring-primary">
                            <label for="comm-notify" class="text-sm font-medium text-gray-700">Invia notifica agli utenti</label>
                        </div>
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="closeCommunicationModal"
                                class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                                Annulla
                            </button>
                            <button type="submit"
                                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-blue-700 hover:shadow-primary/50 transition-all transform active:scale-95">
                                {{ editingCommunicationId ? 'Salva modifiche' : 'Crea comunicazione' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Delete communication confirmation -->
        <Transition name="modal-fade">
            <div v-if="communicationToDelete"
                class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="communicationToDelete = null"></div>
                <div class="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Elimina comunicazione</h3>
                    <p class="text-gray-600 mb-6">Eliminare «{{ communicationToDelete.title }}»? Questa azione non si può annullare.</p>
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="communicationToDelete = null"
                            class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
                        <button type="button" @click="doDeleteCommunication"
                            class="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">Elimina</button>
                    </div>
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

// Articles (editor)
const articlesLoading = ref(false);
const showArticleModal = ref(false);
const editingArticleId = ref(null);
const articleToDelete = ref(null);
const articleCategories = ref([]);
const articleForm = reactive({
    title: '',
    text: '',
    short_text: '',
    categoria: '',
    img: null,
    currentImg: '',
    isDraft: true,
});

// Communications (reporter)
const communicationsLoading = ref(false);
const showCommunicationModal = ref(false);
const editingCommunicationId = ref(null);
const communicationToDelete = ref(null);
const communicationForm = reactive({
    title: '',
    text: '',
    short_text: '',
    categoria: '',
    importance: 'medio rischio',
    isDraft: true,
    notify: false,
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
    communicationsLoading.value = true;
    try {
        const response = await api.getMyCommunications();
        communications.value = Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error("Error fetching communications", err);
        communications.value = [];
    } finally {
        communicationsLoading.value = false;
    }
};

const openCreateCommunication = () => {
    editingCommunicationId.value = null;
    communicationForm.title = '';
    communicationForm.text = '';
    communicationForm.short_text = '';
    communicationForm.categoria = '';
    communicationForm.importance = 'medio rischio';
    communicationForm.isDraft = true;
    communicationForm.notify = false;
    showCommunicationModal.value = true;
};

const openEditCommunication = (comm) => {
    editingCommunicationId.value = comm.id || comm._id;
    communicationForm.title = comm.title || '';
    communicationForm.text = comm.text || '';
    communicationForm.short_text = comm.short_text || '';
    communicationForm.categoria = comm.categoria || '';
    communicationForm.importance = comm.importance || 'medio rischio';
    communicationForm.isDraft = !!comm.isDraft;
    communicationForm.notify = false;
    showCommunicationModal.value = true;
};

const closeCommunicationModal = () => {
    showCommunicationModal.value = false;
    editingCommunicationId.value = null;
};

const saveCommunication = async () => {
    const payload = {
        title: communicationForm.title.trim(),
        text: communicationForm.text.trim(),
        short_text: communicationForm.short_text.trim(),
        categoria: communicationForm.categoria.trim(),
        importance: communicationForm.importance,
        isDraft: communicationForm.isDraft,
        notify: communicationForm.notify,
    };
    try {
        if (editingCommunicationId.value) {
            await api.updateCommunication(editingCommunicationId.value, payload);
        } else {
            await api.createCommunication(payload);
        }
        closeCommunicationModal();
        fetchCommunications();
    } catch (err) {
        alert('Errore: ' + (err.response?.data?.message || err.message));
    }
};

const confirmDeleteCommunication = (comm) => {
    communicationToDelete.value = comm;
};

const doDeleteCommunication = async () => {
    if (!communicationToDelete.value) return;
    const id = communicationToDelete.value.id || communicationToDelete.value._id;
    try {
        await api.deleteCommunication(id);
        communicationToDelete.value = null;
        fetchCommunications();
    } catch (err) {
        alert('Errore eliminazione: ' + (err.response?.data?.message || err.message));
    }
};

const publishCommunication = async (comm) => {
    const id = comm.id || comm._id;
    try {
        await api.publishCommunication(id, true);
        fetchCommunications();
    } catch (err) {
        alert('Errore pubblicazione: ' + (err.response?.data?.message || err.message));
    }
};

const fetchArticles = async () => {
    articlesLoading.value = true;
    try {
        const response = await api.getArticles();
        articles.value = Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error("Error fetching articles", err);
        articles.value = [];
    } finally {
        articlesLoading.value = false;
    }
};

const loadArticleCategories = async () => {
    try {
        const res = await api.getCategories();
        articleCategories.value = res.data?.categories || [];
    } catch {
        articleCategories.value = [];
    }
};

const openCreateArticle = () => {
    editingArticleId.value = null;
    articleForm.title = '';
    articleForm.text = '';
    articleForm.short_text = '';
    articleForm.categoria = '';
    articleForm.img = null;
    articleForm.currentImg = '';
    articleForm.isDraft = true;
    loadArticleCategories();
    showArticleModal.value = true;
};

const openEditArticle = (article) => {
    editingArticleId.value = article.id || article._id;
    articleForm.title = article.title || '';
    articleForm.text = article.text || '';
    articleForm.short_text = article.short_text || '';
    articleForm.categoria = article.categoria || '';
    articleForm.img = null;
    articleForm.currentImg = article.img || '';
    articleForm.isDraft = !!article.isDraft;
    loadArticleCategories();
    showArticleModal.value = true;
};

const closeArticleModal = () => {
    showArticleModal.value = false;
    editingArticleId.value = null;
};

const onArticleImageChange = (e) => {
    const f = e.target?.files?.[0];
    articleForm.img = f || null;
};

const saveArticle = async () => {
    const payload = {
        title: articleForm.title.trim(),
        text: articleForm.text.trim(),
        short_text: articleForm.short_text.trim(),
        categoria: articleForm.categoria.trim(),
        isDraft: articleForm.isDraft,
    };
    if (articleForm.img instanceof File) payload.img = articleForm.img;
    try {
        if (editingArticleId.value) {
            await api.updateArticle(editingArticleId.value, payload);
        } else {
            await api.createArticle(payload);
        }
        closeArticleModal();
        fetchArticles();
    } catch (err) {
        alert('Errore: ' + (err.response?.data?.message || err.message));
    }
};

const confirmDeleteArticle = (article) => {
    articleToDelete.value = article;
};

const doDeleteArticle = async () => {
    if (!articleToDelete.value) return;
    const id = articleToDelete.value.id || articleToDelete.value._id;
    try {
        await api.deleteArticle(id);
        articleToDelete.value = null;
        fetchArticles();
    } catch (err) {
        alert('Errore eliminazione: ' + (err.response?.data?.message || err.message));
    }
};

const publishArticle = async (article) => {
    const id = article.id || article._id;
    try {
        await api.publishArticle(id);
        fetchArticles();
    } catch (err) {
        alert('Errore pubblicazione: ' + (err.response?.data?.message || err.message));
    }
};

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