<template>
  <div class="login-wrapper">
    <!-- Fondo con patrones dinámicos -->
    <div class="animated-background">
      <div class="pattern-overlay"></div>
    </div>
    
    <v-container fluid class="login-container fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="login-card" elevation="5">
            <v-row no-gutters>
              <!-- Panel izquierdo: Solo decorativo -->
              <v-col cols="12" md="5" class="accent-panel d-none d-md-flex">
                <div class="accent-panel-content">
                  <div class="accent-circles">
                    <div class="accent-circle circle-1"></div>
                    <div class="accent-circle circle-2"></div>
                    <div class="accent-circle circle-3"></div>
                  </div>
                  <div class="accent-text">
                    <h2 class="text-h4 font-weight-bold text-white">Bienvenido</h2>
                    <p class="text-subtitle-1 text-white mb-4">Sistema de Gestión de Pagos</p>
                    <div class="feature-list">
                      <div class="feature-item">
                        <v-icon color="white" class="feature-icon">mdi-shield-check</v-icon>
                        <span>Acceso Seguro</span>
                      </div>
                      <div class="feature-item">
                        <v-icon color="white" class="feature-icon">mdi-file-document-outline</v-icon>
                        <span>Recibos Digitales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              
              <!-- Panel derecho: Formulario y logo -->
              <v-col cols="12" md="7">
                <div class="form-panel">
                  <!-- Logo en la parte superior del formulario con fondo blanco -->
                  <div class="text-center mb-6">
                    <div class="logo-wrapper mx-auto">
                      <v-img
                        alt="MicroeDoc Logo"
                        max-width="180"
                        :src="logoSrc"
                        class="mx-auto"
                      />
                    </div>
                  </div>
                  
                  <h1 class="text-h5 font-weight-bold mb-2">Iniciar Sesión</h1>
                  <p class="text-subtitle-2 text-medium-emphasis mb-6">
                    Ingrese sus credenciales para acceder a su cuenta
                  </p>
                  
                  <v-form ref="loginForm" v-model="formValid" lazy-validation @submit.prevent="login">
                    <v-text-field
                      v-model="username"
                      autocomplete="username"
                      class="mb-3"
                      color="primary"
                      density="compact"
                      :disabled="isLoading"
                      :error-messages="usernameError"
                      label="Nombre de Usuario"
                      prepend-inner-icon="mdi-account"
                      :rules="usernameRules"
                      variant="outlined"
                      @input="usernameError = ''"
                    />

                    <v-text-field
                      v-model="password"
                      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      autocomplete="current-password"
                      class="mb-5"
                      color="primary"
                      density="compact"
                      :disabled="isLoading"
                      :error-messages="passwordError"
                      label="Contraseña"
                      prepend-inner-icon="mdi-lock"
                      :rules="passwordRules"
                      :type="showPassword ? 'text' : 'password'"
                      variant="outlined"
                      @click:append-inner="showPassword = !showPassword"
                      @input="passwordError = ''"
                    />

                    <v-alert
                      v-if="loginError"
                      class="mb-4 login-error"
                      closable
                      density="compact"
                      type="error"
                      variant="tonal"
                      @click:close="loginError = ''"
                    >
                      {{ loginError }}
                    </v-alert>

                    <v-btn
                      block
                      class="login-btn mb-6"
                      color="primary"
                      :disabled="!formValid"
                      :loading="isLoading"
                      size="large"
                      type="submit"
                      min-height="48"
                      elevation="2"
                    >
                      Iniciar Sesión
                    </v-btn>

                    <div class="text-caption text-center text-medium-emphasis mt-6">
                      Sistema de uso exclusivo para personal autorizado.
                      <br>© {{ new Date().getFullYear() }} MicroeDoc - Todos los derechos reservados.
                    </div>
                  </v-form>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { authService } from '@/services/auth';
  import { nextTick } from 'vue';
  import logoSrc from '@/assets/logo.png';
  // Router para la navegación
  const router = useRouter();

  // Estado del formulario
  const loginForm = ref(null);
  const formValid = ref(false);
  const username = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const isLoading = ref(false);
  const logoLoaded = ref(false);

  // Errores del formulario
  const usernameError = ref('');
  const passwordError = ref('');
  const loginError = ref('');

  // URL del logo
  const logoUrl = 'https://microedoc.com/wp-content/uploads/2022/09/1.-Logo-MicroeDoc-color-2.png';

  // Reglas de validación
  const usernameRules = [
    v => !!v || 'El nombre de usuario es obligatorio',
    v => {
      const regex = /^[A-Z][a-zA-Z0-9]*[a-zA-Z][0-9]{3}$/;
      const isValid = regex.test(v) && v.length >= 15;
      return isValid || 'Formato inválido. Debe tener mínimo 15 caracteres, comenzar con mayúscula y terminar con 3 dígitos';
    },
  ];

  const passwordRules = [
    v => !!v || 'La contraseña es obligatoria',
    v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
  ];

  // Función de inicio de sesión
  async function login () {
    if (!loginForm.value.validate()) return;

    isLoading.value = true;
    loginError.value = '';

    try {
      const response = await authService.login(username.value, password.value);
      console.log('Login exitoso, redireccionando...');

      // Mostrar animación de éxito antes de redireccionar
      await new Promise(resolve => setTimeout(resolve, 800));

      // Forzar la redirección usando replace en lugar de push para evitar problemas
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error capturado en componente:', error);
      loginError.value = error.message || 'Credenciales inválidas. Por favor, intente nuevamente.';

      // Para error específico de formato
      if (error.details?.username) {
        usernameError.value = error.details.username;
      }
      if (error.details?.password) {
        passwordError.value = error.details.password;
      }
    } finally {
      isLoading.value = false;
    }
  }

  // Comprobar si ya está autenticado al montar el componente
  onMounted(async () => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    }
  });
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(45deg, #f5f7fa 0%, #e8eef5 100%);
}

.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: 
    linear-gradient(30deg, #e1e6ed 12%, transparent 12.5%, transparent 87%, #e1e6ed 87.5%, #e1e6ed),
    linear-gradient(150deg, #e1e6ed 12%, transparent 12.5%, transparent 87%, #e1e6ed 87.5%, #e1e6ed),
    linear-gradient(30deg, #e1e6ed 12%, transparent 12.5%, transparent 87%, #e1e6ed 87.5%, #e1e6ed),
    linear-gradient(150deg, #e1e6ed 12%, transparent 12.5%, transparent 87%, #e1e6ed 87.5%, #e1e6ed);
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px;
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
  position: relative;
}

.accent-panel {
  background: linear-gradient(135deg, #0a2463 0%, #3e92cc 100%);
  position: relative;
  overflow: hidden;
  min-height: 100%;
}

.accent-panel-content {
  padding: 3rem;
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.accent-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.accent-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
}

.accent-text {
  position: relative;
  z-index: 2;
}

.form-panel {
  padding: 3rem;
  background-color: white;
  height: 100%;
}

.logo-wrapper {
  margin-bottom: 2rem;
}

.feature-list {
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
}

.feature-icon {
  margin-right: 12px;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 8px;
  border-radius: 50%;
}

.login-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.4) !important;
}

.login-error {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

@media (max-width: 959px) {
  .form-panel {
    padding: 2rem;
  }
}

@media (max-width: 599px) {
  .login-wrapper {
    padding: 1rem;
  }
  
  .form-panel {
    padding: 1.5rem;
  }
}
</style>
