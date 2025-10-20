// Servicio de autenticación - Manejo de login, registro y token

const authService = {

    /** 
     * Metodos en este archivo:
     * 
     * Login - Autentica al usuario y guarda el token
     * Register - Registra un nuevo usuario
     * Logout - Elimina el token y datos del usuario
     * 
     * setToken - guarda token en Local
     * getToken - obtiene token de local
     * isAuthenticated - ve si hay un token guardado
     * setUserData - guarda datos del user en local
     * getUserData - obtiene datos del user de local
     * 
    */

  login: (email, password) => {

    return (
        fetch('http://localhost:4002/api/v1/auth/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }) })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 403) { throw new Error('Credenciales incorrectas') }
                throw new Error('Error al iniciar sesión') 
            }
            
            return response.json() })
        .then((data) => {
            authService.setToken(data.access_token);
            return data })
        .catch((error) => {
            throw error })
        
        )
  },

  register: (email, password, firstname, lastname, telefono, role = 'USER') => {

    return (
        fetch('http://localhost:4002/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                firstname,
                lastname,
                role,
                telefono
            }) })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 403) { throw new Error('El email ya está registrado') }
                throw new Error('Error al registrar usuario')
            }

            return response.json() })
        .then((data) => {
            authService.setToken(data.access_token);
            return data })
        .catch((error) => {
            throw error })

        )
  },



  // Logout - Elimina el token y datos del usuario
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  },

  

  // Guarda token en local
  setToken: (token) => {
    localStorage.setItem('access_token', token);
  },

  // Devuelve token del local
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  // Verifica si hay un token guardado
  isAuthenticated: () => {
    const token = authService.getToken();
    return token !== null && token !== undefined && token !== '';
  },

  // Guarda datos del usuario en local
  setUserData: (userData) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
  },

  // Obtener datos del usuario del local
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
};

export default authService;
