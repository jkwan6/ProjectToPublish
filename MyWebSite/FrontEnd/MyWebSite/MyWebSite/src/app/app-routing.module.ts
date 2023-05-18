import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInSignUpComponent } from './pages/log-in-sign-up/log-in-sign-up.component';
import { AcademicComponent } from './pages/sub-pages/academic/academic.component';
import { ContactInfoComponent } from './pages/sub-pages/contact-info/contact-info.component';
import { ExperienceComponent } from './pages/sub-pages/experience/experience.component';
import { SkillsComponent } from './pages/sub-pages/skills/skills.component';
import { TimelineComponent } from './pages/sub-pages/timeline/timeline.component';
import { ThreeJsPageFourComponent } from './pages/three-js-page-four/three-js-page-four.component';
import { SubMenu1Component } from './pages/three-js-page-three/sub-menu1/sub-menu1.component';
import { ThreeJsPageThreeComponent } from './pages/three-js-page-three/three-js-page-three.component';
import { ThreeJsPageTwoComponent } from './pages/three-js-page-two/three-js-page-two.component';
import { ThreeJsPageComponent } from './pages/three-js-page/three-js-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'login', component: LogInSignUpComponent },
  { path: 'signup', component: LogInSignUpComponent },
  { path: 'contact', component: ContactInfoComponent },
  { path: 'academic', component: AcademicComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'three', component: ThreeJsPageComponent },
  { path: 'three-2', component: ThreeJsPageTwoComponent },
  { path: 'three-3', component: ThreeJsPageThreeComponent },
  { path: 'three-4', component: ThreeJsPageFourComponent }
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
