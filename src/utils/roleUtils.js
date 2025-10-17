// Utilidades para verificar roles de usuario

/**
 * Verifica si un usuario tiene rol de ADMIN
 * @param {Object} user - Objeto de usuario
 * @returns {boolean} - True si el usuario es ADMIN
 */
export const isAdmin = (user) => {
    return user && user.rol === 'ADMIN';
};

/**
 * Verifica si un usuario tiene rol de USER
 * @param {Object} user - Objeto de usuario
 * @returns {boolean} - True si el usuario es USER
 */
export const isUser = (user) => {
    return user && user.rol === 'USER';
};

/**
 * Verifica si un usuario tiene uno de los roles especificados
 * @param {Object} user - Objeto de usuario
 * @param {Array<string>} roles - Array de roles a verificar
 * @returns {boolean} - True si el usuario tiene alguno de los roles
 */
export const hasRole = (user, roles) => {
    return user && roles.includes(user.rol);
};
