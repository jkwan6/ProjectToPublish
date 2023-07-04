import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBodyDimensions } from '../../interface/IBodyDimensions';


@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class SideNavService {

  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  private toggle = new BehaviorSubject<boolean>(false);
  private bodyDims = new BehaviorSubject<IBodyDimensions>({height: 0, width: 0});
  public currentToggleStatus$ = this.toggle.asObservable();

  constructor() { }

  changeToggleStatus(_toggle: boolean) {
    this.toggle.next(_toggle);
  }

  public set setBodyDims(dims: IBodyDimensions) {
    this.bodyDims.next(dims);
  }
  public get getBodyDims() {
    return this.bodyDims;
  }
}
