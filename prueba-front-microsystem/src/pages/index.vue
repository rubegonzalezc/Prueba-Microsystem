<template>
  <div class="redirect-container">
    <v-progress-circular indeterminate color="primary" size="64" />
    <p class="mt-4 text-body-1">Redireccionando...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';

const router = useRouter();

onMounted(() => {
  // Pequeña espera para que se vea la animación de carga
  setTimeout(() => {
    // Redirigir según el estado de autenticación
    if (authService.isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, 500);
});
</script>

<style scoped>
.redirect-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}
</style>
