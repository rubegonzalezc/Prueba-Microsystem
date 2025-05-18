/**
 * Calcula el sueldo líquido a partir de los demás valores
 * @param {Object} recibo - Datos del recibo
 * @returns {Number} - Sueldo líquido calculado
 */
exports.calcularSueldoLiquido = (recibo) => {
  const { sueldo_base, bono_produccion, descuento_salud, descuento_afp, otros_descuentos } = recibo;
  
  const sueldoBruto = Number(sueldo_base) + Number(bono_produccion);
  const descuentos = Number(descuento_salud) + Number(descuento_afp) + Number(otros_descuentos);
  
  return sueldoBruto - descuentos;
};

/**
 * Valida que el sueldo líquido calculado coincida con el proporcionado
 * @param {Object} recibo - Datos del recibo
 * @returns {Boolean} - true si el sueldo líquido es correcto
 */
exports.validarSueldoLiquido = (recibo) => {
  const sueldoCalculado = exports.calcularSueldoLiquido(recibo);
  return Math.abs(sueldoCalculado - recibo.sueldo_liquido) < 1; // Permitir diferencia de centavos
};