import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, retry, switchMap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { IRefreshResult } from "../interface/IRefreshResult";
import { AuthStateService } from "../service/AuthStateService/AuthStateService";

@Injectable()

export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(
    private authStateService: AuthStateService,
    private http: HttpClient
  ) {
    //this.authStateService.$loginState.subscribe(results => console.log(results))
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          var url = environment.baseUrl + 'api/authentication/refreshtoken'
          return this.http.post<IRefreshResult>(url, {})
            .pipe(
              switchMap((results => {
                var token = results.accessToken;
                localStorage.setItem("token", token)

                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                });
                return next.handle(req)
              }))
            );
        }
        return throwError(error);
      })
    );
  }
}
