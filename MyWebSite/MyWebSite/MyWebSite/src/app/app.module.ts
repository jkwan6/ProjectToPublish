import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './app-material.module';
import { NavBarMenuComponent } from './Layout/nav-bar-menu/nav-bar-menu.component';
import { FooterBarComponent } from './Layout/footer-bar/footer-bar.component';
import { BodyContentComponent } from './Layout/body-content/body-content.component';



@NgModule({
  declarations: [
    AppComponent,
    NavBarMenuComponent,
    FooterBarComponent,
    BodyContentComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
