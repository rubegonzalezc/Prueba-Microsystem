<template>
  <v-container fluid class="dashboard-container pa-0">
    <!-- Header del Dashboard -->
    <div class="dashboard-header px-6 py-8">
      <div class="d-flex flex-wrap align-center">
        <div>
          <h1 class="text-h3 font-weight-bold mb-1">Bienvenido, {{ currentUser?.nombres }}</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            {{ formatearFecha(new Date()) }} · Vista general de su cuenta
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="elevation-1"
          prepend-icon="mdi-file-document-outline"
          to="/pagos"
        >
          Ver todos los recibos
        </v-btn>
      </div>
    </div>

    <v-container class="py-8">
      <!-- Tarjetas informativas con estadísticas clave -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="stat-card h-100" elevation="3" rounded="lg">
            <v-card-item class="pb-0">
              <div class="stat-icon-wrapper mb-2">
                <v-icon size="32" color="white" icon="mdi-file-document-multiple"></v-icon>
              </div>
              <v-card-subtitle class="text-caption pb-0 pt-2">RECIBOS TOTALES</v-card-subtitle>
              <v-card-title class="text-h3 font-weight-bold pt-1">{{ stats.totalRecibos }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <div class="stat-trend positive">
                <v-icon size="small" color="success">mdi-arrow-up</v-icon>
                <span class="text-caption">Últimos 30 días</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card class="stat-card h-100" elevation="3" color="#f5fbff" rounded="lg">
            <v-card-item class="pb-0">
              <div class="stat-icon-wrapper mb-2 bg-success">
                <v-icon size="32" color="white" icon="mdi-calendar-check"></v-icon>
              </div>
              <v-card-subtitle class="text-caption pb-0 pt-2">ÚLTIMO RECIBO</v-card-subtitle>
              <v-card-title class="text-h5 font-weight-bold pt-1">{{ stats.lastReciboDate }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex align-center">
                <v-icon size="small" color="grey">mdi-information-outline</v-icon>
                <span class="text-caption text-medium-emphasis ms-1">Procesado correctamente</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card class="stat-card h-100" elevation="3" color="#f9f5ff" rounded="lg">
            <v-card-item class="pb-0">
              <div class="stat-icon-wrapper mb-2 bg-info">
                <v-icon size="32" color="white" icon="mdi-clock-outline"></v-icon>
              </div>
              <v-card-subtitle class="text-caption pb-0 pt-2">PERÍODO ACTUAL</v-card-subtitle>
              <v-card-title class="text-h5 font-weight-bold pt-1">{{ stats.currentPeriod }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex align-center">
                <v-icon size="small" color="info">mdi-calendar-range</v-icon>
                <span class="text-caption text-medium-emphasis ms-1">Pago estimado: 30 del mes</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Contenido principal en dos columnas -->
      <v-row class="mt-8">
        <!-- Panel izquierdo: Recibos recientes -->
        <v-col cols="12" lg="8">
          <v-card class="h-100" elevation="3" rounded="lg">
            <v-card-title class="card-title-with-action pb-2 pt-4">
              <div class="d-flex align-center">
                <div class="mr-3">
                  <v-avatar color="primary" variant="flat" size="42">
                    <v-icon color="white" size="medium">mdi-history</v-icon>
                  </v-avatar>
                </div>
                <div>
                  <h3 class="text-h5 mb-0">Recibos Recientes</h3>
                  <span class="text-caption text-medium-emphasis">Últimos recibos procesados</span>
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="text"
                to="/pagos"
                class="mt-2"
              >
                Ver todos
              </v-btn>
            </v-card-title>

            <v-divider></v-divider>
            
            <!-- Versión moderna de la tabla -->
            <v-card-text class="px-0 py-0">
              <div v-if="loading" class="pa-8 text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <div class="mt-4">Cargando recibos recientes...</div>
              </div>
              
              <v-list v-else lines="two">
                <v-list-item
                  v-for="(recibo, i) in recentRecibos"
                  :key="i"
                  :to="`/pagos/${recibo.id}`"
                  class="receipt-item py-3"
                >
                  <template v-slot:prepend>
                    <v-avatar color="grey-lighten-3" variant="flat" size="52">
                      <v-icon color="grey-darken-1" size="large">mdi-file-document-outline</v-icon>
                    </v-avatar>
                  </template>
                  
                  <v-list-item-title class="font-weight-medium text-subtitle-1 mb-1">
                    Recibo de Pago #{{ recibo.nro_recibo }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="x-small" color="grey">mdi-calendar</v-icon>
                      <span class="text-caption text-medium-emphasis ms-1 me-3">{{ recibo.fecha_pago }}</span>
                      
                      <v-chip
                        size="x-small"
                        :color="getStatusColor(recibo.estado)"
                        variant="flat"
                        label
                        class="mr-2"
                      >
                        {{ recibo.estado }}
                      </v-chip>
                    </div>
                  </v-list-item-subtitle>
                  
                  <template v-slot:append>
                    <div class="text-right">
                      <div class="text-subtitle-1 font-weight-bold mb-1">
                        {{ formatearMoneda(recibo.sueldo_liquido) }}
                      </div>
                      <v-icon color="primary" size="small">mdi-arrow-right</v-icon>
                    </div>
                  </template>
                </v-list-item>
                
                <v-divider v-if="recentRecibos.length === 0" class="mb-2"></v-divider>
                
                <div v-if="recentRecibos.length === 0" class="pa-8 text-center">
                  <v-icon size="48" color="grey-lighten-2" icon="mdi-file-document-outline"></v-icon>
                  <div class="text-h6 mt-4">No hay recibos recientes</div>
                  <span class="text-subtitle-2 text-medium-emphasis">Los nuevos recibos aparecerán aquí</span>
                </div>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Panel derecho: Perfil y enlaces -->
        <v-col cols="12" lg="4">
          <!-- Información de Usuario -->
          <v-card elevation="3" rounded="lg" class="mb-6">
            <v-card-title class="pb-2 pt-4">
              <div class="d-flex align-center">
                <div class="mr-3">
                  <v-avatar color="primary" size="42">
                    <span class="text-h5 font-weight-medium white--text">
                      {{ getInitials() }}
                    </span>
                  </v-avatar>
                </div>
                <div>
                  <h3 class="text-h5 mb-0">Perfil de Usuario</h3>
                  <span class="text-caption text-medium-emphasis">Información personal</span>
                </div>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4">
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar color="primary-lighten-5" size="36">
                      <v-icon color="primary" size="small">mdi-account</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">Nombre Completo</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-medium">
                    {{ currentUser?.nombres }} {{ currentUser?.primer_apellido }} {{ currentUser?.segundo_apellido }}
                  </v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar color="primary-lighten-5" size="36">
                      <v-icon color="primary" size="small">mdi-badge-account</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">Nombre de Usuario</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-medium">
                    {{ currentUser?.username }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          
          <!-- Enlaces Rápidos -->
          <v-card elevation="3" rounded="lg">
            <v-card-title class="pb-2 pt-4">
              <div class="d-flex align-center">
                <div class="mr-3">
                  <v-avatar color="info" size="42">
                    <v-icon color="white" size="medium">mdi-link-variant</v-icon>
                  </v-avatar>
                </div>
                <div>
                  <h3 class="text-h5 mb-0">Enlaces Rápidos</h3>
                  <span class="text-caption text-medium-emphasis">Accesos directos</span>
                </div>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-list select-strategy="classic">
                <v-list-item 
                  link
                  to="/pagos"
                  color="primary"
                  class="quick-link-item"
                >
                  <template v-slot:prepend>
                    <v-avatar color="primary-lighten-5" size="42">
                      <v-icon color="primary">mdi-file-document-outline</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">Todos los Recibos</v-list-item-title>
                  <v-list-item-subtitle>Ver y descargar recibos históricos</v-list-item-subtitle>
                  
                  <template v-slot:append>
                    <v-icon color="primary">mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-divider class="mx-4"></v-divider>
                
                <v-list-item 
                  link
                  to="/historial"
                  color="primary"
                  class="quick-link-item"
                >
                  <template v-slot:prepend>
                    <v-avatar color="primary-lighten-5" size="42">
                      <v-icon color="primary">mdi-history</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">Historial de Descargas</v-list-item-title>
                  <v-list-item-subtitle>Registro de documentos descargados</v-list-item-subtitle>
                  
                  <template v-slot:append>
                    <v-icon color="primary">mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';
import { recibosPagoService } from '@/services/recibosPago';

const router = useRouter();
const currentUser = ref(null);
const loading = ref(true);

// Datos estadísticos
const stats = ref({
  totalRecibos: '0',
  lastReciboDate: '-',
  currentPeriod: '-'
});

// Configuración de la tabla de recibos recientes
const headers = [
  { title: 'Nº Recibo', key: 'nro_recibo', align: 'start' },
  { title: 'Fecha', key: 'fecha_pago', align: 'start' },
  { title: 'Monto', key: 'sueldo_liquido', align: 'end' },
  { title: 'Estado', key: 'estado', align: 'center' },
  { title: 'Acciones', key: 'actions', align: 'center', sortable: false },
];

// Recibos recientes para mostrar en dashboard
const recentRecibos = ref([]);

// Formateador de moneda disponible para la vista
const formatearMoneda = recibosPagoService.formatearMoneda;
const formatearFecha = recibosPagoService.formatearFecha;

// Función para obtener iniciales del usuario
function getInitials() {
  if (!currentUser.value?.nombres) return '';
  const nombre = currentUser.value.nombres.charAt(0);
  const apellido = currentUser.value.primer_apellido ? currentUser.value.primer_apellido.charAt(0) : '';
  return (nombre + apellido).toUpperCase();
}

// Determinar el color según estado
function getStatusColor(status) {
  if (status === 'Pagado') return 'success';
  if (status === 'Pendiente') return 'warning';
  if (status === 'Rechazado') return 'error';
  return 'info';
}

// Cargar datos al montar el componente
onMounted(async () => {
  currentUser.value = authService.getCurrentUser();
  
  if (!currentUser.value) {
    router.push('/login');
    return;
  }
  
  try {
    loading.value = true;
    
    // Cargar datos reales de la API
    const recibos = await recibosPagoService.obtenerMisRecibos();
    
    // Formatear y preparar los datos para mostrar
    recentRecibos.value = recibos.slice(0, 3).map(recibo => ({
      id: recibo.id,
      nro_recibo: recibo.nro_recibo,
      fecha_pago: formatearFecha(recibo.fecha_pago),
      fecha_emision: recibo.fecha_pago,
      sueldo_liquido: recibo.sueldo_liquido,
      estado: 'Pagado' // Por defecto consideramos todos pagados
    }));
    
    // Actualizar estadísticas
    if (recibos.length > 0) {
      stats.value = {
        totalRecibos: recibos.length.toString(),
        lastReciboDate: formatearFecha(recibos[0].fecha_pago),
        currentPeriod: recibos[0].periodo
      };
    }
    
    loading.value = false;
  } catch (error) {
    console.error('Error al cargar datos:', error);
    loading.value = false;
  }
});
</script>

<style scoped>
.dashboard-container {
  background-color: #f6f8fa;
  min-height: 100vh;
}

.dashboard-header {
  background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.stat-card {
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: var(--v-primary-base, #1976d2);
}

.bg-success {
  background-color: var(--v-success-base, #4caf50);
}

.bg-info {
  background-color: var(--v-info-base, #2196f3);
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--v-success-base, #4caf50);
}

.card-title-with-action {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}

.receipt-item {
  transition: background-color 0.2s ease;
  cursor: pointer;
  border-left: 3px solid transparent;
}

.receipt-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
  border-left-color: var(--v-primary-base, #1976d2);
}

.quick-link-item {
  transition: background-color 0.2s ease;
  padding-top: 12px;
  padding-bottom: 12px;
}

.quick-link-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
}

/* Animación para tarjetas */
.v-card {
  animation: fadeIn 0.5s ease-out;
  transition: all 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
