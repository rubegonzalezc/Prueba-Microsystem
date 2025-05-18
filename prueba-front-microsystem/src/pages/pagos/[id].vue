<template>
  <v-container fluid class="detail-container pa-6">
    <!-- Cabecera con navegación y acciones -->
    <div class="d-flex flex-wrap align-center mb-6">
      <div class="d-flex align-center">
        <v-btn
          icon
          color="primary"
          variant="text"
          class="me-3 back-btn"
          @click="router.back()"
        >
          <v-icon size="large">mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <h1 class="text-h4 mb-0">Detalle de Recibo</h1>
          <span class="text-subtitle-2 text-medium-emphasis">
            #{{ recibo?.nro_recibo || 'Cargando...' }}
          </span>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        v-if="recibo"
        color="primary"
        variant="tonal"
        class="action-btn"
        prepend-icon="mdi-download"
        @click="descargarRecibo(recibo)"
      >
        Descargar PDF
      </v-btn>
    </div>

    <!-- Estado de carga -->
    <v-card v-if="loading" class="loading-card pa-12 text-center" elevation="2" rounded="lg">
      <v-progress-circular indeterminate color="primary" size="70" width="7"></v-progress-circular>
      <h3 class="text-h5 mt-8 mb-2">Cargando recibo</h3>
      <p class="text-medium-emphasis">Estamos recuperando la información de tu recibo...</p>
    </v-card>

    <!-- Contenido principal cuando está cargado -->
    <template v-else-if="recibo">
      <!-- Resumen del recibo -->
      <v-card class="receipt-summary mb-6" elevation="3" rounded="lg">
        <v-toolbar color="primary" class="receipt-header" flat>
          <v-toolbar-title class="text-white">
            <v-icon color="white" class="me-2">mdi-receipt</v-icon>
            Resumen del Recibo
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-chip 
            color="success" 
            size="large" 
            variant="elevated" 
            class="font-weight-bold"
          >
            PAGADO
          </v-chip>
        </v-toolbar>
        
        <v-card-text class="py-6">
          <v-row>
            <!-- Información del recibo -->
            <v-col cols="12" md="5">
              <div class="d-flex align-center mb-6">
                <v-avatar color="primary-lighten-5" size="64" class="me-4">
                  <v-icon size="36" color="primary">mdi-calendar-text</v-icon>
                </v-avatar>
                <div>
                  <div class="text-overline">PERÍODO DE PAGO</div>
                  <div class="text-h5 font-weight-bold">{{ recibo.periodo }}</div>
                  <div class="text-caption text-medium-emphasis">
                    Fecha de pago: {{ formatearFecha(recibo.fecha_pago) }}
                  </div>
                </div>
              </div>
              
              <v-list lines="two" class="pa-0 mb-4 bg-transparent">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar color="grey-lighten-4" size="40">
                      <v-icon color="grey-darken-2" size="20">mdi-identifier</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2 text-medium-emphasis mb-1">
                    Número de Recibo
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-1 font-weight-medium">
                    {{ recibo.nro_recibo }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            
            <!-- Separador vertical -->
            <v-col cols="12" md="1" class="d-none d-md-flex align-center justify-center">
              <v-divider vertical></v-divider>
            </v-col>
            
            <!-- Montos y totales -->
            <v-col cols="12" md="6">
              <div class="summary-financial">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-body-1">Sueldo Base</span>
                  <span>{{ formatearMoneda(recibo.sueldo_base) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-body-1">Bono de Producción</span>
                  <span class="text-success">+{{ formatearMoneda(recibo.bono_produccion) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-body-1">Total Descuentos</span>
                  <span class="text-error">-{{ formatearMoneda(totalDescuentos) }}</span>
                </div>
                
                <v-divider class="my-4"></v-divider>
                
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-h6 font-weight-bold mb-0">Sueldo Líquido</div>
                    <div class="text-caption text-medium-emphasis">Monto depositado</div>
                  </div>
                  <div class="text-h4 font-weight-bold text-success">
                    {{ formatearMoneda(recibo.sueldo_liquido) }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      
      <!-- Desglose de descuentos -->
      <v-card class="mb-6 receipt-detail" elevation="3" rounded="lg">
        <v-toolbar
          color="primary"
          flat
          class="receipt-detail-header"
          density="comfortable"
        >
          <v-toolbar-title class="text-white">
            <v-icon color="white" class="me-2">mdi-calculator</v-icon>
            Desglose de Descuentos
          </v-toolbar-title>
        </v-toolbar>
        
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="deduction-card h-100">
                <v-card-item>
                  <div class="d-flex align-center mb-2">
                    <v-avatar color="info-lighten-5" size="48" class="me-3">
                      <v-icon color="info">mdi-hospital-box</v-icon>
                    </v-avatar>
                    <v-card-title>Descuento Salud</v-card-title>
                  </div>
                  <v-card-text class="pt-2">
                    <div class="text-h5 font-weight-bold text-info">
                      {{ formatearMoneda(recibo.descuento_salud) }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      {{ calcularPorcentaje(recibo.descuento_salud, recibo.sueldo_base) }}% del sueldo base
                    </div>
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="deduction-card h-100">
                <v-card-item>
                  <div class="d-flex align-center mb-2">
                    <v-avatar color="info-lighten-5" size="48" class="me-3">
                      <v-icon color="info">mdi-piggy-bank</v-icon>
                    </v-avatar>
                    <v-card-title>Descuento AFP</v-card-title>
                  </div>
                  <v-card-text class="pt-2">
                    <div class="text-h5 font-weight-bold text-info">
                      {{ formatearMoneda(recibo.descuento_afp) }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      {{ calcularPorcentaje(recibo.descuento_afp, recibo.sueldo_base) }}% del sueldo base
                    </div>
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="deduction-card h-100">
                <v-card-item>
                  <div class="d-flex align-center mb-2">
                    <v-avatar color="info-lighten-5" size="48" class="me-3">
                      <v-icon color="info">mdi-cash-minus</v-icon>
                    </v-avatar>
                    <v-card-title>Otros Descuentos</v-card-title>
                  </div>
                  <v-card-text class="pt-2">
                    <div class="text-h5 font-weight-bold text-info">
                      {{ formatearMoneda(recibo.otros_descuentos) }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      {{ calcularPorcentaje(recibo.otros_descuentos, recibo.sueldo_base) }}% del sueldo base
                    </div>
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      
      <!-- Información adicional si está disponible -->
      <v-card v-if="recibo.detalle" class="mb-6 receipt-notes" elevation="3" rounded="lg">
        <v-toolbar
          color="primary"
          flat
          class="receipt-notes-header"
          density="comfortable"
        >
          <v-toolbar-title class="text-white">
            <v-icon color="white" class="me-2">mdi-text-box</v-icon>
            Información Adicional
          </v-toolbar-title>
        </v-toolbar>
        
        <v-card-text class="pa-6">
          <div class="receipt-notes-content">
            <v-icon color="grey" class="me-2">mdi-information-outline</v-icon>
            {{ recibo.detalle }}
          </div>
        </v-card-text>
      </v-card>
      
      <!-- Acciones adicionales -->
      <div class="d-flex justify-center mt-8">
        <v-btn
          variant="text"
          color="primary"
          prepend-icon="mdi-arrow-left"
          @click="router.push('/pagos')"
        >
          Volver a Listado de Recibos
        </v-btn>
      </div>
    </template>
    
    <!-- Estado de error -->
    <v-card v-else class="error-card text-center pa-12" elevation="3" rounded="lg">
      <v-avatar color="error-lighten-5" size="96" class="mb-4">
        <v-icon size="64" color="error">mdi-alert-circle</v-icon>
      </v-avatar>
      <h2 class="text-h4 mb-2">Recibo no encontrado</h2>
      <p class="text-body-1 mb-6 text-medium-emphasis">
        El recibo solicitado no existe o no tienes permisos para verlo.
      </p>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-view-list" 
        size="large"
        @click="router.push('/pagos')"
      >
        Volver a Recibos de Pago
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { recibosPagoService } from '@/services/recibosPago';

const router = useRouter();
const route = useRoute();
const recibo = ref(null);
const loading = ref(true);

// Formateadores importados del servicio
const formatearFecha = recibosPagoService.formatearFecha;
const formatearMoneda = recibosPagoService.formatearMoneda;

// Calcular el total de descuentos
const totalDescuentos = computed(() => {
  if (!recibo.value) return 0;
  return recibo.value.descuento_salud + recibo.value.descuento_afp + recibo.value.otros_descuentos;
});

// Función para calcular el porcentaje de un valor respecto al sueldo base
function calcularPorcentaje(valor, total) {
  if (!total) return 0;
  return ((valor / total) * 100).toFixed(1);
}

// Función para descargar el recibo
function descargarRecibo(item) {
  alert(`Descargando recibo ${item.nro_recibo}`);
  // Aquí implementarías la lógica para generar y descargar el PDF
}

// Cargar datos del recibo
onMounted(async () => {
  const reciboId = route.params.id;
  console.log("ID del recibo a consultar:", reciboId, "Tipo:", typeof reciboId);
  
  if (!reciboId) {
    console.error("No se proporcionó ID de recibo");
    router.push('/pagos');
    return;
  }
  
  try {
    loading.value = true;
    recibo.value = await recibosPagoService.obtenerPorId(reciboId);
    console.log("Detalle del recibo cargado:", recibo.value);
    loading.value = false;
  } catch (error) {
    console.error('Error al cargar el recibo:', error);
    loading.value = false;
    recibo.value = null;
    // No redireccionar automáticamente, mostrar el mensaje de error en la UI
  }
});
</script>

<style scoped>
.detail-container {
  background-color: #f6f8fa;
  min-height: 100vh;
}

.back-btn {
  transition: transform 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-3px);
}

.receipt-summary, .receipt-detail, .receipt-notes, .loading-card, .error-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;
}

.receipt-summary:hover, .receipt-detail:hover, .receipt-notes:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.receipt-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-financial {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.deduction-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.deduction-card:hover {
  border-color: var(--v-info-base, #2196f3);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}

.receipt-notes-content {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--v-primary-base, #1976d2);
}

.action-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
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

/* Ajustes para mobile */
@media (max-width: 599px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
  .action-btn {
    margin-top: 16px;
    width: 100%;
  }
}
</style>