import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IElementDimensions } from '../../interface/IElementDimensions';


@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class SideNavService {

  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  private toggleSidebar = new BehaviorSubject<boolean>(false);
  private bodyDims = new BehaviorSubject<IElementDimensions>({ height: 0, width: 0 });
  private verticalViewHeight  = new BehaviorSubject<number>(0);
  public sidebarToggleStatus$ = this.toggleSidebar.asObservable();

  private toggleTheme = new BehaviorSubject<boolean>(false);
  public themeToggleStatus$ = this.toggleTheme.asObservable();

  constructor() { }

  changeSidebarStatus(_toggle: boolean) {
    this.toggleSidebar.next(_toggle);
  }

  changeThemeStatus(_toggle: boolean) {
    this.toggleTheme.next(_toggle);
  }



  // bodyDims Getters & Setters
  public set setBodyDims(dims: IElementDimensions) {
    this.bodyDims.next(dims);
  }
  public get getBodyDims() {
    return this.bodyDims;
  }

  // verticalViewHeight Getters & Setters
  public set setVerticalViewHeight(height: number) {
    this.verticalViewHeight.next(height);
  }
  public get getVerticalViewHeight() {
    return this.verticalViewHeight;
  }
}
