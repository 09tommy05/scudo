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
                <h2 class="text-xl font-bold">Gestione Segnalazioni</h2>

                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="text-sm text-gray-600">Filtra per:</span>
                    <select v-model="reportFilterStatus" @change="fetchReports"
                        class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="">Tutti gli stati</option>
                        <option value="da elaborare">Da elaborare</option>
                        <option value="in lavorazione">In lavorazione</option>
                        <option value="risolta">Risolta</option>
                    </select>
                    <select v-model="reportFilterCategoria" @change="fetchReports"
                        class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="">Tutte le categorie</option>
                        <option v-for="cat in reportCategories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div>

                <div v-if="loading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div v-else-if="reports.length === 0" class="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
                    Nessuna segnalazione trovata.
                </div>
                <div v-else class="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoria</th>
                                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cittadino</th>
                                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stato</th>
                                    <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Azioni</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="report in paginatedReports" :key="report.id || report._id" class="hover:bg-gray-50">
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {{ formatDate(report.created_at || report.created) }}
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{{ report.categoria }}</span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-700">
                                        {{ report.author?.name }} {{ report.author?.surname }}
                                    </td>
                                    <td class="px-4 py-3">
                                        <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full uppercase', getStatusColor(report.status)]">
                                            {{ report.status }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <div class="flex items-center justify-end gap-1">
                                            <button
                                                v-if="report.status === 'da elaborare'"
                                                type="button"
                                                @click="takeInCharge(report)"
                                                class="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Prendi in carico"
                                            >
                                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"><path d="M285.7 304c98.5 0 178.3 79.8 178.3 178.3 0 16.4-13.3 29.7-29.7 29.7L77.7 512C61.3 512 48 498.7 48 482.3 48 383.8 127.8 304 226.3 304l59.4 0zM528 80c13.3 0 24 10.7 24 24l0 48 48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0 0 48c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-48-48 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0 0-48c0-13.3 10.7-24 24-24zM256 248a120 120 0 1 1 0-240 120 120 0 1 1 0 240z"/></svg>
                                            </button>
                                            <router-link
                                                v-if="report.status === 'in lavorazione'"
                                                :to="{ name: 'report-detail', params: { id: report.id || report._id } }"
                                                class="inline-flex p-2 rounded-lg transition-colors text-gray-500 hover:text-primary hover:bg-primary/10"
                                                title="Rispondi"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                                            </router-link>
                                            <span v-else-if="report.status === 'da elaborare'" class="inline-flex p-2 text-gray-400 cursor-not-allowed" title="Prendi in carico per poter rispondere">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                                            </span>
                                            <span v-else class="inline-flex p-2 text-gray-400 cursor-not-allowed" title="Già risposta inviata">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="reports.length > reportPerPage" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                        <p class="text-sm text-gray-600">Visualizzati {{ reportRangeStart }}-{{ reportRangeEnd }} di {{ reports.length }} segnalazioni</p>
                        <div class="flex gap-2">
                            <button @click="reportPage = Math.max(1, reportPage - 1)" :disabled="reportPage <= 1"
                                class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Precedente</button>
                            <span class="flex items-center gap-1">
                                <button v-for="p in reportPageNumbers" :key="p" @click="reportPage = p"
                                    :class="['px-3 py-1.5 text-sm font-medium rounded-lg', p === reportPage ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50']">{{ p }}</button>
                            </span>
                            <button @click="reportPage = Math.min(reportTotalPages, reportPage + 1)" :disabled="reportPage >= reportTotalPages"
                                class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Successivo</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Report detail modal -->
            <Transition name="modal-fade">
                <div v-if="showReportDetailModal"
                    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
                    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeReportDetail"></div>
                    <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Dettaglio segnalazione</h3>
                        <template v-if="reportDetail">
                            <p class="text-xs text-gray-500 mb-1">{{ formatDate(reportDetail.created_at || reportDetail.created) }}</p>
                            <h4 class="font-semibold text-gray-900 mb-2">{{ reportDetail.title }}</h4>
                            <p class="text-sm text-gray-600 mb-3">{{ reportDetail.categoria }}</p>
                            <p class="text-sm text-gray-700 whitespace-pre-line mb-4">{{ reportDetail.text }}</p>
                            <p class="text-xs text-gray-500">Cittadino: {{ reportDetail.author?.name }} {{ reportDetail.author?.surname }}</p>
                            <span :class="['inline-flex mt-2 px-2 py-1 text-xs font-semibold rounded-full uppercase', getStatusColor(reportDetail.status)]">{{ reportDetail.status }}</span>
                            <div class="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    :disabled="reportDetail.status === 'risolta' || reportDetail.status === 'da elaborare'"
                                    @click="reportDetail.status === 'in lavorazione' && openReplyModal(reportDetail)"
                                    class="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-blue-700 disabled:hover:bg-primary"
                                >
                                    Rispondi
                                </button>
                                <button @click="closeReportDetail()" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Chiudi</button>
                            </div>
                        </template>
                    </div>
                </div>
            </Transition>

            <!-- Report reply modal -->
            <Transition name="modal-fade">
                <div v-if="showReplyModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
                    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeReplyModal"></div>
                    <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Rispondi alla segnalazione</h3>
                        <form @submit.prevent="submitReply" class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Titolo *</label>
                                <input v-model="replyForm.title" type="text" required
                                    class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Titolo della risposta">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Testo *</label>
                                <textarea v-model="replyForm.text" required rows="6"
                                    class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Testo della risposta"></textarea>
                            </div>
                            <div class="flex justify-end gap-2">
                                <button type="button" @click="closeReplyModal" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
                                <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Invia risposta</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>

            <div v-if="currentTab === 'communications'" class="space-y-6">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h2 class="text-xl font-bold">Gestione comunicazioni</h2>
                    <div class="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
                        <input v-model.trim="communicationsSearchQuery" type="search" placeholder="Cerca titolo, testo, categoria..."
                            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64 focus:ring-primary focus:border-primary" />
                        <select v-model="communicationFilterGravita"
                            class="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-primary focus:border-primary w-full sm:w-auto">
                            <option value="">Tutti i livelli di gravità</option>
                            <option value="alto rischio">Alto rischio</option>
                            <option value="medio rischio">Medio rischio</option>
                            <option value="basso rischio">Basso rischio</option>
                        </select>
                        <router-link :to="{ name: 'communication-edit', params: { id: 'new' } }"
                            class="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700 whitespace-nowrap">
                            <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/></svg>
                            Nuova comunicazione
                        </router-link>
                    </div>
                </div>

                <div v-if="communicationsLoading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div v-else-if="communications.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                    Nessuna comunicazione. Clicca "Nuova comunicazione" per crearne una.
                </div>
                <div v-else-if="filteredCommunications.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                    Nessun risultato con i filtri selezionati.
                </div>
                <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="comm in filteredCommunications" :key="comm.id || comm._id"
                        class="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 p-5 transition-all duration-300 hover:shadow-lg flex flex-col">
                        <!-- Livello 1: tag (metadati) -->
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shrink-0" :class="getCommImportanceBg(comm.importance)">
                                {{ getCommRischioLabel(comm.importance) }}
                            </span>
                            <span v-if="comm.isDraft"
                                class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                                <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"><path d="M128.1 0c-35.3 0-64 28.7-64 64l0 384c0 35.3 28.7 64 64 64l146.2 0 10.9-54.5c4.3-21.7 15-41.6 30.6-57.2l132.2-132.2 0-97.5c0-17-6.7-33.3-18.7-45.3L322.8 18.7C310.8 6.7 294.5 0 277.6 0L128.1 0zM389.6 176l-93.5 0c-13.3 0-24-10.7-24-24l0-93.5 117.5 117.5zM332.3 466.9l-11.9 59.6c-.2 .9-.3 1.9-.3 2.9 0 8 6.5 14.6 14.6 14.6 1 0 1.9-.1 2.9-.3l59.6-11.9c12.4-2.5 23.8-8.6 32.7-17.5l118.9-118.9-80-80-118.9 118.9c-8.9 8.9-15 20.3-17.5 32.7zm267.8-123c22.1-22.1 22.1-57.9 0-80s-57.9-22.1-80 0l-28.8 28.8 80 80 28.8-28.8z"/></svg>
                                Bozza
                            </span>
                        </div>
                        <!-- Livello 2: titolo (separato, in evidenza) -->
                        <h3 class="mt-3 mb-3 text-lg font-bold text-gray-900 line-clamp-2 leading-snug border-b border-gray-100 pb-3">
                            {{ comm.title }}
                        </h3>
                        <!-- Livello 3: categoria e data -->
                        <div class="text-xs text-gray-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-2">
                            <span class="inline-flex items-center gap-1">
                                <svg class="w-3.5 h-3.5 shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M214.7 .7c17.3 3.7 28.3 20.7 24.6 38l-19.1 89.3 126.5 0 22-102.7C372.4 8 389.4-3 406.7 .7s28.3 20.7 24.6 38L412.2 128 480 128c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-27.4 128 67.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38l19.1-89.3-126.5 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38L99.8 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 27.4-128-67.8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 22-102.7C180.4 8 197.4-3 214.7 .7zM206.4 192l-27.4 128 126.5 0 27.4-128-126.5 0z"/></svg>
                                {{ comm.categoria }}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{{ formatDate(comm.publication) }}</span>
                        </div>
                        <!-- Livello 4: anteprima testo -->
                        <p class="text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1 mb-4">{{ comm.short_text }}</p>
                        <!-- Livello 5: azioni -->
                        <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                            <div class="flex items-center gap-2">
                                <button v-if="comm.isDraft" type="button" @click="confirmPublishCommunication(comm)" title="Pubblica"
                                    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                                    <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor"><path d="M87.9 11.5c-11.3-6.9-26.1-3.2-33 8.1-24.8 41-39 89.1-39 140.4s14.2 99.4 39 140.4c6.9 11.3 21.6 15 33 8.1s15-21.6 8.1-33C75.7 241.9 64 202.3 64 160S75.7 78.1 96.1 44.4c6.9-11.3 3.2-26.1-8.1-33zm400.1 0c-11.3 6.9-15 21.6-8.1 33 20.4 33.7 32.1 73.3 32.1 115.6s-11.7 81.9-32.1 115.6c-6.9 11.3-3.2 26.1 8.1 33s26.1 3.2 33-8.1c24.8-41 39-89.1 39-140.4S545.8 60.6 521 19.6c-6.9-11.3-21.6-15-33-8.1zM320 215.4c19.1-11.1 32-31.7 32-55.4 0-35.3-28.7-64-64-64s-64 28.7-64 64c0 23.7 12.9 44.4 32 55.4L256 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-264.6zM180.2 91c7.2-11.2 3.9-26-7.2-33.2s-26-3.9-33.2 7.2c-17.6 27.4-27.8 60-27.8 95s10.2 67.6 27.8 95c7.2 11.2 22 14.4 33.2 7.2s14.4-22 7.2-33.2c-12.8-19.9-20.2-43.6-20.2-69s7.4-49.1 20.2-69zM436.2 65c-7.2-11.2-22-14.4-33.2-7.2s-14.4 22-7.2 33.2c12.8 19.9 20.2 43.6 20.2 69s-7.4 49.1-20.2 69c-7.2 11.2-3.9 26 7.2 33.2s26 3.9 33.2-7.2c17.6-27.4 27.8-60 27.8-95s-10.2-67.6-27.8-95z"/></svg>
                                    Pubblica
                                </button>
                            </div>
                            <div class="flex items-center gap-2">
                                <router-link :to="{ name: 'communication-edit', params: { id: comm.id || comm._id } }" title="Modifica"
                                    class="inline-flex p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                                </router-link>
                                <button type="button" @click="confirmDeleteCommunication(comm)" title="Elimina"
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="currentTab === 'articles'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Gestione articoli</h2>
                    <router-link :to="{ name: 'article-edit', params: { id: 'new' } }"
                        class="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/></svg>
                        Nuovo articolo
                    </router-link>
                </div>

                <div v-if="articlesLoading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div v-else-if="articles.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                    Nessun articolo. Clicca "Nuovo articolo" per crearne uno.
                </div>
                <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    <div v-for="article in articles" :key="article.id || article._id"
                        class="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 flex flex-col">
                        <div class="w-full aspect-video shrink-0 overflow-hidden flex items-center justify-center"
                            :style="article.img ? {} : { backgroundColor: '#dbeafe' }">
                            <img v-if="article.img"
                                :src="getArticleImageUrl(article.img)"
                                :alt="article.title"
                                class="w-full h-full object-cover"
                            />
                            <svg v-else class="w-16 h-16 text-blue-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                :viewBox="getArticlePlaceholderIcon(article).viewBox">
                                <path :d="getArticlePlaceholderIcon(article).path"/>
                            </svg>
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
                                <div class="inline-flex items-center gap-2 shrink-0">
                                    <span
                                        class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                                        :class="getArticleCategoryBadge(article.categoria)">
                                        <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M214.7 .7c17.3 3.7 28.3 20.7 24.6 38l-19.1 89.3 126.5 0 22-102.7C372.4 8 389.4-3 406.7 .7s28.3 20.7 24.6 38L412.2 128 480 128c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-27.4 128 67.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38l19.1-89.3-126.5 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38L99.8 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 27.4-128-67.8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 22-102.7C180.4 8 197.4-3 214.7 .7zM206.4 192l-27.4 128 126.5 0 27.4-128-126.5 0z"/></svg>
                                        {{ article.categoria }}
                                    </span>
                                    <span v-if="article.isDraft"
                                        class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                        <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"><path d="M128.1 0c-35.3 0-64 28.7-64 64l0 384c0 35.3 28.7 64 64 64l146.2 0 10.9-54.5c4.3-21.7 15-41.6 30.6-57.2l132.2-132.2 0-97.5c0-17-6.7-33.3-18.7-45.3L322.8 18.7C310.8 6.7 294.5 0 277.6 0L128.1 0zM389.6 176l-93.5 0c-13.3 0-24-10.7-24-24l0-93.5 117.5 117.5zM332.3 466.9l-11.9 59.6c-.2 .9-.3 1.9-.3 2.9 0 8 6.5 14.6 14.6 14.6 1 0 1.9-.1 2.9-.3l59.6-11.9c12.4-2.5 23.8-8.6 32.7-17.5l118.9-118.9-80-80-118.9 118.9c-8.9 8.9-15 20.3-17.5 32.7zm267.8-123c22.1-22.1 22.1-57.9 0-80s-57.9-22.1-80 0l-28.8 28.8 80 80 28.8-28.8z"/></svg>
                                        Bozza
                                    </span>
                                </div>
                                <span class="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0">
                                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    {{ formatDate(article.last_edit) }}
                                </span>
                            </div>
                            <h3 class="text-base font-bold text-gray-900 mb-2 line-clamp-2">{{ article.title }}</h3>
                            <p class="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1 mb-4">{{ article.short_text }}</p>
                            <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                                <div class="flex items-center gap-2">
                                    <button v-if="article.isDraft" type="button" @click="confirmPublishArticle(article)" title="Pubblica"
                                        class="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                                        <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor"><path d="M87.9 11.5c-11.3-6.9-26.1-3.2-33 8.1-24.8 41-39 89.1-39 140.4s14.2 99.4 39 140.4c6.9 11.3 21.6 15 33 8.1s15-21.6 8.1-33C75.7 241.9 64 202.3 64 160S75.7 78.1 96.1 44.4c6.9-11.3 3.2-26.1-8.1-33zm400.1 0c-11.3 6.9-15 21.6-8.1 33 20.4 33.7 32.1 73.3 32.1 115.6s-11.7 81.9-32.1 115.6c-6.9 11.3-3.2 26.1 8.1 33s26.1 3.2 33-8.1c24.8-41 39-89.1 39-140.4S545.8 60.6 521 19.6c-6.9-11.3-21.6-15-33-8.1zM320 215.4c19.1-11.1 32-31.7 32-55.4 0-35.3-28.7-64-64-64s-64 28.7-64 64c0 23.7 12.9 44.4 32 55.4L256 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-264.6zM180.2 91c7.2-11.2 3.9-26-7.2-33.2s-26-3.9-33.2 7.2c-17.6 27.4-27.8 60-27.8 95s10.2 67.6 27.8 95c7.2 11.2 22 14.4 33.2 7.2s14.4-22 7.2-33.2c-12.8-19.9-20.2-43.6-20.2-69s7.4-49.1 20.2-69zM436.2 65c-7.2-11.2-22-14.4-33.2-7.2s-14.4 22-7.2 33.2c12.8 19.9 20.2 43.6 20.2 69s-7.4 49.1-20.2 69c-7.2 11.2-3.9 26 7.2 33.2s26 3.9 33.2-7.2c17.6-27.4 27.8-60 27.8-95s-10.2-67.6-27.8-95z"/></svg>
                                        Pubblica
                                    </button>
                                </div>
                                <div class="flex items-center gap-2">
                                    <router-link :to="{ name: 'article-edit', params: { id: article.id || article._id } }" title="Modifica"
                                        class="inline-flex p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                                    </router-link>
                                    <button type="button" @click="confirmDeleteArticle(article)" title="Elimina"
                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <template v-if="editingArticleId && articleForm.currentImg">
                                <p class="text-xs text-gray-500 mb-1">Attuale:</p>
                                <img :src="getArticleImageUrl(articleForm.currentImg)" :alt="articleForm.title" class="mb-2 max-h-32 w-auto rounded-lg border border-gray-200 object-contain">
                            </template>
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

        <!-- Publish communication confirmation -->
        <Transition name="modal-fade">
            <div v-if="communicationToPublish"
                class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="communicationToPublish = null"></div>
                <div class="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Pubblica comunicazione</h3>
                    <p class="text-gray-600 mb-6">Pubblicare «{{ communicationToPublish.title }}»? La comunicazione sarà visibile agli utenti.</p>
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="communicationToPublish = null"
                            class="rounded-lg px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">Annulla</button>
                        <button type="button" @click="doPublishCommunication"
                            class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Pubblica</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Publish article confirmation -->
        <Transition name="modal-fade">
            <div v-if="articleToPublish"
                class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="articleToPublish = null"></div>
                <div class="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Pubblica articolo</h3>
                    <p class="text-gray-600 mb-6">Pubblicare «{{ articleToPublish.title }}»? L'articolo sarà visibile nella sezione guide.</p>
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="articleToPublish = null"
                            class="rounded-lg px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">Annulla</button>
                        <button type="button" @click="doPublishArticle"
                            class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Pubblica</button>
                    </div>
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
        <BaseModal 
            :isOpen="showErrorModal"
            title="Errore"
            :message="errorMessage"
            @close="showErrorModal = false"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue';
import api from '@/services/api';
import BaseModal from '@/components/BaseModal.vue';

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
const reportFilterCategoria = ref('');
const showReportDetailModal = ref(false);
const reportDetail = ref(null);
const reportPage = ref(1);
const reportPerPage = 10;
const showReplyModal = ref(false);
const reportForReply = ref(null);
const replyForm = reactive({ title: '', text: '' });
const showCreateOperatorModal = ref(false);
const newOperator = reactive({
    name: '',
    surname: '',
    email: '',
    role: 'reporter',
});

const showErrorModal = ref(false);
const errorMessage = ref('');

// Articles (editor)
const articlesLoading = ref(false);
const showArticleModal = ref(false);
const editingArticleId = ref(null);
const articleToDelete = ref(null);
const articleToPublish = ref(null);
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
const communicationsSearchQuery = ref('');
const communicationFilterGravita = ref('');
const showCommunicationModal = ref(false);
const editingCommunicationId = ref(null);
const communicationToDelete = ref(null);
const communicationToPublish = ref(null);
const communicationForm = reactive({
    title: '',
    text: '',
    short_text: '',
    categoria: '',
    importance: 'medio rischio',
    isDraft: true,
    notify: false,
});

// Communications: filtered by gravità and search
const filteredCommunications = computed(() => {
    let list = communications.value;
    const gravita = (communicationFilterGravita.value || '').trim().toLowerCase();
    if (gravita) {
        list = list.filter(comm => (comm.importance || '').toLowerCase() === gravita);
    }
    const q = (communicationsSearchQuery.value || '').trim().toLowerCase();
    if (!q) return list;
    return list.filter(comm => {
        const title = (comm.title || '').toLowerCase();
        const short = (comm.short_text || '').toLowerCase();
        const cat = (comm.categoria || '').toLowerCase();
        const imp = (comm.importance || '').toLowerCase();
        return title.includes(q) || short.includes(q) || cat.includes(q) || imp.includes(q);
    });
});

// Reports: all categories ever seen (merged from each fetch so dropdown always shows all options)
const allReportCategories = ref([]);
const reportCategories = computed(() => allReportCategories.value);
const reportTotalPages = computed(() => Math.max(1, Math.ceil(reports.value.length / reportPerPage)));
const paginatedReports = computed(() => {
    const start = (reportPage.value - 1) * reportPerPage;
    return reports.value.slice(start, start + reportPerPage);
});
const reportRangeStart = computed(() => reports.value.length === 0 ? 0 : (reportPage.value - 1) * reportPerPage + 1);
const reportRangeEnd = computed(() => Math.min(reportPage.value * reportPerPage, reports.value.length));
const reportPageNumbers = computed(() => {
    const n = reportTotalPages.value;
    return n <= 5 ? Array.from({ length: n }, (_, i) => i + 1) : [1, reportPage.value, n].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
});

const takeInCharge = async (report) => {
    if (report.status !== 'da elaborare') return;
    try {
        await api.patchReport(report.id || report._id);
        fetchReports();
    } catch (err) {
        alert('Errore: ' + (err.response?.data?.message || err.message));
    }
};

const openReportDetail = async (report) => {
    const id = report.id || report._id;
    reportDetail.value = { ...report, created_at: report.created_at || report.created };
    showReportDetailModal.value = true;
    try {
        const res = await api.getReport(id);
        reportDetail.value = res.data;
        if (!reportDetail.value.created_at) reportDetail.value.created_at = reportDetail.value.created;
    } catch {
        // keep list data if fetch fails
    }
};

const closeReportDetail = () => {
    showReportDetailModal.value = false;
    reportDetail.value = null;
};

const openReplyModal = (report) => {
    reportForReply.value = report;
    const nomeUtente = [report.author?.name, report.author?.surname].filter(Boolean).join(' ') || 'utente';
    const dataReport = formatDate(report.created_at || report.created);
    replyForm.title = `Risposta alla segnalazione di ${nomeUtente} del ${dataReport}`;
    replyForm.text = 'Gentile utente,\n\nIn riferimento alla tua segnalazione, ti comunichiamo quanto segue.\n\nCordiali saluti.';
    showReplyModal.value = true;
};

const closeReplyModal = () => {
    showReplyModal.value = false;
    reportForReply.value = null;
};

const submitReply = async () => {
    if (!reportForReply.value) return;
    const reportID = reportForReply.value.id || reportForReply.value._id;
    try {
        await api.createReportAnswer({
            reportID,
            title: replyForm.title.trim(),
            text: replyForm.text.trim(),
        });
        closeReplyModal();
        fetchReports();
    } catch (err) {
        alert('Errore: ' + (err.response?.data?.message || err.message));
    }
};


// --- API FETCH FUNCTIONS ---
const fetchReports = async () => {
    loading.value = true;
    try {
        const params = { sort: 'created', direction: 'desc' };
        if (reportFilterStatus.value) params.status = reportFilterStatus.value;
        if (reportFilterCategoria.value) params.categoria = reportFilterCategoria.value;
        let response;
        if (userRole.value === 'user') {
            response = await api.getMyReports();
        } else {
            response = await api.getReports(params);
        }

        reports.value = response.data.map(item => {
            const r = item.report;
            r.created_at = r.created;
            r.id = r.id || r._id;
            return r;
        });
        const newCats = new Set(reports.value.map(r => r.categoria).filter(Boolean));
        allReportCategories.value = [...new Set([...allReportCategories.value, ...newCats])].sort();
        reportPage.value = 1;
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
        const response = await api.getCommunicationsReporter({ sort: 'publication', direction: 'desc' });
        communications.value = response.data;
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

const openEditCommunication = async (comm) => {
    const id = comm.id || comm._id;
    editingCommunicationId.value = id;
    showCommunicationModal.value = true;
    communicationForm.title = comm.title || '';
    communicationForm.text = '';
    communicationForm.short_text = comm.short_text || '';
    communicationForm.categoria = comm.categoria || '';
    communicationForm.importance = comm.importance || 'medio rischio';
    communicationForm.isDraft = !!comm.isDraft;
    communicationForm.notify = false;
    try {
        const response = await api.getCommunicationById(id);
        const full = response.data;
        communicationForm.title = full.title || '';
        communicationForm.text = full.text || '';
        communicationForm.short_text = full.short_text || '';
        communicationForm.categoria = full.categoria || '';
        communicationForm.importance = full.importance || 'medio rischio';
        communicationForm.isDraft = !!full.isDraft;
    } catch (err) {
        console.error('Error loading communication', err);
        alert('Impossibile caricare la comunicazione: ' + (err.response?.data?.message || err.message));
        closeCommunicationModal();
    }
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

const confirmPublishCommunication = (comm) => {
    communicationToPublish.value = comm;
};

const doPublishCommunication = async () => {
    if (!communicationToPublish.value) return;
    const id = communicationToPublish.value.id || communicationToPublish.value._id;
    try {
        await api.publishCommunication(id, true);
        communicationToPublish.value = null;
        fetchCommunications();
    } catch (err) {
        alert('Errore pubblicazione: ' + (err.response?.data?.message || err.message));
    }
};

const fetchArticles = async () => {
    articlesLoading.value = true;
    try {
        const response = await api.getArticlesEditor();
        articles.value = response.data;
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

const openEditArticle = async (article) => {
    const id = article.id || article._id;
    editingArticleId.value = id;
    articleForm.title = article.title || '';
    articleForm.text = '';
    articleForm.short_text = article.short_text || '';
    articleForm.categoria = article.categoria || '';
    articleForm.img = null;
    articleForm.currentImg = article.img || '';
    articleForm.isDraft = !!article.isDraft;
    loadArticleCategories();
    showArticleModal.value = true;
    try {
        const response = await api.getArticle(id);
        const full = response.data;
        articleForm.title = full.title || '';
        articleForm.text = full.text || '';
        articleForm.short_text = full.short_text || '';
        articleForm.categoria = full.categoria || '';
        articleForm.currentImg = full.img || '';
        articleForm.isDraft = !!full.isDraft;
    } catch (err) {
        console.error('Error loading article', err);
        alert('Impossibile caricare l\'articolo: ' + (err.response?.data?.message || err.message));
        closeArticleModal();
    }
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

const confirmPublishArticle = (article) => {
    articleToPublish.value = article;
};

const doPublishArticle = async () => {
    if (!articleToPublish.value) return;
    const id = articleToPublish.value.id || articleToPublish.value._id;
    try {
        await api.publishArticle(id);
        articleToPublish.value = null;
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
        errorMessage.value = "Impossibile aggiornare lo stato dell'operatore: " + (err.response?.data?.message || err.message);
        showErrorModal.value = true;
        // Revert switch visually as explicit fetch might be overkill or delayed
        op.isActive = !op.isActive; 
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

const getCommRischioLabel = (importance) => {
    if (!importance) return 'Rischio: Info';
    const i = (importance || '').toLowerCase();
    if (i === 'alto rischio') return 'Rischio: Alto';
    if (i === 'medio rischio') return 'Rischio: Medio';
    if (i === 'basso rischio') return 'Rischio: Basso';
    return 'Rischio: ' + (importance + '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
const getCommImportanceBg = (importance) => {
    switch ((importance || '').toLowerCase()) {
        case 'alto rischio': return 'bg-red-500';
        case 'medio rischio': return 'bg-yellow-500';
        default: return 'bg-blue-500';
    }
};

const getArticleImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    const base = import.meta.env.VITE_API_HOST || '';
    return `${base}/uploads/images/${img}`;
};

// Sfondo unico blu leggero (in tinta con il sito) e pool di icone per placeholder articoli senza immagine
const ARTICLE_PLACEHOLDER_ICONS = [
    { viewBox: '0 0 512 512', path: 'M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0 512 114.6 512 256l0 32c0 53-43 96-96 96-29.3 0-55.6-13.2-73.2-33.9-22.8 21-53.3 33.9-86.8 33.9-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1 5.7-5 13.1-8.1 21.3-8.1 17.7 0 32 14.3 32 32l0 112c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z' },
    { viewBox: '0 0 448 512', path: 'M64 160l64 0 0-64-64 0 0 64zM0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48L0 80zM64 416l64 0 0-64-64 0 0 64zM0 336c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96zM320 96l0 64 64 0 0-64-64 0zM304 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zM288 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm96 32c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm32-96a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-32 32a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z' },
    { viewBox: '0 0 512 512', path: 'M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z' },
    { viewBox: '0 0 512 512', path: 'M48 256c0-114.9 93.1-208 208-208 63.1 0 119.6 28.1 157.8 72.5 8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0 114.6 0 0 114.6 0 256l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6-15.2 5-18.7 23.7-8.3 35.9 7.1 8.3 18.8 10.8 29.4 7.9 10.6-2.9 21.8-4.4 33.4-4.4 70.7 0 128 57.3 128 128l0 24.9c0 25.2-1.5 50.3-4.4 75.3-1.7 14.6 9.4 27.8 24.2 27.8 11.8 0 21.9-8.6 23.3-20.3 3.3-27.4 5-55 5-82.7l0-24.9c0-97.2-78.8-176-176-176zM150.7 148.7c-9.1-10.6-25.3-11.4-33.9-.4-23.1 29.8-36.8 67.1-36.8 107.7l0 24.9c0 24.2-2.6 48.4-7.8 71.9-3.4 15.6 7.9 31.1 23.9 31.1 10.5 0 19.9-7 22.2-17.3 6.4-28.1 9.7-56.8 9.7-85.8l0-24.9c0-27.2 8.5-52.4 22.9-73.1 7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96l0 24.9c0 35.9-4.6 71.5-13.8 106.1-3.8 14.3 6.7 29 21.5 29 9.5 0 17.9-6.2 20.4-15.4 10.5-39 15.9-79.2 15.9-119.7l0-24.9c0-28.7 23.3-52 52-52s52 23.3 52 52l0 24.9c0 36.3-3.5 72.4-10.4 107.9-2.7 13.9 7.7 27.2 21.8 27.2 10.2 0 19-7 21-17 7.7-38.8 11.6-78.3 11.6-118.1l0-24.9c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3C267.9 411.9 280 346.7 280 280.9l0-24.9z' },
    { viewBox: '0 0 384 512', path: 'M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z' },
    { viewBox: '0 0 576 512', path: 'M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z' },
    { viewBox: '0 0 512 512', path: 'M256.2 48c114.8 .1 207.8 93.2 207.8 208 0 22.1-3.4 43.4-9.8 63.4-2 .4-4.1 .6-6.2 .6l-2.7 0c-8.5 0-16.6-3.4-22.6-9.4l-29.3-29.3c-6-6-9.4-14.1-9.4-22.6l0-50.7c0-8.8 7.2-16 16-16s16-7.2 16-16-7.2-16-16-16l-24 0c-13.3 0-24 10.7-24 24s-10.7 24-24 24l-56 0c-8.8 0-16 7.2-16 16s-7.2 16-16 16l-25.4 0c-12.5 0-22.6-10.1-22.6-22.6 0-6 2.4-11.8 6.6-16l70.1-70.1c2.1-2.1 3.3-5 3.3-8 0-6.2-5.1-11.3-11.3-11.3l-14.1 0c-12.5 0-22.6-10.1-22.6-22.6 0-6 2.4-11.8 6.6-16l23.1-23.1c.8-.8 1.6-1.5 2.5-2.2zM438.4 356.1c-32.8 59.6-93.9 101.4-165.2 107.2-.7-2.3-1.1-4.8-1.1-7.3 0-13.3-10.7-24-24-24l-26.7 0c-8.5 0-16.6-3.4-22.6-9.4l-29.3-29.3c-6-6-9.4-14.1-9.4-22.6l0-66.7c0-17.7 14.3-32 32-32l98.7 0c8.5 0 16.6 3.4 22.6 9.4l29.3 29.3c6 6 14.1 9.4 22.6 9.4l5.5 0c8.5 0 16.6 3.4 22.6 9.4l16 16c4.2 4.2 10 6.6 16 6.6 4.8 0 9.3 1.5 13 4.1zM256 512l26.2-1.3c-8.6 .9-17.3 1.3-26.2 1.3zm26.2-1.3C411.3 497.6 512 388.6 512 256 512 114.6 397.4 0 256 0l0 0C114.6 0 0 114.6 0 256 0 383.5 93.2 489.3 215.3 508.8 228.5 510.9 242.1 512 256 512zM187.3 123.3l-32 32c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l32-32c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z' },
    { viewBox: '0 0 512 512', path: 'M253.4 2.9C249.2 1 244.7 0 240 0s-9.2 1-13.4 2.9L38.3 82.8c-22 9.3-38.4 31-38.3 57.2 .5 99.2 41.3 280.7 213.6 363.2 16.7 8 36.1 8 52.8 0 172.4-82.5 213.2-264 213.6-363.2 .1-26.2-16.3-47.9-38.3-57.2L253.4 2.9zM240 128c13.3 0 24 10.7 24 24 0 22.9 27.7 34.4 43.9 18.2 9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9c-16.2 16.2-4.7 43.9 18.2 43.9 13.3 0 24 10.7 24 24s-10.7 24-24 24c-22.9 0-34.4 27.7-18.2 43.9 9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0c-16.2-16.2-43.9-4.7-43.9 18.2 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-22.9-27.7-34.4-43.9-18.2-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9c16.2-16.2 4.7-43.9-18.2-43.9-13.3 0-24-10.7-24-24s10.7-24 24-24c22.9 0 34.4-27.7 18.2-43.9-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0c16.2 16.2 43.9 4.7 43.9-18.2 0-13.3 10.7-24 24-24zM208 264a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm88 40a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z' }
];

const getArticlePlaceholderIcon = (article) => {
    const id = String(article?.id || article?._id || article?.title || '');
    let n = 0;
    for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
    return ARTICLE_PLACEHOLDER_ICONS[n % ARTICLE_PLACEHOLDER_ICONS.length];
};

const getArticleCategoryBadge = (cat) => {
    if (!cat) return 'bg-gray-100 text-gray-600';
    const c = cat.toLowerCase();
    if (c.includes('phishing')) return 'bg-blue-100 text-blue-700';
    if (c.includes('smishing')) return 'bg-purple-100 text-purple-700';
    if (c.includes('quishing') || c.includes('qr')) return 'bg-amber-100 text-amber-700';
    if (c.includes('sicurezza') || c.includes('password')) return 'bg-gray-200 text-gray-700';
    if (c.includes('social')) return 'bg-pink-100 text-pink-700';
    if (c.includes('link')) return 'bg-red-100 text-red-600';
    return 'bg-blue-100 text-blue-700';
};

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