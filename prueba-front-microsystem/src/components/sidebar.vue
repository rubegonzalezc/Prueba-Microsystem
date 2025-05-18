<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    :elevation="8"
    class="sidebar-container"
    theme="light"
    width="280"
    height="100vh" 
  >
    <!-- Cabecera con logo -->
    <div class="sidebar-header pt-4 pb-2 px-4">
      <div class="d-flex justify-center">
        <div class="logo-container">
          <v-img 
            :src="logoUrl"
            width="200"
            class="logo-image"
          />
        </div>
        
        <!-- Se eliminó la sección del texto del logo -->
      </div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- Perfil de usuario con diseño mejorado -->
    <div class="user-profile pa-4">
      <div class="d-flex align-center">
        <v-avatar class="gradient-avatar elevation-3">
          <span class="text-h6 font-weight-medium white--text">
            {{ getUserInitials }}
          </span>
          
          <!-- Indicador de estado -->
          <div class="status-indicator"></div>
        </v-avatar>
        
        <transition name="fade">
          <div v-if="!rail" class="ml-3 user-info">
            <div class="text-subtitle-2 font-weight-medium user-name">{{ currentUser?.nombres || 'Usuario' }}</div>
            <div class="text-caption text-medium-emphasis user-role">{{ currentUser?.username || 'Sin acceso' }}</div>
          </div>
        </transition>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Secciones del menú -->
    <div class="px-2 mt-2 menu-section text-overline" v-if="!rail">NAVEGACIÓN</div>
    
    <!-- Menú de navegación con efectos mejorados -->
    <v-list class="menu-list px-2">
      <v-list-item
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :value="item.path"
        :active="isActive(item.path)"
        active-color="primary"
        class="menu-item my-1"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon
            :icon="item.icon"
            :class="{'menu-icon': true, 'menu-icon-active': isActive(item.path)}"
          ></v-icon>
        </template>
        
        <v-list-item-title v-if="!rail" class="menu-title">
          {{ item.title }}
        </v-list-item-title>
        
        <template v-slot:append v-if="!rail && item.badge">
          <v-badge
            :content="item.badge"
            color="info"
            floating
            dot
          ></v-badge>
        </template>
      </v-list-item>
    </v-list>

    <!-- Footer con botón de cerrar sesión -->
    <template v-slot:append>
      <div class="sidebar-footer pa-3">
        <v-divider class="mb-3"></v-divider>
        
        <v-btn
          variant="elevated"
          color="error"
          block
          @click="logout"
          :class="{'logout-btn': true, 'px-2': rail}"
          rounded="lg"
        >
          <v-icon 
            icon="mdi-logout" 
            :class="{'mr-2': !rail}"
          ></v-icon>
          <span v-if="!rail">Cerrar Sesión</span>
        </v-btn>
        
        <div class="text-caption text-center mt-3 version-info" v-if="!rail">
          MicroeDoc v1.0.0
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/services/auth';

// Estado de navegación
const drawer = ref(true);
const rail = ref(false); // Ya está en false, lo que es correcto

// Router
const router = useRouter();
const route = useRoute();

// Usuario currentUser
const currentUser = ref(null);

// URL del logo
const logoUrl = "https://microedoc.com/wp-content/uploads/2022/09/1.-Logo-MicroeDoc-color-2.png";

// Elementos del menú con badges
const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    path: '/dashboard'
  },
  {
    title: 'Recibos de Pago',
    icon: 'mdi-file-document-outline',
    path: '/pagos',
  },
];

// Computar iniciales del usuario
const getUserInitials = computed(() => {
  if (!currentUser.value) return '?';
  
  const nombres = currentUser.value.nombres || '';
  const apellido = currentUser.value.primer_apellido || '';
  
  return (nombres.charAt(0) + (apellido.charAt(0) || '')).toUpperCase();
});

// Verificar si una ruta está activa
function isActive(path) {
  return route.path.startsWith(path);
}

// Cerrar sesión con confirmación
async function logout() {
  try {
    // Opcional: mostrar diálogo de confirmación
    await authService.logout();
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Cargar datos de usuario al montar
onMounted(() => {
  currentUser.value = authService.getCurrentUser();
});
</script>

<style scoped>
/* Estilos generales del sidebar con altura fija */
.sidebar-container {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  border-right: 1px solid rgba(0,0,0,0.05);
  min-width: 280px; /* Ancho mínimo para evitar contenido cortado */
  height: 100vh !important; /* Forzar altura completa */
  position: fixed !important; /* Fijar posición */
  top: 0;
  left: 0;
  overflow-y: auto; /* Permitir scroll dentro del sidebar si es necesario */
  z-index: 100; /* Asegurar que esté por encima del contenido */
  max-height: 100vh;
  min-height: 100vh;
}

/* Para ajustar el contenido principal y que no quede debajo del sidebar */
:deep(.v-main) {
  padding-left: 280px !important; /* Debe ser igual al ancho del sidebar */
}

/* Cuando el sidebar está en modo minimizado (rail) */
:deep(.v-navigation-drawer--rail + .v-main) {
  padding-left: 56px !important; /* Ancho del sidebar minimizado */
}

/* Estilos para el logo */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  transition: all 0.3s ease;
  transform-origin: center;
}

.logo-small {
  transform: scale(0.9);
}

.app-title {
  letter-spacing: 0.5px;
  overflow: hidden;
}

/* Estilos para el perfil de usuario */
.user-profile {
  transition: all 0.3s ease;
  position: relative;
}

.gradient-avatar {
  background: linear-gradient(135deg, #1976D2, #42A5F5);
  border: 2px solid white;
  overflow: visible;
  position: relative;
}

.user-name {
  font-weight: 600;
  color: #37474F;
}

.user-role {
  color: #78909C;
  font-size: 0.75rem;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #4CAF50;
  border-radius: 50%;
  border: 2px solid white;
}

/* Estilos para el menú */
.menu-section {
  color: #78909C;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  padding-left: 16px;
  margin-bottom: 8px;
}

.menu-list {
  padding-top: 0;
}

.menu-item {
  margin-bottom: 4px;
  position: relative;
  overflow: visible;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(25, 118, 210, 0.04);
  transform: translateX(4px);
}

.v-list-item--active {
  background: linear-gradient(90deg, rgba(25, 118, 210, 0.08), rgba(25, 118, 210, 0.12));
  border-left: 3px solid #1976D2;
  font-weight: 600;
}

.menu-icon {
  color: #607D8B;
  transition: all 0.3s ease;
}

.menu-icon-active {
  color: #1976D2;
  transform: scale(1.1);
}

.menu-title {
  font-weight: 500;
  color: #37474F;
}

/* Estilos para el botón de cerrar sesión */
.sidebar-footer {
  margin-top: auto;
}

.logout-btn {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: 500;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.version-info {
  color: #90A4AE;
  opacity: 0.7;
}

/* Animación de transición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Añadir estos estilos para manejar textos largos */
.menu-title, .user-name, .user-role, .app-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.v-list-item__content {
  overflow: hidden;
}

/* Asegurarse de que el contenido del elemento de lista se ajuste correctamente */
.v-list-item {
  min-height: 44px;
}
</style>