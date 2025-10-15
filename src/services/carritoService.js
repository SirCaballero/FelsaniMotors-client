// carritoService.js
// Servicio para manejar el carrito de compras
// Para venta de autos: cada publicación es ÚNICA, no hay cantidades
// Almacena el carrito en localStorage para persistencia

const carritoService = {
  /**
   * Métodos en este archivo:
   * 
   * addToCart - Agrega un auto (publicación) al carrito
   * removeFromCart - Elimina un auto del carrito por idPublicacion
   * clearCart - Limpia todo el carrito
   * getCart - Obtiene el carrito actual
   * calculateTotal - Calcula el costo total del carrito
   * getCartCount - Obtiene el número de items en el carrito
   * isInCart - Verifica si una publicación ya está en el carrito
   */

  // Agrega un item al carrito (solo si no existe)
  addToCart: (item) => {
    const cart = carritoService.getCart();
    
    // Verificar si ya existe en el carrito
    const existingItem = cart.find((cartItem) => cartItem.idPublicacion === item.idPublicacion);
    
    if (existingItem) {
      return { success: false, message: 'Este auto ya está en tu carrito' };
    }

    // Validar que el item tenga los campos necesarios
    if (!item.idPublicacion || !item.titulo || !item.precio) {
      return { success: false, message: 'Datos de publicación inválidos' };
    }
    
    // Agregar al carrito (sin cantidad, cada auto es único)
    cart.push({ ...item });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return { success: true, cart };
  },

  // Elimina un item del carrito por idPublicacion
  removeFromCart: (idPublicacion) => {
    let cart = carritoService.getCart();
    cart = cart.filter((item) => item.idPublicacion !== idPublicacion);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Limpia todo el carrito
  clearCart: () => {
    localStorage.removeItem('cart');
  },

  // Obtiene el carrito actual
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  // Calcula el costo total
  calculateTotal: () => {
    const cart = carritoService.getCart();
    return cart.reduce((total, item) => total + item.precio, 0);
  },

  // Obtiene la cantidad de items en el carrito
  getCartCount: () => {
    const cart = carritoService.getCart();
    return cart.length;
  },

  // Verifica si una publicación está en el carrito
  isInCart: (idPublicacion) => {
    const cart = carritoService.getCart();
    return cart.some((item) => item.idPublicacion === idPublicacion);
  }
};

export default carritoService;