import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SideNavService } from '../../service/SideNavService';

@Component({
  selector: 'app-nav-bar-menu',
  templateUrl: './nav-bar-menu.component.html',
  styleUrls: ['./nav-bar-menu.component.css']
})
export class NavBarMenuComponent implements OnInit {

  vm = this;
  isPressed: boolean = false;

  showDelay = new FormControl(500);
  hideDelay = new FormControl(0);

  toggleStatus!: boolean;
  subscription!: Subscription;
  constructor(private sideNavService: SideNavService) { }

  ngOnInit(): void {
    this.subscription = this.sideNavService.currentToggleStatus$.subscribe(toggleStatus => this.toggleStatus = toggleStatus)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onToggle() {
    if (this.toggleStatus) {
      this.sideNavService.changeToggleStatus(false)
      this.toggleStatus = false;
    }
    else {
      this.sideNavService.changeToggleStatus(true)
      this.toggleStatus = true;
    }
  }

}
