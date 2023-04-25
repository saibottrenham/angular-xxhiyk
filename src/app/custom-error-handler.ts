import { ErrorHandler } from '@angular/core';

export class CustomErrorHandler extends ErrorHandler {
  handleError(error: any): void {
    // Handle the error
    console.error('Custom Error Handler:', error);
  }
}