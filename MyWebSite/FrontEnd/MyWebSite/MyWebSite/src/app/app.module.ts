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
import { ContactInfoComponent } from './pages/sub-pages/contact-info/contact-info.component';
import { AcademicComponent } from './pages/sub-pages/academic/academic.component';
import { ExperienceComponent } from './pages/sub-pages/experience/experience.component';
import { TimelineComponent } from './pages/sub-pages/timeline/timeline.component';
import { SkillsComponent } from './pages/sub-pages/skills/skills.component';
import { LifeInGeneralComponent } from './pages/sub-pages/life-in-general/life-in-general.component';
import { LogInSignUpComponent } from './pages/log-in-sign-up/log-in-sign-up.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CommentModuleComponent } from './modules/comment-module/comment-module.component';
import { SignFaceComponent } from './sign-face/sign-face.component';
import { CommentTemplateComponent } from './modules/comment-module/comment-template/comment-template.component';
import { ThreeJsPageComponent } from './pages/three-js-page/three-js-page.component';
import { ThreeJsPageTwoComponent } from './pages/three-js-page-two/three-js-page-two.component';
import { ThreeJsPageThreeComponent } from './pages/three-js-page-three/three-js-page-three.component';
import { SubMenu1Component } from './pages/three-js-page-three/sub-menu1/sub-menu1.component';
import { SubMenu2Component } from './pages/three-js-page-three/sub-menu2/sub-menu2.component';
import { ThreeJsPageFourComponent } from './pages/three-js-page-four/three-js-page-four.component';
import { ThreeJsPageFiveComponent } from './pages/three-js-page-five/three-js-page-five.component';
import { ThreeJsPageSixComponent } from './pages/three-js-page-six/three-js-page-six.component';


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
    LogInSignUpComponent,
    HomePageComponent,
    CommentModuleComponent,
    SignFaceComponent,
    CommentTemplateComponent,
    ThreeJsPageComponent,
    ThreeJsPageTwoComponent,
    ThreeJsPageThreeComponent,
    SubMenu1Component,
    SubMenu2Component,
    ThreeJsPageFourComponent,
    ThreeJsPageFiveComponent,
    ThreeJsPageSixComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
