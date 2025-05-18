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

Desarrollado con ❤️ para MicroeDoc