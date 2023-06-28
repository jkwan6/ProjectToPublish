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

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(1)

        if (error.status === 401) {
          var authState = this.authStateService.$authState.getValue();
          if (authState) {
            this.authStateService.refreshToken().subscribe();
          }
        }
        return next.handle(req)
      }))
  }
}
