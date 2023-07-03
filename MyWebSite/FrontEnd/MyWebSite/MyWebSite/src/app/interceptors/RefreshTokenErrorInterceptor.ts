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


  tryAttempts!: number;

  constructor(
    private authStateService: AuthenticationService,
    private http: HttpClient
  ) {
    this.tryAttempts = Date.now();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.tryAttempts =  Date.now() - this.tryAttempts;
    if (this.tryAttempts > 0 && this.tryAttempts < 50 * 1000) { return next.handle(req); }  // To prevent recursion
    else {
      this.tryAttempts = Date.now();
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status != 401) { return next.handle(req) }    // Early Return
          if (this.authStateService.$authState.getValue() === false) { throwError(error); }
          const url = environment.baseUrl + 'api/authentication/refreshtoken';
          return this.http.post<IRefreshResult>(url, {}).pipe(
            switchMap((results: IRefreshResult) => {
              const token = results.accessToken;
              localStorage.setItem('token', token);
              req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
              this.authStateService.refreshTokenInnerLogic(results);
              console.log(4);
              return next.handle(req);
            }),
            catchError((refreshError: any) => {
              // Handle any error that occurred during token refreshing
              // For example, redirect to login page or show an error message
              this.authStateService.logout();
              return throwError(refreshError);
            })
          );
        })
      )
    }
  }
}

