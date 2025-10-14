const TransaccionEstado = ({ estado }) => {
  const colores = {
    'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'COMPLETADA': 'bg-green-100 text-green-800 border-green-300',
    'CANCELADA': 'bg-red-100 text-red-800 border-red-300'
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {estado || 'SIN ESTADO'}
    </span>
  )
}

export default TransaccionEstado