<template>
  <div>

    <!-- HERO -->
    <section class="relative bg-primary overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5"></div>
        <div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5"></div>
      </div>

      <div class="relative z-10 container mx-auto px-4 lg:px-8 pt-16 pb-32 md:pt-20 md:pb-40 text-center">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider rounded-full bg-green-500/20 text-green-300 border border-green-400/20 backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Supporto attivo H24
        </span>

        <h1 class="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight mb-5 max-w-3xl mx-auto">
          Come possiamo aiutarti oggi?
        </h1>

        <p class="text-base md:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed mb-10">
          Seleziona l'argomento per ricevere assistenza immediata o cerca una soluzione specifica.
        </p>

        <!-- Search -->
        <div class="max-w-2xl mx-auto">
          <div class="flex gap-2 bg-white rounded-2xl p-2 shadow-xl">
            <div class="relative flex-1">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                @keyup.enter="goToSearch"
                type="text"
                placeholder="Cerca un problema (es. 'furto password', 'truffa INPS')..."
                class="w-full pl-12 pr-4 py-3 text-sm text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <button @click="goToSearch" class="px-6 py-3 text-sm font-semibold text-white rounded-xl bg-primary hover:bg-primary-dark transition-colors whitespace-nowrap">
              Cerca
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORY CARDS -->
    <section class="relative z-20 -mt-16">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">

          <component
            v-for="cat in quickCategories" :key="cat.label"
            :is="cat.route ? 'router-link' : 'button'"
            :to="cat.route || undefined"
            @click="!cat.route && searchByCategory(cat.searchTerm)"
            class="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group no-underline">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-xl" :class="cat.bg">
              <component :is="cat.iconComponent" class="w-5 h-5" :class="cat.iconColor" />
            </div>
            <h3 class="font-bold text-gray-900 text-sm md:text-base mb-0.5 group-hover:text-primary transition-colors">{{ cat.label }}</h3>
            <p class="text-xs text-gray-400 leading-relaxed">{{ cat.desc }}</p>
          </component>

        </div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <section class="container mx-auto px-4 lg:px-8 py-12 md:py-16" id="guide">
      <div class="grid lg:grid-cols-3 gap-10">

        <!-- LEFT: Guide in Primo Piano -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Guide in primo piano</h2>
            <router-link to="/" class="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1 group whitespace-nowrap">
              Vedi tutte le guide
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>

          <!-- Loading -->
          <div v-if="loadingArticles" class="grid sm:grid-cols-2 gap-5">
            <div v-for="n in 4" :key="n" class="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div class="flex gap-2 mb-4"><div class="h-5 w-20 bg-gray-200 rounded-full"></div><div class="h-4 w-16 bg-gray-100 rounded"></div></div>
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="space-y-2 mb-5"><div class="h-3 bg-gray-100 rounded w-full"></div><div class="h-3 bg-gray-100 rounded w-2/3"></div></div>
              <div class="h-3 bg-gray-100 rounded w-24"></div>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="articlesError" class="text-center py-12 text-red-600 bg-red-50 rounded-2xl">
            <svg class="h-10 w-10 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="font-medium">{{ articlesError }}</p>
          </div>

          <!-- Articles grid -->
          <div v-else class="grid sm:grid-cols-2 gap-5">
            <div v-for="article in featuredArticles" :key="article._id || article.id"
              class="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 p-5 transition-all duration-300 hover:shadow-lg group flex flex-col">

              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" :class="getCategoryBadge(article.categoria)">
                  {{ article.categoria }}
                </span>
                <span class="flex items-center gap-1 text-[11px] text-gray-400">
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ estimateReadTime(article.text || article.short_text) }} min lettura
                </span>
              </div>

              <h3 class="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">{{ article.title }}</h3>
              <p class="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-1">{{ article.short_text }}</p>

              <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <span class="flex items-center gap-1 text-xs text-gray-400">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ estimateReadTime(article.text || article.short_text) }} min lettura
                </span>
                <router-link
                  :to="{ name: 'article-detail', params: { id: article._id || article.id } }"
                  class="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1">
                  Leggi ora
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-if="!loadingArticles && !articlesError && featuredArticles.length === 0" class="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
            <p class="font-medium">Nessuna guida disponibile al momento.</p>
          </div>
        </div>

        <!-- RIGHT: Communications + Servizi Rapidi -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-8">

            <!-- Communications -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                  </svg>
                  Comunicazioni ufficiali
                </h2>
                <span v-if="latestCommunications.length > 0" class="inline-flex items-center gap-1.5">
                  <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-red-500">Live</span>
                </span>
              </div>

              <!-- Loading -->
              <div v-if="loadingComms" class="space-y-3">
                <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div class="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-100 rounded w-full"></div>
                </div>
              </div>

              <!-- Error -->
              <div v-else-if="commsError" class="text-sm text-red-500 bg-red-50 rounded-xl p-4">{{ commsError }}</div>

              <!-- List -->
              <div v-else class="space-y-3">
                <router-link
                  v-for="comm in latestCommunications"
                  :key="comm._id || comm.id"
                  :to="{ name: 'communication-detail', params: { id: comm._id || comm.id } }"
                  class="block bg-white rounded-xl border border-gray-100 hover:border-primary/20 p-4 transition-all duration-200 hover:shadow-md group">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white" :class="getImportanceBg(comm.importance)">
                      {{ getImportanceLabel(comm.importance) }}
                    </span>
                    <span class="text-[11px] text-gray-400">{{ formatRelativeDate(comm.publication) }}</span>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 line-clamp-2">{{ comm.title }}</h4>
                  <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ comm.short_text }}</p>
                </router-link>

                <div v-if="latestCommunications.length === 0" class="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl">
                  Nessuna comunicazione recente.
                </div>
              </div>

              <router-link to="/communications" class="block text-center mt-5 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors py-3 bg-primary-light rounded-xl hover:bg-blue-100">
                Vedi tutte le comunicazioni &rarr;
              </router-link>
            </div>

            <!-- Servizi Rapidi -->
            <div class="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 class="text-sm font-bold text-gray-900 mb-4">Servizi rapidi</h3>
              <div class="space-y-2">
                <router-link to="/report/create" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Segnala un incidente</span>
                </router-link>
                <a href="mailto:scudo@comune.trento.it" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Contatta supporto</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

