/**
 * Base problem details class following RFC 7807 standard
 * https://tools.ietf.org/html/rfc7807
 */
export interface ProblemDetailsOptions {
  status?: number;
  title?: string;
  type?: string;
  detail?: string;
  instance?: string;
  extensions?: Record<string, unknown>;
}

export class ProblemDetails {
  status?: number;
  title?: string;
  type?: string;
  detail?: string;
  instance?: string;
  [key: string]: unknown;

  constructor(options: ProblemDetailsOptions = {}) {
    this.status = options.status;
    this.title = options.title;
    this.type = options.type;
    this.detail = options.detail;
    this.instance = options.instance;

    if (options.extensions) {
      Object.entries(options.extensions).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  withExceptionDetails(propertyName: string, error: Error, details?: Record<string, unknown>): this {
    this[propertyName] = {
      message: error.message,
      stack: error.stack,
      ...(details || {})
    };
    return this;
  }
}

export class ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>, options: ProblemDetailsOptions = {}) {
    const defaultCode = 422;
    super({
      status: options.status || defaultCode,
      title: options.title || 'Validation Failed',
      type: options.type || ProblemDetailsConfig.getTypeForStatusCode(defaultCode),
      ...options
    });
    this.errors = errors;
  }
}

/**
 * Static configuration for Problem Details
 */
export class ProblemDetailsConfig {
  /**
   * Get the type URI for a status code
   */
  public static getTypeForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 400: return 'https://tools.ietf.org/html/rfc7231#section-6.5.1';
      case 401: return 'https://tools.ietf.org/html/rfc7235#section-3.1';
      case 403: return 'https://tools.ietf.org/html/rfc7231#section-6.5.3';
      case 404: return 'https://tools.ietf.org/html/rfc7231#section-6.5.4';
      case 405: return 'https://tools.ietf.org/html/rfc7231#section-6.5.5';
      case 409: return 'https://tools.ietf.org/html/rfc7231#section-6.5.8';
      case 422: return 'https://tools.ietf.org/html/rfc4918#section-11.2';
      case 500: return 'https://tools.ietf.org/html/rfc7231#section-6.6.1';
      case 501: return 'https://tools.ietf.org/html/rfc7231#section-6.6.2';
      case 503: return 'https://tools.ietf.org/html/rfc7231#section-6.6.4';
      default: return `https://httpstatuses.com/${statusCode}`;
    }
  }
}
