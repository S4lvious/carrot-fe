import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
export const authenticationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
    HttpHandlerFn) => {
            const token = localStorage.getItem('token');
            if (token) {
                const cloned = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`)
                  });
                  return next(cloned);
                      }
              return next(req);
    }
