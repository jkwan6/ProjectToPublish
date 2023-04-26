import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LogInSignUpComponent } from './log-in-sign-up/log-in-sign-up.component';
import { AcademicComponent } from './pages/academic/academic.component';
import { ContactInfoComponent } from './pages/contact-info/contact-info.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { TimelineComponent } from './pages/timeline/timeline.component';



const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'login', component: LogInSignUpComponent },
  { path: 'signup', component: LogInSignUpComponent },
  { path: 'contact', component: ContactInfoComponent },
  { path: 'academic', component: AcademicComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'skills', component: SkillsComponent },


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
