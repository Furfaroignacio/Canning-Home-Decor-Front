// Precios en pesos argentinos, sin centavos: $289.000
const formateador = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export const formatearPrecio = (valor) =>
  typeof valor === 'number' ? formateador.format(valor) : ''

// "6 piezas" / "1 pieza"
export const contarPiezas = (cantidad) =>
  `${cantidad} ${cantidad === 1 ? 'pieza' : 'piezas'}`

// "8 de octubre de 2026"
const fechaLarga = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatearFecha = (iso) => {
  if (!iso) return ''
  const fecha = new Date(iso)
  return Number.isNaN(fecha.getTime()) ? '' : fechaLarga.format(fecha)
}
