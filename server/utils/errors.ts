export class BaseError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(500, `Database error: ${message}`);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(401, message);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string) {
    super(403, message);
  }
}
