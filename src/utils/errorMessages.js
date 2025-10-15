/**
 * Constantes de mensajes de error para FelsaniMotors
 * Mapea las excepciones del backend a mensajes amigables para el usuario
 */
import { useState } from 'react';

// Mensajes de error para Autenticación y Login
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos. Por favor, verifica tus datos.',
  USER_NOT_FOUND: 'No existe una cuenta con ese correo electrónico.',
  INVALID_TOKEN: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  TOKEN_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  AUTHENTICATION_REQUIRED: 'Debes iniciar sesión para continuar.',
};

// Mensajes de error para Usuarios
export const USER_ERRORS = {
  USER_NOT_FOUND: 'Usuario no encontrado.',
  USER_DUPLICATE: 'Ya existe una cuenta con ese correo electrónico.',
  INVALID_EMAIL: 'El formato del correo electrónico no es válido.',
  WEAK_PASSWORD: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números.',
};

// Mensajes de error para Comentarios
export const COMMENT_ERRORS = {
  COMMENT_INVALID: 'El comentario no puede estar vacío.',
  COMMENT_NOT_FOUND: 'Comentario no encontrado.',
  COMMENT_NOT_FOUND_EXCEPTION: 'El comentario que buscas no existe.',
  UNAUTHORIZED_COMMENT: 'No puedes modificar comentarios de otros usuarios.',
  COMMENT_TOO_LONG: 'El comentario es demasiado largo. Máximo 500 caracteres.',
};

// Mensajes de error para Fotos
export const PHOTO_ERRORS = {
  PHOTO_NOT_FOUND: 'Foto no encontrada.',
  INVALID_FILE_FORMAT: 'Formato de archivo no válido. Solo se permiten imágenes JPG, PNG o WebP.',
  FILE_TOO_LARGE: 'La imagen es demasiado grande. Tamaño máximo: 5MB.',
  UPLOAD_FAILED: 'Error al subir la imagen. Por favor, intenta nuevamente.',
};

// Mensajes de error para Autos/Publicaciones
export const AUTO_ERRORS = {
  AUTO_NOT_FOUND: 'El vehículo no fue encontrado.',
  AUTO_DUPLICATE: 'Ya existe una publicación con ese vehículo.',
  INVALID_PRICE: 'El precio debe ser un valor positivo.',
  INVALID_YEAR: 'El año del vehículo no es válido.',
  REQUIRED_FIELDS: 'Por favor, completa todos los campos obligatorios.',
};

// Mensajes de error para Transacciones
export const TRANSACTION_ERRORS = {
  TRANSACTION_INVALID: 'Error al procesar la transacción.',
  TRANSACTION_NOT_FOUND: 'Transacción no encontrada.',
  INSUFFICIENT_FUNDS: 'Fondos insuficientes para completar la transacción.',
  TRANSACTION_NOT_ENCONTRADA: 'La transacción no fue encontrada.',
};

// Mensajes de error genéricos
export const GENERIC_ERRORS = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
  TIMEOUT: 'La solicitud tardó demasiado. Por favor, intenta nuevamente.',
  CONTRASEÑA_INCORRECTA: 'La contraseña actual es incorrecta.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido de vuelta!',
  REGISTER_SUCCESS: '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.',
  COMMENT_ADDED: 'Comentario agregado correctamente.',
  COMMENT_UPDATED: 'Comentario actualizado correctamente.',
  COMMENT_DELETED: 'Comentario eliminado correctamente.',
  AUTO_CREATED: '¡Publicación creada exitosamente!',
  AUTO_UPDATED: 'Publicación actualizada correctamente.',
  AUTO_DELETED: 'Publicación eliminada correctamente.',
  PHOTO_UPLOADED: 'Foto subida correctamente.',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente.',
};

// Mensajes informativos
export const INFO_MESSAGES = {
  LOADING: 'Cargando...',
  PROCESSING: 'Procesando tu solicitud...',
  VERIFICATION_SENT: 'Enviamos un email de verificación a tu correo.',
  CHECK_EMAIL: 'Revisa tu correo electrónico para continuar.',
};

/**
 * Mapea el error del backend a un mensaje amigable
 * @param {Error} error - El objeto error del backend
 * @returns {Object} - Objeto con mensaje y tipo de error
 */
