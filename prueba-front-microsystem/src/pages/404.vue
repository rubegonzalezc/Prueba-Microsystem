<template>
  <div class="not-found-container">
    <v-container class="text-center">
      <div class="error-content">
        <!-- Imagen animada del error -->
        <div class="error-image mb-8">
          <div class="error-number">404</div>
          <div class="error-illustration">
            <div class="astronaut">
              <v-img 
                src="@/assets/astronaut.svg" 
                alt="Astronauta" 
                width="120" 
                class="floating"
              />
            </div>
            <div class="planet">
              <v-img 
                src="@/assets/planet.svg" 
                alt="Planeta" 
                width="280" 
                class="rotating"
              />
            </div>
          </div>
        </div>
        
        <!-- Mensaje de error -->
        <h1 class="text-h3 font-weight-bold mb-3 fade-in">Página no encontrada</h1>
        <p class="text-body-1 text-medium-emphasis mb-8 fade-in">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <!-- Acciones -->
        <div class="actions fade-in">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            prepend-icon="mdi-home"
            class="me-4 action-btn"
            :elevation="3"
            @click="goToDashboard"
          >
            Ir al Inicio
          </v-btn>
          
          <v-btn
            color="secondary"
            size="large"
            variant="tonal"
            prepend-icon="mdi-arrow-left"
            class="action-btn"
            @click="goBack"
          >
            Volver Atrás
          </v-btn>
        </div>
        
        <!-- Mensaje adicional -->
        <v-alert
          color="info"
          variant="tonal"
          icon="mdi-information"
          border="start"
          class="mt-12 mx-auto max-width fade-in"
          density="comfortable"
        >
          Si crees que esto es un error, por favor contacta al soporte técnico.
        </v-alert>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

function goToDashboard() {
  router.push('/dashboard');
}

function goBack() {
  router.go(-1);
}

onMounted(() => {
  document.title = '404 - Página no encontrada | MicroeDoc';
});
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #edf1f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-content {
  max-width: 700px;
  margin: 0 auto;
}

.error-image {
  position: relative;
  height: 280px;
  margin-bottom: 3rem;
}

.error-number {
  font-size: 180px;
  font-weight: bold;
  background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  opacity: 0.15;
  letter-spacing: -5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 100%;
}

.error-illustration {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.astronaut {
  position: absolute;
  top: 20%;
  right: 30%;
  z-index: 3;
}

.planet {
  position: absolute;
  z-index: 2;
}

.floating {
  animation: float 6s ease-in-out infinite;
}

.rotating {
  animation: rotate 60s linear infinite;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-in forwards;
}

.actions {
  animation-delay: 0.3s;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.max-width {
  max-width: 500px;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>