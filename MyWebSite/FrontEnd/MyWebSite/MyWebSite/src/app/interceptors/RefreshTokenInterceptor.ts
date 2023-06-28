import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, finalize, Observable, retry, switchMap, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { IRefreshResult } from "../interface/IRefreshResult";
import { AuthenticationService } from "../service/AuthenticationService/AuthenticationService";

@Injectable()

export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(
    private authStateService: AuthenticationService,
    private http: HttpClient
  ) {
    //this.authStateService.$loginState.subscribe(results => console.log(results))
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const url = environment.baseUrl + 'api/authentication/refreshtoken';
          return this.http.post<IRefreshResult>(url, {}).pipe(
            switchMap((results: IRefreshResult) => {
              const token = results.accessToken;
              localStorage.setItem('token', token);

              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next.handle(req);
            }),
            catchError(() => {
              // Handle the error silently without propagating it further
              return EMPTY;
            }),
            finalize(() => {
              return EMPTY;
              // Perform any cleanup or additional logic after the request is completed
            })
          );
        }

        // Handle other errors silently without propagating them further
        return EMPTY;
      }),
      tap({
        error: () => {
          return EMPTY;
          // Handle the error silently without logging to the console
          // This tap operator ensures that the error is not propagated to the subscribers
        }
      })
    );
  }
}
