# MicroeDoc - Portal de Recibos de Pago

![MicroeDoc Logo](https://microedoc.com/wp-content/uploads/2022/09/1.-Logo-MicroeDoc-color-2.png)

## 📋 Descripción

Portal de visualización de recibos de pago para empleados. Esta aplicación permite a los usuarios autenticarse y consultar sus recibos de pago de forma segura y sencilla.

## ✅ Características principales

- **Autenticación segura** de usuarios
- **Dashboard** con información relevante
- **Visualización de recibos** de pago con filtros y búsqueda
- **Detalle completo** de cada recibo
- **Interfaz responsive** adaptada a todos los dispositivos
- **Manejo de rutas** y páginas de error personalizadas

## 🔧 Tecnologías utilizadas

- **Vue 3**: Framework progresivo para construir interfaces de usuario
- **Vuetify 3**: Biblioteca de componentes Material Design para Vue
- **Vue Router**: Enrutamiento oficial para aplicaciones Vue.js
- **Vite**: Herramienta de compilación ultrarrápida
- **Axios**: Cliente HTTP para realizar peticiones al backend

## 🚀 Instalación y configuración

### Requisitos previos

- Node.js (v16.x o superior)
- npm (v8.x o superior) o yarn (v1.22.x o superior)
- Git

### Pasos para la instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/rubegonzalezc/Prueba-Microsystem.git
cd prueba-back-microsystem/prueba-front-microsystem
```
2. **Instalación de las dependencias**
```bash
npm install
# o si prefieres usar yarn
yarn install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```


## 🔌 Configuración del Backend

La aplicación frontend se comunica con una API REST. Para configurar el backend:

Sigue las instrucciones de instalación en el directorio prueba-back-microsystem
Asegúrate de que el servidor backend esté ejecutándose en la URL especificada en tu archivo .env
Verifica que los endpoints estén accesibles:
POST /api/auth/login - Autenticación
GET /api/recibos - Lista de recibos
GET /api/recibos/:id - Detalle de un recibo

1. **Iniciar proyecto**
Se debe instalar las dependencias
```bash
npm run i
```

2. **Iniciar base de datos**
Antes de iniciar el servidor de pruebas se debe realizar el siguiente comando para iniciar la creación de usuarios en base de datos SQLite
```bash
npm run importar
```

3. **Iniciar servidor de pruebas**
Se inicia con el comando
```bash
npm run dev
```

# Manual de Usuario

1. **Acceso al sistema**
* Abra su navegador web y acceda a la dirección proporcionada por su administrador.
* Se mostrará la pantalla de inicio de sesión.
* Ingrese sus credenciales (usuario y contraseña)

<img alt="Pantalla de login" src="https://github.com/rubegonzalezc/Prueba-Microsystem/blob/main/manual-usuario/inicio-sesion.PNG?raw=true">

2. **Dashbaord principal**
Una vez autenticado, accederá al Dashboard principal que muestra:
* Resumen de recibos
* Últimos recibos
* Accesos rápidos

<img alt="Pantalla de dashboard" src="https://github.com/rubegonzalezc/Prueba-Microsystem/blob/main/manual-usuario/dashboard.PNG?raw=true">

3. Consulta de recibos de pago
Para consultar sus recibos de pago:
* Haga click en "Recibos de pagos" en el menú lateral.
* Se mostrará una tabla con todos sus recibos, ordenados del más reciente al más antiguo.
* La tabla incluye información básica: Número de recibo, fecha de pago, período, monto líquido.

<img alt="Pantalla de pagos" src="https://github.com/rubegonzalezc/Prueba-Microsystem/blob/main/manual-usuario/recibo-pagos.PNG?raw=true">


4. Visualizaciíon de detalles
Para ver el detalle completo de un recibo:
* En la lista de recibos, haga click en el icono de "ojo" en la columna de acciones.
* Se abrirá una nueva página con toda la información del recibo seleccionado.

<img alt="Pantalla de dashboard" src="https://github.com/rubegonzalezc/Prueba-Microsystem/blob/main/manual-usuario/detalle-pagos.PNG?raw=true">

5. Cerrar sesión
Para cerrar sesión de forma segura:
* Haga click en el botón "Cerrar Sesión" ubicado en la parte inferior del menú lateral.
* Confirme la acción cuando se le solicite.
* Será redirigido a la pantalla de incio de sesión
