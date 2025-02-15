import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>
): Observable<HttpEvent<unknown>> => {
  const messageService = inject(MessageService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Si è verificato un errore';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Errore: ${error.error.message}`;
      } else {
        errorMessage = `Errore ${error.status}: ${error.message}`;
      }
      messageService.add({
        severity: 'error',
        summary: 'Errore',
        detail: errorMessage,
        life: 3000
      });

      return throwError(() => error);
    })
  );
};
