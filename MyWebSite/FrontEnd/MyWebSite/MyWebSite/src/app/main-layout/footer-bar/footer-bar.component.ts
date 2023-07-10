import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../service/AuthenticationService/AuthenticationService';
import { SideNavService } from '../../service/SideNavService/SideNavService';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.css']
})
export class FooterBarComponent implements OnInit {

  vm = this;  // Variable used in the HTML Template
  isPressed: boolean = false;
  isLoggedIn!: boolean;

  showDelay = new FormControl(500);
  hideDelay = new FormControl(0);

  toggleStatus!: boolean;
  subscription: Subscription = new Subscription;
  constructor(
    private sideNavService: SideNavService
  ) { };

  ngOnInit(): void {
    this.subscription.add(
      this.sideNavService.themeToggleStatus$.subscribe(toggleStatus => this.toggleStatus = toggleStatus))
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onToggle() {
    if (this.toggleStatus) {
      this.sideNavService.changeThemeStatus(false)
      this.toggleStatus = false;
    }
    else {
      this.sideNavService.changeThemeStatus(true)
      this.toggleStatus = true;
    }
  }

}
