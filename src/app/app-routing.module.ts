import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SourcesComponent } from './manager/sources/sources.component';
import { AuthorsComponent } from './manager/authors/authors.component';
import { PersonsComponent } from './manager/persons/persons.component';
import { EventsComponent } from './manager/events/events.component';
import { TimelinesComponent } from './timelines/timelines.component';
import { TimelineComponent } from './timelines/timeline/timeline.component';
import { EssaysComponent } from './essays/essays.component';
import { BrainstormsComponent } from './brainstorms/brainstorms.component';

import {EssayComponent} from './essays/essay/essay.component';
import {SourceDetailsComponent} from './manager/sources/source-details/source-details.component';
import {EventDetailsComponent} from './manager/events/event-details/event-details.component';
import {BrainstormComponent} from './brainstorms/brainstorm/brainstorm.component';
import {ChartsComponent} from './manager/charts/charts.component';
import {ChartComponent} from './manager/charts/chart/chart.component';
import {PersonDetailsComponent} from './manager/persons/person-details/person-details.component';
import {AuthorDetailsComponent} from './manager/authors/author-details/author-details.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {UserComponent} from './auth/user/user.component';
import {ProjectsComponent} from './projects/projects.component';
import {DashboardComponent} from './dashboard/dashboard.component';


const routes: Routes = [
  {path: '', component: DashboardComponent,},
  {path: 'login', component: LoginComponent,},
  {path: 'user', component: UserComponent,},
  {path: 'manager/sources', component: SourcesComponent, canActivate: [AuthGuard]},
  {path: 'manager/sources/:id', component: SourceDetailsComponent, canActivate: [AuthGuard]},
  {path: 'manager/authors', component: AuthorsComponent, canActivate: [AuthGuard]},
  {path: 'manager/authors/:id', component: AuthorDetailsComponent, canActivate: [AuthGuard]},
  {path: 'manager/persons', component: PersonsComponent, canActivate: [AuthGuard]},
  {path: 'manager/persons/:id', component: PersonDetailsComponent, canActivate: [AuthGuard]},
  {path: 'manager/events', component: EventsComponent, canActivate: [AuthGuard]},
  {path: 'manager/events/:id', component: EventDetailsComponent, canActivate: [AuthGuard]},
  {path: 'manager/charts', component: ChartsComponent, canActivate: [AuthGuard]},
  {path: 'manager/charts/:id', component: ChartComponent, canActivate: [AuthGuard]},
  {path: 'timelines', component: TimelinesComponent, canActivate: [AuthGuard]},
  {path: 'timeline/:id', component: TimelineComponent, canActivate: [AuthGuard]},
  {path: 'essays', component: EssaysComponent, canActivate: [AuthGuard]},
  {path: 'essay/:id', component: EssayComponent, canActivate: [AuthGuard]},
  {path: 'brainstorming', component: BrainstormsComponent, canActivate: [AuthGuard]},
  {path: 'brainstorming/:id', component: BrainstormComponent, canActivate: [AuthGuard]},
  {path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
