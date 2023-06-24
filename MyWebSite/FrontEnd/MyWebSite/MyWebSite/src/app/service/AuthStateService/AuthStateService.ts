import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, first, map, Observable, of, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})
export class AuthStateService implements OnInit{

  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  localStoragePresent!: BehaviorSubject<boolean>;
  private _loginState!: BehaviorSubject<boolean>;
  public get $loginState() {
    return this._loginState;
  }

  constructor(
    private httpClient: HttpClient
  ) {
    this.localStoragePresent = new BehaviorSubject<boolean>(false);
    this.updateLoginState();
    this._loginState = this.localStoragePresent;
  }

  updateLoginState() {
    this.localStoragePresent.next((localStorage.getItem('token') != null) ? true : false);
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem("token");
    const logOutUrl = 'api/Authentication/revoke-token'
    var url = environment.baseUrl + logOutUrl;
    var queryable = this.httpClient.post<any>(url, null).pipe(first());
    queryable.subscribe();
  }

}
