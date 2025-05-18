const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middleware/error.middleware');

// Crear instancia de Express
const app = express();

// Middlewares
app.use(helmet());  // Seguridad para encabezados HTTP
app.use(cors());    // Habilitar CORS
app.use(morgan('dev'));  // Logging
app.use(express.json());  // Parseo de solicitudes JSON
app.use(express.urlencoded({ extended: true }));  // Parseo de URL-encoded

// Rutas API
app.use('/api/v1', routes);

// Manejo de ruta no encontrada
app.use(notFoundHandler);

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;