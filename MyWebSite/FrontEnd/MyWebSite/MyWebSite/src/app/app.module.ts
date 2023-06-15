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
import { AuthenticationComponent } from './pages/Authentication/authentication.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CommentModuleComponent } from './modules/comment-module/comment-module.component';
import { CommentRowTemplateComponent } from './modules/comment-module/comment-row-template/comment-template.component';
import { ThreeJsPageComponent } from './pages/ThreeJs/three-js-page1/three-js-page.component';
import { ThreeJsPageTwoComponent } from './pages/ThreeJs/three-js-page2/three-js-page-two.component';
import { ThreeJsPageThreeComponent } from './pages/ThreeJs/three-js-page3/three-js-page-three.component';
import { SubMenu1Component } from './pages/ThreeJs/three-js-page3/sub-menu1/sub-menu1.component';
import { SubMenu2Component } from './pages/ThreeJs/three-js-page3/sub-menu2/sub-menu2.component';
import { ThreeJsPageFourComponent } from './pages/ThreeJs/three-js-page4/three-js-page-four.component';
import { ThreeJsPageFiveComponent } from './pages/ThreeJs/three-js-page5/three-js-page-five.component';
import { ThreeJsPageSixComponent } from './pages/ThreeJs/three-js-page6/three-js-page-six.component';
import { ThreeJsPageSevenComponent } from './pages/ThreeJs/three-js-page7/three-js-page-seven.component';
import { ThreeJsPage8Component } from './pages/ThreeJs/three-js-page8/three-js-page8.component';
import { ThreeJsPage9Component } from './pages/ThreeJs/three-js-page9/three-js-page9.component';
import { ThreeJsPage10Component } from './pages/ThreeJs/three-js-page10/three-js-page10.component';
import { ThreeJsPage11Component } from './pages/ThreeJs/three-js-page11/three-js-page11.component';
import { ThreeJsPage12Component } from './pages/ThreeJs/three-js-page12/three-js-page12.component';
import { ThreeJsPage13Component } from './pages/ThreeJs/three-js-page13/three-js-page13.component';
import { ThreeJsPage14Component } from './pages/ThreeJs/three-js-page14/three-js-page14.component';
import { ThreeJsPage15Component } from './pages/ThreeJs/three-js-page15/three-js-page15.component';
import { LoginComponent } from './pages/Authentication/login/login.component';
import { SignUpComponent } from './pages/Authentication/sign-up/sign-up.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorTest } from './modules/comment-module/paginator-test/paginator-test';
import { PaginatorDirective } from './modules/comment-module/paginator-test/pagination.directive';
import { TestPageComponent } from './modules/comment-module/test-page/test-page.component';

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
    AuthenticationComponent,
    HomePageComponent,
    CommentModuleComponent,
    CommentRowTemplateComponent,
    ThreeJsPageComponent,
    ThreeJsPageTwoComponent,
    ThreeJsPageThreeComponent,
    SubMenu1Component,
    SubMenu2Component,
    ThreeJsPageFourComponent,
    ThreeJsPageFiveComponent,
    ThreeJsPageSixComponent,
    ThreeJsPageSevenComponent,
    ThreeJsPage8Component,
    ThreeJsPage9Component,
    ThreeJsPage10Component,
    ThreeJsPage11Component,
    ThreeJsPage12Component,
    ThreeJsPage13Component,
    ThreeJsPage14Component,
    ThreeJsPage15Component,
    LoginComponent,
    SignUpComponent,
    PaginatorTest,
    PaginatorDirective,
    TestPageComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, AngularMaterialModule, FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
