import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class SideNavService {

  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  private toggle = new BehaviorSubject<boolean>(false);
  public currentToggleStatus$ = this.toggle.asObservable();

  constructor() { }

  changeToggleStatus(_toggle: boolean) {
    this.toggle.next(_toggle);
  }

}
