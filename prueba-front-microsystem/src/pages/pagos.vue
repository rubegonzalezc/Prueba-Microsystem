<template>
  <v-container fluid class="pa-6 pagos-container">
    <div class="d-flex align-center mb-7">
      <h1 class="text-h4">Recibos de Pago</h1>
      <v-spacer></v-spacer>
      <v-chip color="primary" class="ml-2" size="small">{{ totalRecibos }} Recibos</v-chip>
    </div>

    <v-card class="receipts-card elevation-2">
      <!-- Panel superior con controles -->
      <div class="table-toolbar px-5 pt-5">
        <div class="d-flex flex-wrap align-center">
          <!-- Área izquierda con título y filtros -->
          <div class="toolbar-left d-flex align-center">
            <v-icon color="primary" class="me-3" icon="mdi-file-document-multiple" size="large"></v-icon>
            <div>
              <h2 class="text-h6">Listado de Recibos</h2>
              <span class="text-caption text-medium-emphasis">
                Consulta y descarga tus recibos de pago
              </span>
            </div>
          </div>
          
          <v-spacer></v-spacer>
          
          <!-- Área derecha con búsqueda y controles -->
          <div class="toolbar-right d-flex align-center flex-wrap">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar recibo"
              hide-details
              density="compact"
              variant="outlined"
              bg-color="grey-lighten-4"
              class="search-field me-2"
              style="max-width: 280px"
              placeholder="Nº recibo, período..."
              clearable
              @click:clear="search = ''"
            ></v-text-field>
            
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="text"
                  v-bind="props"
                  class="ms-2"
                >
                  <v-icon start>mdi-filter-variant</v-icon>
                  {{ filtroActivo ? labelFiltroActivo : 'Filtrar' }}
                </v-btn>
              </template>
              <v-card min-width="200">
                <v-list>
                  <v-list-item 
                    title="Todos los recibos" 
                    value="all"
                    @click="aplicarFiltro('all')"
                  >
                    <template v-slot:prepend>
                      <v-icon v-if="filtroActivo === 'all'" color="primary">mdi-check</v-icon>
                    </template>
                  </v-list-item>
                  
                  <v-list-item 
                    title="Último mes" 
                    value="lastMonth"
                    @click="aplicarFiltro('lastMonth')"
                  >
                    <template v-slot:prepend>
                      <v-icon v-if="filtroActivo === 'lastMonth'" color="primary">mdi-check</v-icon>
                    </template>
                  </v-list-item>
                  
                  <v-list-item 
                    title="Último año" 
                    value="lastYear"
                    @click="aplicarFiltro('lastYear')"
                  >
                    <template v-slot:prepend>
                      <v-icon v-if="filtroActivo === 'lastYear'" color="primary">mdi-check</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            
            <v-btn
              v-if="filtroActivo !== 'all'"
              icon
              variant="text"
              color="grey"
              size="small"
              class="ms-2"
              @click="limpiarFiltros"
              aria-label="Limpiar filtros"
            >
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Información sobre filtros activos -->
        <div v-if="filtroActivo !== 'all'" class="mt-3 text-caption text-primary">
          <v-icon size="small">mdi-filter</v-icon>
          Filtro aplicado: {{ labelFiltroActivo }}
        </div>
        
        <!-- Información sobre el límite -->
        <div v-if="totalRecibosFiltrados > maxRecibos" class="mt-3 text-caption text-grey">
          Mostrando los últimos {{ maxRecibos }} recibos de un total de {{ totalRecibosFiltrados }}.
          <v-btn 
            variant="text" 
            color="primary" 
            density="compact"
            @click="mostrarTodos = !mostrarTodos"
          >
            {{ mostrarTodos ? 'Mostrar menos' : 'Mostrar todos' }}
          </v-btn>
        </div>
        
        <v-divider class="mt-3"></v-divider>
      </div>
      
      <!-- Tabla mejorada -->
      <v-data-table
        :headers="headers"
        :items="recibosVisiblesFiltrados"
        :loading="loading"
        :search="search"
        class="receipts-table"
        hover
      >
        <template v-slot:loader>
          <v-sheet class="pa-5 text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              class="mb-3"
            ></v-progress-circular>
            <div>Cargando recibos...</div>
          </v-sheet>
        </template>
        
        <!-- Formateador de fecha con etiqueta visual -->
        <template v-slot:item.fecha_pago="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary-lighten-4" class="me-2">
              <v-icon size="small" color="primary">mdi-calendar</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ formatearFecha(item.fecha_pago) }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ new Date(item.fecha_pago).toLocaleDateString('es', { weekday: 'short' }) }}
              </div>
            </div>
          </div>
        </template>
        
        <!-- Formateador del período -->
        <template v-slot:item.periodo="{ item }">
          <v-chip size="small" color="info" variant="flat">{{ item.periodo }}</v-chip>
        </template>
        
        <!-- Formateador de monto con etiqueta visual -->
        <template v-slot:item.sueldo_liquido="{ item }">
          <div class="text-right">
            <div class="font-weight-bold text-primary">
              {{ formatearMoneda(item.sueldo_liquido) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Líquido
            </div>
          </div>
        </template>
        
        <!-- Acciones -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center">
            <v-tooltip text="Ver detalle">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="flat"
                  color="primary"
                  v-bind="props"
                  size="small"
                  @click="verRecibo(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Descargar PDF">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="flat"
                  color="grey-darken-1"
                  v-bind="props"
                  size="small"
                  class="ms-2"
                  @click="descargarRecibo(item)"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- Estado vacío personalizado -->
        <template v-slot:no-data>
          <div class="d-flex flex-column align-center pa-5">
            <v-icon size="64" color="grey-lighten-2" icon="mdi-file-search" class="mb-4"></v-icon>
            <h3 class="text-h6 text-center mb-2">No se encontraron recibos</h3>
            <p class="text-medium-emphasis text-center mb-4">
              No hay recibos que coincidan con tu búsqueda o filtros actuales.
            </p>
            <v-btn color="primary" variant="outlined" @click="limpiarTodo">
              Limpiar filtros
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { recibosPagoService } from '@/services/recibosPago';
import { authService } from '@/services/auth';

// Estado
const router = useRouter();
const search = ref('');
const loading = ref(true);
const recibos = ref([]);
const totalRecibos = ref(0);
const maxRecibos = 20; // Límite para mostrar inicialmente
const mostrarTodos = ref(false);
const filtroActivo = ref('all'); // Filtro por defecto: todos los recibos

// Etiquetas para los filtros
const labelsFiltros = {
  all: 'Todos los recibos',
  lastMonth: 'Último mes',
  lastYear: 'Último año'
};

// Etiqueta del filtro activo actual
const labelFiltroActivo = computed(() => {
  return labelsFiltros[filtroActivo.value] || 'Filtrar';
});

// Filtra los recibos según el criterio activo
const recibosFiltrados = computed(() => {
  if (filtroActivo.value === 'all') {
    return recibos.value;
  }
  
  const hoy = new Date();
  const recibosConFecha = recibos.value.map(r => ({
    ...r,
    fechaObj: new Date(r.fecha_pago)
  }));
  
  if (filtroActivo.value === 'lastMonth') {
    const unMesAtras = new Date(hoy);
    unMesAtras.setMonth(hoy.getMonth() - 1);
    return recibosConFecha.filter(r => r.fechaObj >= unMesAtras);
  }
  
  if (filtroActivo.value === 'lastYear') {
    const unAnioAtras = new Date(hoy);
    unAnioAtras.setFullYear(hoy.getFullYear() - 1);
    return recibosConFecha.filter(r => r.fechaObj >= unAnioAtras);
  }
  
  return recibos.value;
});

// Cantidad total después de aplicar filtros
const totalRecibosFiltrados = computed(() => {
  return recibosFiltrados.value.length;
});

// Recibos a mostrar según el límite establecido y filtros
const recibosVisiblesFiltrados = computed(() => {
  if (mostrarTodos.value || recibosFiltrados.value.length <= maxRecibos) {
    return recibosFiltrados.value;
  }
  return recibosFiltrados.value.slice(0, maxRecibos);
});

// Funciones para aplicar y limpiar filtros
function aplicarFiltro(filtro) {
  filtroActivo.value = filtro;
  mostrarTodos.value = false; // Resetear a vista limitada al cambiar filtro
}

function limpiarFiltros() {
  filtroActivo.value = 'all';
}

function limpiarTodo() {
  search.value = '';
  limpiarFiltros();
}

// Configuración de las columnas
const headers = [
  { title: 'Nº Recibo', key: 'nro_recibo', align: 'start', sortable: true },
  { title: 'Fecha', key: 'fecha_pago', align: 'start', sortable: true },
  { title: 'Período', key: 'periodo', align: 'center', sortable: true },
  { title: 'Sueldo Líquido', key: 'sueldo_liquido', align: 'end', sortable: true },
  { title: 'Acciones', key: 'actions', align: 'center', sortable: false },
];

// Métodos para manejar los recibos
function verRecibo(item) {
  router.push(`/pagos/${item.id}`);
}

function descargarRecibo(item) {
  // Implementar funcionalidad de descarga
  console.log('Descargando recibo:', item);
  // Aquí iría la lógica para descargar el PDF
}

// Formateadores
const formatearFecha = recibosPagoService.formatearFecha;
const formatearMoneda = recibosPagoService.formatearMoneda;

// Cargar datos al iniciar
onMounted(async () => {
  try {
    loading.value = true;
    const data = await recibosPagoService.obtenerMisRecibos();
    console.log("Recibos cargados:", data);
    
    // Ordenar los recibos por fecha (más recientes primero)
    recibos.value = data.sort((a, b) => {
      return new Date(b.fecha_pago) - new Date(a.fecha_pago);
    });
    
    totalRecibos.value = recibos.value.length;
    loading.value = false;
  } catch (error) {
    console.error('Error al cargar recibos:', error);
    loading.value = false;
  }
});
</script>

<style scoped>
.pagos-container {
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.receipts-card {
  border-radius: 12px;
  overflow: hidden;
}

.table-toolbar {
  background-color: white;
}

.search-field {
  transition: all 0.3s ease;
}

.search-field:focus-within {
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.search-field :deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-data-table) {
  border: none !important;
  background-color: white !important;
}

:deep(.v-data-table__td) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

:deep(.v-data-table__tr:hover td) {
  background-color: #f5f9ff !important;
}

:deep(.v-data-table__th) {
  font-size: 0.85rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: #f5f7fa !important;
  color: #546e7a !important;
}
</style>