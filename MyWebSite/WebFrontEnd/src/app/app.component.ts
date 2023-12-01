import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EventTypes,
  OidcSecurityService,
  PublicEventsService,
} from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { SideNavService } from './service/SideNavService/SideNavService';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private sideNavService: SideNavService,
    private eventService: PublicEventsService,
    public oidcSecurityService: OidcSecurityService) { }

  subscription!: Subscription;


  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(
        ({ isAuthenticated, userData, accessToken, idToken, configId }) => {
          console.log('app authenticated', isAuthenticated);
          console.log(`Current access token is '${accessToken}'`);
        }
      );

    this.eventService
      .registerForEvents()
      .pipe(
        filter(
          (notification) =>
            notification.type === EventTypes.CheckSessionReceived
        )
      )
      .subscribe((value) =>
        console.log('CheckSessionReceived with value from app', value)
      );

    let sideBarContainer: HTMLDivElement = document.querySelector('.LayoutFlexContainer')!;
    this.subscription = this.sideNavService.$themeLocalStorage.subscribe(results => {
      console.log(`results: ${results}`)
      if (results) {
        sideBarContainer.classList.add('dark-theme');
      }
      else {
        sideBarContainer.classList.remove('dark-theme');
      }
    })
  }
}
