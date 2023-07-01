import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, first, map, Observable, of, Subject, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILoginRequest } from '../../interface/ILoginRequest';
import { ILoginResult } from '../../interface/ILoginResult';
import { IRefreshResult } from '../../interface/IRefreshResult';
import { ISignUpRequest } from '../../interface/ISignUpRequest';
import { BaseRepository } from '../../repository/BaseRepository';

@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class AuthenticationService implements OnInit{

  // EMMITTERS
  localStoragePresent!: BehaviorSubject<boolean>;
  private _authState!: BehaviorSubject<boolean>;

  // URL Endpoints
  private baseUrl: string = 'api/authentication/';
  private endpoints: { login: string, signup: string, refresh: string, logout: string } =
    { login: 'login', signup: "signin", refresh: "refreshtoken", logout: "revoke-token" };

  // GETTERS
  public get $authState() {  // Returning a BehaviourSubject.
    return this._authState;
  }

  constructor(
    private _loginRepository: BaseRepository<ILoginRequest>,
    private _signupRepository: BaseRepository<ISignUpRequest>,
    private _logoutRepository: BaseRepository<null>,
    private _refreshRepository: BaseRepository<null>
  ) {
    this.localStoragePresent = new BehaviorSubject<boolean>(false);
    this.updateLoginState();
    this._authState = this.localStoragePresent;
  }

  ngOnInit() {
  }

  $signup(signUpRequest: ISignUpRequest): Observable<any> {
    var url = environment.baseUrl + this.baseUrl + this.endpoints.signup;
    var $signup = this._signupRepository.PostItem(url, signUpRequest);
    return $signup.pipe(
      map(results => {
        console.log(results);
      }),
      first()
    );
  }

  $login(loginRequest: ILoginRequest): Observable<ILoginResult> {
    var url = environment.baseUrl + this.baseUrl + this.endpoints.login;
    var login = this._loginRepository.PostItem(url, loginRequest);
    var castedLogin: Observable<ILoginResult> = login
      .pipe(
        map(results => {
          var castedResults = results as any;
          castedResults = castedResults as ILoginResult;
          localStorage.setItem("token", castedResults.token);
          this.localStoragePresent.next(true);
          this.startRefreshTokenTimer();
          return castedResults;
        }),
        first()                                                           // Unsubscribes Automatically
      );
    return castedLogin;
  }

  logout() {
    localStorage.removeItem("token");
    this.updateLoginState();
    var url = environment.baseUrl + this.baseUrl + this.endpoints.logout;       // Revokes the Refresh Token
    this.stopRefreshTokenTimer();
    var $logout = this._logoutRepository.PostItem(url, null).pipe(first());     // Unsubscribes Automatically
    $logout.subscribe();
  }

  // #region RefreshToken Logic
  //refresh() {
  //  var url = environment.baseUrl + this.baseUrl + this.endpoints.refresh;
  //  var $refresh = this._refreshRepository.PostItem(url, null);
  //  $refresh.pipe(
  //    map((results => {
  //      var parsedResult = results as any;
  //      parsedResult = parsedResult as IRefreshResult;
  //      var token = parsedResult.accessToken;
  //      localStorage.setItem("token", token)
  //    }),
  //      first()
  //    )).subscribe();
  //}

  refreshToken(): Observable<any> {
    var url = environment.baseUrl + this.baseUrl + this.endpoints.refresh;
    return this._refreshRepository.PostItem(url, null)
      .pipe(map((results) => {
        this.refreshTokenInnerLogic(results as any)
        return results;
      },
        first()
      ));
  }

  refreshTokenInnerLogic(accessToken: any) {
    var parsedResult = accessToken as any;
    parsedResult = parsedResult as IRefreshResult;
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
    console.log(timeout)
    this.refreshTokenTimeout = Number(setTimeout(() => this.refreshToken().subscribe(), timeout));
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  // #endregion

  // When this gets called, updates loginState based on localStorage
  // Automatically emmits event to subscriber
  updateLoginState() {
    this.localStoragePresent.next((localStorage.getItem('token') != null) ? true : false);
  }

}
