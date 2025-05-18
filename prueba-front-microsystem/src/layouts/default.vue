<template>
  <v-app>
    <!-- El sidebar se mantiene fuera del router-view -->
    <Sidebar v-if="shouldShowSidebar" />

    <v-main>
      <v-container fluid class="pa-0">
        <!-- Solo cambia el contenido interno -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { authService } from '@/services/auth';
import Sidebar from '@/components/sidebar.vue';

// Verificar autenticación
const isAuthenticated = computed(() => {
  return authService.isAuthenticated();
});

// Determinar si debemos mostrar el sidebar
const route = useRoute();
const shouldShowSidebar = computed(() => {
  // Si no está autenticado, no mostrar el sidebar
  if (!isAuthenticated.value) return false;
  
  // No mostrar en login ni register
  if (route.path.includes('/login') || route.path.includes('/register')) {
    return false;
  }
  
  // Mostrar en todas las demás rutas autenticadas
  return true;
});
</script>

<style>
/* Estilos globales para el layout */
.v-main {
  transition: padding-left 0.3s ease;
}

@media (min-width: 960px) {
  .v-main {
    padding-left: 280px !important; /* Actualizado al ancho completo del sidebar */
  }
}

.v-application {
  background-color: #f5f7fa !important;
}
</style>