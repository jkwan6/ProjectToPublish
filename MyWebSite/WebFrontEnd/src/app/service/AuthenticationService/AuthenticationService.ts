import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, first, map, Observable, of, Subject, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ILoginRequest } from '../../interface/ILoginRequest';
import { ILoginResult } from '../../interface/ILoginResult';
import { IRefreshResult } from '../../interface/IRefreshResult';
import { ISignUpRequest } from '../../interface/ISignUpRequest';
import { BaseRepository } from '../../repository/BaseRepository';
import { IAuthEndpoints } from './AuthTypes';

@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class AuthenticationService implements OnInit{

  // URL Endpoints
  private registerBaseUrl: string = 'api/register/';
  private loginBaseUrl: string = 'connect/';
  private endpoints: IAuthEndpoints =
    {
      login: 'token',
      signup: "register",
      refresh: "refreshtoken",
      logout: "revoke-token"
    };

  // EMMITTERS
  tokenPresentInLocalStorage!: BehaviorSubject<boolean>;

  // GETTERS
  private _authState!: BehaviorSubject<boolean>;
  public get $authState() {  // Returning a BehaviourSubject.
    return this._authState;
  }

  constructor(
    private _loginRepository: BaseRepository<ILoginRequest, ILoginResult>,
    private _signupRepository: BaseRepository<ISignUpRequest, ISignUpRequest>,
    private _logoutRepository: BaseRepository<null, null>,
    private _refreshRepository: BaseRepository<null, IRefreshResult>
  ) {
    this.tokenPresentInLocalStorage = new BehaviorSubject<boolean>(false);
    this.updateLoginState();
    this._authState = this.tokenPresentInLocalStorage;
  }

  ngOnInit() {
  }

  $signup(signUpRequest: ISignUpRequest): Observable<any> {
    var url = environment.baseUrl + this.registerBaseUrl + this.endpoints.signup;
    var $signup = this._signupRepository.PostItem(url, signUpRequest);
    console.log(1);
    //var test = $signup.pipe(
    //  map(results => {
    //    console.log(results);
    //  }),
    //  first()
    //);
    return $signup;
  }

  $login(loginRequest: ILoginRequest): Observable<ILoginResult> {
    var url = environment.baseUrl + this.loginBaseUrl + this.endpoints.login;
    var login = this._loginRepository.PostItem(url, loginRequest);
    var castedLogin: Observable<ILoginResult> = login
      .pipe(
        map(results => {
          var castedResults = results;
          localStorage.setItem("token", castedResults.token);
          this.tokenPresentInLocalStorage.next(true);
          this.startRefreshTokenTimer();
          return castedResults;
        }),
        first()                                                                 // Unsubscribes Automatically
      );
    return castedLogin;
  }

  logout() {
    var url = environment.baseUrl + this.registerBaseUrl + this.endpoints.logout;       // Revokes the Refresh Token
    this.stopRefreshTokenTimer();
    if (localStorage.getItem("token")) {
      var $logout = this._logoutRepository.PostItem(url, null).pipe(first());   // Unsubscribes Automatically
      $logout.subscribe();
      localStorage.removeItem("token");
      this.updateLoginState();
    }
  }

  refreshToken(): Observable<any> {
    var url = environment.baseUrl + this.registerBaseUrl + this.endpoints.refresh;
    return this._refreshRepository.PostItem(url, null)
      .pipe(map((results) => {
        this.refreshTokenInnerLogic(results)
        return results;
      },
        first()
      ));
  }

  refreshTokenInnerLogic(accessToken: IRefreshResult) {
    var parsedResult = accessToken
    var token = parsedResult.accessToken;
    localStorage.setItem("token", token)
    this.startRefreshTokenTimer();
    this.updateLoginState();
  }

  private refreshTokenTimeout?: number;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtBase64 = localStorage.getItem("token")!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64!));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = (expires.getTime() - Date.now()) * 0.75;
    this.refreshTokenTimeout = Number(setTimeout(() => this.refreshToken().subscribe(), timeout));
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  // When this gets called, updates loginState based on localStorage
  // Automatically emmits event to subscriber
  updateLoginState() {
    this.tokenPresentInLocalStorage.next((localStorage.getItem('token') != null) ? true : false);
  }

}
