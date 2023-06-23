import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class AuthStateService {

  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  private _loginState!: boolean;
  public get loginState() {
    let loginPresent: boolean = (localStorage.getItem('token') != null) ? true : false;
    loginPresent ? this._loginState = true : this._loginState = false;
    return this._loginState;
  }

  constructor() {
    this.loginState;
  }


  logout() {

  }

}
