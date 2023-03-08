import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LogInSignUpComponent } from './log-in-sign-up/log-in-sign-up.component';



const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'login', component: LogInSignUpComponent },
  { path: 'signup', component: LogInSignUpComponent },


]


@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
      scrollPositionRestoration: 'enabled'
    })
],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
