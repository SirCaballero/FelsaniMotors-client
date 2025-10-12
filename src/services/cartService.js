// cartService.js
// Servicio para manejar el carrito de compras - Similar a authService.js
// Almacena el carrito en localStorage para persistencia simple
// Items del carrito: objetos con idPublicacion, titulo, marcaAuto, modeloAuto, precio, etc.

const cartService = {
  /**
   * Métodos en este archivo:
   * 
   * addToCart - Agrega un auto (publicación) al carrito
   * removeFromCart - Elimina un auto del carrito por idPublicacion
   * clearCart - Limpia todo el carrito
   * getCart - Obtiene el carrito actual
   * calculateTotal - Calcula el costo total del carrito
   */

  // Agrega un item al carrito (si ya existe, incrementa cantidad; por simplicidad, asumo 1 por item único)
  addToCart: (item) => {
    const cart = cartService.getCart();
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.idPublicacion === item.idPublicacion);
    
    if (existingItemIndex > -1) {
      // Si ya existe, incrementa cantidad (agrega soporte para cantidad si es necesario)
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      // Nuevo item
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Elimina un item del carrito por idPublicacion
  removeFromCart: (idPublicacion) => {
    let cart = cartService.getCart();
    cart = cart.filter((item) => item.idPublicacion !== idPublicacion);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Limpia todo el carrito
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },

  // Obtiene el carrito actual
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  // Calcula el costo total (precio * cantidad por item)
  calculateTotal: () => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + (item.precio * (item.quantity || 1)), 0);
  },

  // Obtiene la cantidad total de items en el carrito (para badge en Navbar)
  getCartCount: () => {
    const cart = cartService.getCart();
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }
};

export default cartService;