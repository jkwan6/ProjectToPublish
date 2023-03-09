import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SideNavService } from '../../service/SideNavService';

@Component({
  selector: 'app-body-content',
  templateUrl: './body-content.component.html',
  styleUrls: ['./body-content.component.css']
})
export class BodyContentComponent implements AfterViewInit {

  @ViewChild(MatDrawer) matDrawer!: MatDrawer;

  constructor(private sideNavService: SideNavService) { }

  showFiller = false;
  subscription!: Subscription;
  toggleStatus!: boolean;

  ngAfterViewInit(): void {
    this.subscription = this.sideNavService.currentToggleStatus$.subscribe(x => this.matDrawer.toggle(x.valueOf()))
  }


}
