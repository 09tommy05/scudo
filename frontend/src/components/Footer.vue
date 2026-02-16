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
            Servizio Comunale Unico per la Difesa Online. Piattaforma ufficiale per la sicurezza digitale dei cittadini, con guida pratica, segnalazione di minacce e comunicazioni certificate.
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
              <router-link to="/communications"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Comunicazioni
              </router-link>
            </li>
            <li>
              <router-link to="/report/create"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Segnala minaccia
              </router-link>
            </li>
            <li>
              <router-link to="/login/operator"
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
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Contatti</h4>
          <ul class="space-y-2.5">
            <li>
              <a href="/report/create"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Segnala
              </a>
            </li>
            <li>
              <a href="mailto:scudo@comune.trento.it"
                class="text-sm text-blue-100 hover:text-white transition-colors">
                Contattaci
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider + Copyright -->
      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-blue-200">
          &copy; {{ new Date().getFullYear() }} SCUDO &middot; Tutti i diritti riservati.
        </p>
      </div>
    </div>
  </footer>
</template>
