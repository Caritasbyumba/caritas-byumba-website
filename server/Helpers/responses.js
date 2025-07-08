// Standard response helper functions
// This file provides consistent API response formats

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {object|array} data - Data to send in response
 */
export const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      results: data
    });
  };
  
  /**
   * Send an error response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {string} message - Error message
   * @param {object} errors - Additional error details
   */
  export const errorResponse = (res, statusCode = 500, message = 'Server Error', errors = {}) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  };
  
  /**
   * Send a not found response
   * @param {object} res - Express response object
   * @param {string} message - Not found message
   */
  export const notFoundResponse = (res, message = 'Resource not found') => {
    return errorResponse(res, 404, message);
  };
  
  /**
   * Send a validation error response
   * @param {object} res - Express response object
   * @param {string} message - Validation error message
   * @param {object} errors - Validation errors
   */
  export const validationErrorResponse = (res, message = 'Validation Error', errors = {}) => {
    return errorResponse(res, 400, message, errors);
  };
  
  /**
   * Send an unauthorized response
   * @param {object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  export const unauthorizedResponse = (res, message = 'Unauthorized') => {
    return errorResponse(res, 401, message);
  };
  
  export default {
    successResponse,
    errorResponse,
    notFoundResponse,
    validationErrorResponse,
    unauthorizedResponse
  };