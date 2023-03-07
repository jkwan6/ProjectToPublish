import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavBarMenuComponent } from './nav-bar-menu/nav-bar-menu.component';
import { AngularMaterialModule } from './app-material.module'
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './home-page/home-page.component';
import { LogInSignUpComponent } from './log-in-sign-up/log-in-sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarMenuComponent,
    HomePageComponent,
    LogInSignUpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
