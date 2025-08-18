// ===== src/utils/apiResponse.js =====
import { HTTP_STATUS } from '../config/constants.js';

export class ApiResponse {
  static success(data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  static error(message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return {
      success: false,
      message,
      errors,
      statusCode
    };
  }

  static validationError(errors, message = 'Errores de validación') {
    return {
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY
    };
  }

  static unauthorized(message = 'No autorizado') {
    return {
      success: false,
      message,
      statusCode: HTTP_STATUS.UNAUTHORIZED
    };
  }

  static forbidden(message = 'Acceso denegado') {
    return {
      success: false,
      message,
      statusCode: HTTP_STATUS.FORBIDDEN
    };
  }

  static notFound(message = 'Recurso no encontrado') {
    return {
      success: false,
      message,
      statusCode: HTTP_STATUS.NOT_FOUND
    };
  }

  static conflict(message = 'Conflicto de recursos') {
    return {
      success: false,
      message,
      statusCode: HTTP_STATUS.CONFLICT
    };
  }
}


