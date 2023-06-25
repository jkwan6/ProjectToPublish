import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, throwError } from "rxjs";
import { AuthStateService } from "../service/AuthStateService/AuthStateService";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authStateService: AuthStateService
  ) {
    //this.authStateService.$loginState.subscribe(results => console.log(results))
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authStateService.updateLoginState();

    var token = localStorage.getItem("token");

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}