// State
const articles = ref([]);
const loadingArticles = ref(true);
const articlesError = ref(null);
const searchQuery = ref('');
const communications = ref([]);
const loadingComms = ref(true);
const commsError = ref(null);

// SVG icon components for category cards
const IconEmail = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]) };
const IconSms = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })]) };
const IconLink = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' })]) };
const IconQr = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' })]) };
const IconSocial = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' })]) };
const IconPhone = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })]) };

const quickCategories = [
  { label: 'Email sospetta',  desc: 'Ho ricevuto una mail strana',       searchTerm: 'email',     bg: 'bg-blue-50',   iconComponent: IconEmail,  iconColor: 'text-blue-600', route: '/guide/email-sospetta' },
  { label: 'SMS / messaggi',  desc: 'Ho ricevuto un SMS di phishing',    searchTerm: 'sms',       bg: 'bg-purple-50', iconComponent: IconSms,    iconColor: 'text-purple-600', route: '/guide/sms-sospetto' },
  { label: 'Link sospetto',   desc: 'Non so se cliccare un link',        searchTerm: 'link',      bg: 'bg-red-50',    iconComponent: IconLink,   iconColor: 'text-red-500', route: '/guide/link-sospetto' },
  { label: 'QR code',         desc: 'Ho scannerizzato un codice',        searchTerm: 'qr',        bg: 'bg-green-50',  iconComponent: IconQr,     iconColor: 'text-green-600', route: '/guide/qr-sospetto' },
  { label: 'Social media',    desc: 'Profilo rubato o clonato',          searchTerm: 'social',    bg: 'bg-pink-50',   iconComponent: IconSocial, iconColor: 'text-pink-600', route: '/guide/social-sospetto' },
  { label: 'Chiamate',        desc: 'Telefonate truffa o mute',          searchTerm: 'chiamate',  bg: 'bg-cyan-50',   iconComponent: IconPhone,  iconColor: 'text-cyan-600', route: '/guide/chiamate-sospette' },
];

// Computed
const featuredArticles = computed(() => articles.value.slice(0, 4));

const latestCommunications = computed(() =>
  [...communications.value]
    .sort((a, b) => new Date(b.publication) - new Date(a.publication))
    .slice(0, 3)
);

// Fetchers
const fetchArticles = async () => {
  loadingArticles.value = true;
  articlesError.value = null;
  try {
    const res = await api.getArticles();
    articles.value = res.data;
  } catch {
    articlesError.value = 'Impossibile caricare le guide. Riprova più tardi.';
  } finally {
    loadingArticles.value = false;
  }
};

const fetchCommunications = async () => {
  loadingComms.value = true;
  commsError.value = null;
  try {
    const res = await api.getCommunications();
    communications.value = res.data;
  } catch {
    commsError.value = 'Impossibile caricare le comunicazioni.';
  } finally {
    loadingComms.value = false;
  }
};

// Helpers
const goToSearch = () => {
  if (searchQuery.value) {
    router.push({ name: 'home', query: { q: searchQuery.value } });
  }
  document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
};

const searchByCategory = (term) => {
  searchQuery.value = term;
  document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
};

const getCategoryBadge = (cat) => {
  if (!cat) return 'bg-gray-100 text-gray-600';
  const c = cat.toLowerCase();
  if (c.includes('phishing'))                   return 'bg-blue-100 text-blue-700';
  if (c.includes('smishing'))                   return 'bg-purple-100 text-purple-700';
  if (c.includes('quishing') || c.includes('qr')) return 'bg-amber-100 text-amber-700';
  if (c.includes('sicurezza') || c.includes('password')) return 'bg-gray-200 text-gray-700';
  if (c.includes('social'))                     return 'bg-pink-100 text-pink-700';
  if (c.includes('link'))                       return 'bg-red-100 text-red-600';
  return 'bg-blue-100 text-blue-700';
};

const getImportanceBg = (imp) => {
  switch (imp?.toLowerCase()) {
    case 'alto rischio':  return 'bg-red-500';
    case 'medio rischio': return 'bg-amber-500';
    default:              return 'bg-blue-500';
  }
};

const getImportanceLabel = (imp) => {
  switch (imp?.toLowerCase()) {
    case 'alto rischio':  return 'ALTA PRIORITÀ';
    case 'medio rischio': return 'ATTENZIONE';
    default:              return 'INFO';
  }
};

const formatRelativeDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const now  = new Date();
  const days = Math.floor((now - date) / 86400000);
  if (days === 0) return 'Oggi, ' + date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Ieri, '  + date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  if (days < 7)   return days + ' giorni fa';
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
};

const estimateReadTime = (txt) => {
  if (!txt) return 3;
  return Math.max(1, Math.ceil(txt.split(/\s+/).length / 200));
};

// Init
onMounted(() => {
  fetchArticles();
  fetchCommunications();
});
</script>
