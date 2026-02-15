<template>
  <footer class="bg-primary-dark text-white mt-auto">
    <div class="container mx-auto px-4 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Branding -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/logo-white.svg" alt="SCUDO Logo" class="h-8 w-8" />
            <span class="text-xl font-bold tracking-tight">SCUDO</span>
          </div>
          <p class="text-blue-200 text-sm leading-relaxed">
            Sistema di difesa cibernetica e supporto ai cittadini del Comune di Trento.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Navigazione</h4>
          <ul class="space-y-2.5">
            <li>
              <router-link to="/"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Guida alla sicurezza
              </router-link>
            </li>
            <li>
              <router-link to="/report/create"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Segnala minaccia
              </router-link>
            </li>
            <li>
              <router-link to="/login"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Area operatori
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Institutional links -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Link istituzionali</h4>
          <ul class="space-y-2.5">
            <li>
              <a href="https://www.comune.trento.it" target="_blank" rel="noopener noreferrer"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Comune di Trento
              </a>
            </li>
            <li>
              <a href="https://www.commissariatodips.it" target="_blank" rel="noopener noreferrer"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Polizia Postale
              </a>
            </li>
            <li>
              <a href="https://www.agid.gov.it" target="_blank" rel="noopener noreferrer"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                AgID
              </a>
            </li>
            <li>
              <a href="https://www.cert-pa.it" target="_blank" rel="noopener noreferrer"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Cert-PA
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact & Privacy -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Contatti &amp; Privacy</h4>
          <ul class="space-y-2.5">
            <li>
              <a href="mailto:scudo@comune.trento.it"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Contattaci
              </a>
            </li>
            <li>
              <a href="#"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="#"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Note legali
              </a>
            </li>
            <li>
              <a href="#"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Accessibilità
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider + Copyright -->
      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-blue-200">
          &copy; {{ new Date().getFullYear() }} Comune di Trento &middot; Tutti i diritti riservati.
        </p>
        <div class="flex items-center gap-3">
          <!-- Facebook -->
          <a href="#" class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
            <svg class="h-4 w-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <!-- Share -->
          <a href="#" class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Condividi">
            <svg class="h-4 w-4 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
