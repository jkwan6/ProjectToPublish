import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SideNavService } from './service/SideNavService/SideNavService';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private sideNavService: SideNavService) { }
  subscription!: Subscription;
  ngOnInit(): void {

    let sideBarContainer: HTMLDivElement = document.querySelector('.LayoutFlexContainer')!;
    this.subscription = this.sideNavService.themeToggleStatus$.subscribe(x => {
      if (!x) {
        sideBarContainer.classList.add('dark-theme');
      }
      else {
        sideBarContainer.classList.remove('dark-theme');
      }
    })
  }



}
