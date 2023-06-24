import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthStateService } from '../../service/AuthStateService/AuthStateService';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nav-bar-menu',
  templateUrl: './nav-bar-menu.component.html',
  styleUrls: ['./nav-bar-menu.component.css']
})
export class NavBarMenuComponent implements OnInit {

  vm = this;  // Variable used in the HTML Template
  isPressed: boolean = false;
  isLoggedIn!: boolean;

  showDelay = new FormControl(500);
  hideDelay = new FormControl(0);

  toggleStatus!: boolean;
  subscription!: Subscription;
  constructor(
    public dialog: MatDialog,
    private sideNavService: SideNavService,
    private authStateService: AuthStateService,

  ) {
    authStateService.$loginState.subscribe(results => this.isLoggedIn = results);
  }

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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog)
  }
}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'log-out-confirmation-dialog.html',
  styleUrls: ['./nav-bar-menu.component.css']
})
export class DialogAnimationsExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
    private authStateService: AuthStateService,
  ) { }

  onLogOut() {
    this.authStateService.logout();
  }
}