export const getErrorMessage = (error) => {
  // Si no hay error, retornar null
  if (!error) return null;

  // Si el error ya tiene un mensaje custom, usarlo
  if (error.customMessage) {
    return {
      message: error.customMessage,
      type: error.type || 'error'
    };
  }

  // Obtener el mensaje de error del response
  const errorMessage = error.response?.data?.message || error.message || '';
  const statusCode = error.response?.status;

  // Mapear por código de estado HTTP
  switch (statusCode) {
    case 400:
      return {
        message: GENERIC_ERRORS.VALIDATION_ERROR,
        type: 'error'
      };
    case 401:
      return {
        message: AUTH_ERRORS.AUTHENTICATION_REQUIRED,
        type: 'warning'
      };
    case 403:
      return {
        message: AUTH_ERRORS.UNAUTHORIZED,
        type: 'error'
      };
    case 404:
      // Detectar tipo de recurso no encontrado
      if (errorMessage.toLowerCase().includes('usuario')) {
        return { message: USER_ERRORS.USER_NOT_FOUND, type: 'error' };
      }
      if (errorMessage.toLowerCase().includes('comentario')) {
        return { message: COMMENT_ERRORS.COMMENT_NOT_FOUND, type: 'error' };
      }
      if (errorMessage.toLowerCase().includes('foto')) {
        return { message: PHOTO_ERRORS.PHOTO_NOT_FOUND, type: 'error' };
      }
      if (errorMessage.toLowerCase().includes('auto') || errorMessage.toLowerCase().includes('vehículo')) {
        return { message: AUTO_ERRORS.AUTO_NOT_FOUND, type: 'error' };
      }
      if (errorMessage.toLowerCase().includes('transacción') || errorMessage.toLowerCase().includes('transaccion')) {
        return { message: TRANSACTION_ERRORS.TRANSACTION_NOT_FOUND, type: 'error' };
      }
      return { message: GENERIC_ERRORS.UNKNOWN_ERROR, type: 'error' };
    
    case 409:
      // Conflicto - duplicado
      if (errorMessage.toLowerCase().includes('usuario')) {
        return { message: USER_ERRORS.USER_DUPLICATE, type: 'warning' };
      }
      if (errorMessage.toLowerCase().includes('auto')) {
        return { message: AUTO_ERRORS.AUTO_DUPLICATE, type: 'warning' };
      }
      return { message: 'El recurso ya existe.', type: 'warning' };
    
    case 500:
      return {
        message: GENERIC_ERRORS.SERVER_ERROR,
        type: 'error'
      };
    
    default:
      break;
  }

  // Mapear por palabras clave en el mensaje de error
  const lowerMessage = errorMessage.toLowerCase();

  // Errores de autenticación
  if (lowerMessage.includes('credencial') || lowerMessage.includes('contraseña incorrecta')) {
    return { message: AUTH_ERRORS.INVALID_CREDENTIALS, type: 'error' };
  }
  if (lowerMessage.includes('token') || lowerMessage.includes('sesión')) {
    return { message: AUTH_ERRORS.TOKEN_EXPIRED, type: 'warning' };
  }

  // Errores de comentarios
  if (lowerMessage.includes('comentario inválido') || lowerMessage.includes('comentario vacío')) {
    return { message: COMMENT_ERRORS.COMMENT_INVALID, type: 'error' };
  }

  // Errores de fotos
  if (lowerMessage.includes('formato') || lowerMessage.includes('archivo')) {
    return { message: PHOTO_ERRORS.INVALID_FILE_FORMAT, type: 'error' };
  }
  if (lowerMessage.includes('tamaño') || lowerMessage.includes('grande')) {
    return { message: PHOTO_ERRORS.FILE_TOO_LARGE, type: 'error' };
  }

  // Errores de validación
  if (lowerMessage.includes('email') || lowerMessage.includes('correo')) {
    return { message: USER_ERRORS.INVALID_EMAIL, type: 'error' };
  }

  // Error de red
  if (error.code === 'ERR_NETWORK' || lowerMessage.includes('network')) {
    return { message: GENERIC_ERRORS.NETWORK_ERROR, type: 'error' };
  }

  // Si hay un mensaje del backend, mostrarlo
  if (errorMessage) {
    return { message: errorMessage, type: 'error' };
  }

  // Error por defecto
  return {
    message: GENERIC_ERRORS.UNKNOWN_ERROR,
    type: 'error'
  };
};

/**
 * Hook personalizado para manejar errores
 * @returns {Object} - Funciones y estado para manejar errores
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    const errorInfo = getErrorMessage(err);
    setError(errorInfo);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    setError: handleError,
    clearError,
    hasError: !!error
  };
};
