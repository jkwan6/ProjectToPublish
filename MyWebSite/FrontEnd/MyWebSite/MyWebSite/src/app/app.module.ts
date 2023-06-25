import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './app-material.module';
import { DialogAnimationsExampleDialog, NavBarMenuComponent } from './main-layout/nav-bar-menu/nav-bar-menu.component';
import { FooterBarComponent } from './main-layout/footer-bar/footer-bar.component';
import { BodyContentComponent } from './main-layout/body-content/body-content.component';
import { SideBarComponent } from './main-layout/body-content/side-bar/side-bar.component';
import { ContactInfoComponent } from './sub-pages/sub-pages/contact-info/contact-info.component';
import { AcademicComponent } from './sub-pages/sub-pages/academic/academic.component';
import { ExperienceComponent } from './sub-pages/sub-pages/experience/experience.component';
import { TimelineComponent } from './sub-pages/sub-pages/timeline/timeline.component';
import { SkillsComponent } from './sub-pages/sub-pages/skills/skills.component';
import { LifeInGeneralComponent } from './sub-pages/sub-pages/life-in-general/life-in-general.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CommentModuleComponent } from './modules/comment-module/comment-module.component';
import { CommentRowTemplateComponent } from './modules/comment-module/comment-row-template/comment-template.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorTest } from './modules/comment-module/paginator-extension/paginator-test';
import { PaginatorDirective } from './modules/comment-module/paginator-extension/pagination.directive';
import { FormBaseSample } from './SharedUtils/formBaseSample/form-base-sample.component';
import { AngularThreeModule } from './app-three.module';
import { AuthenticationModule } from './app-authentication-module';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { CommentPostComponent } from './modules/comment-module/comment-post/comment-post.component';

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
    HomePageComponent,
    CommentModuleComponent,
    CommentRowTemplateComponent,
    PaginatorTest,
    PaginatorDirective,
    FormBaseSample,
    DialogAnimationsExampleDialog,
    CommentPostComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FormsModule,
    AngularThreeModule,
    AuthenticationModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
