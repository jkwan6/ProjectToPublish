import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInSignUpComponent } from './pages/log-in-sign-up/log-in-sign-up.component';
import { AcademicComponent } from './pages/sub-pages/academic/academic.component';
import { ContactInfoComponent } from './pages/sub-pages/contact-info/contact-info.component';
import { ExperienceComponent } from './pages/sub-pages/experience/experience.component';
import { SkillsComponent } from './pages/sub-pages/skills/skills.component';
import { TimelineComponent } from './pages/sub-pages/timeline/timeline.component';
import { ThreeJsPageFiveComponent } from './pages/ThreeJs/three-js-page5/three-js-page-five.component';
import { ThreeJsPageFourComponent } from './pages/ThreeJs/three-js-page4/three-js-page-four.component';
import { ThreeJsPageSevenComponent } from './pages/ThreeJs/three-js-page7/three-js-page-seven.component';
import { ThreeJsPageSixComponent } from './pages/ThreeJs/three-js-page6/three-js-page-six.component';
import { SubMenu1Component } from './pages/ThreeJs/three-js-page3/sub-menu1/sub-menu1.component';
import { ThreeJsPageThreeComponent } from './pages/ThreeJs/three-js-page3/three-js-page-three.component';
import { ThreeJsPageTwoComponent } from './pages/ThreeJs/three-js-page2/three-js-page-two.component';
import { ThreeJsPageComponent } from './pages/ThreeJs/three-js-page1/three-js-page.component';
import { ThreeJsPage10Component } from './pages/ThreeJs/three-js-page10/three-js-page10.component';
import { ThreeJsPage11Component } from './pages/ThreeJs/three-js-page11/three-js-page11.component';
import { ThreeJsPage12Component } from './pages/ThreeJs/three-js-page12/three-js-page12.component';
import { ThreeJsPage13Component } from './pages/ThreeJs/three-js-page13/three-js-page13.component';
import { ThreeJsPage14Component } from './pages/ThreeJs/three-js-page14/three-js-page14.component';
import { ThreeJsPage15Component } from './pages/ThreeJs/three-js-page15/three-js-page15.component';
import { ThreeJsPage8Component } from './pages/ThreeJs/three-js-page8/three-js-page8.component';
import { ThreeJsPage9Component } from './pages/ThreeJs/three-js-page9/three-js-page9.component';


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
  { path: 'three-4', component: ThreeJsPageFourComponent },
  { path: 'three-5', component: ThreeJsPageFiveComponent },
  { path: 'three-6', component: ThreeJsPageSixComponent },
  { path: 'three-7', component: ThreeJsPageSevenComponent },
  { path: 'three-8', component: ThreeJsPage8Component },
  { path: 'three-9', component: ThreeJsPage9Component },
  { path: 'three-10', component: ThreeJsPage10Component },
  { path: 'three-11', component: ThreeJsPage11Component },
  { path: 'three-12', component: ThreeJsPage12Component },
  { path: 'three-13', component: ThreeJsPage13Component },
  { path: 'three-14', component: ThreeJsPage14Component },
  { path: 'three-15', component: ThreeJsPage15Component },

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
