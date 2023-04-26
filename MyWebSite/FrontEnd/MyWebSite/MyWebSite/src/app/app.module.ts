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
import { SideBarComponent } from './Layout/body-content/side-bar/side-bar.component';
import { ContactInfoComponent } from './pages/contact-info/contact-info.component';
import { AcademicComponent } from './pages/academic/academic.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { LifeInGeneralComponent } from './pages/life-in-general/life-in-general.component';
import { LogInSignUpComponent } from './log-in-sign-up/log-in-sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarMenuComponent,
    FooterBarComponent,
    BodyContentComponent,
    SideBarComponent,
    ContactInfoComponent,
    AcademicComponent,
    ExperienceComponent,
    TimelineComponent,
    SkillsComponent,
    LifeInGeneralComponent,
    LogInSignUpComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
