import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SourcesComponent } from './manager/sources/sources.component';
import { AuthorsComponent } from './manager/authors/authors.component';
import { PersonsComponent } from './manager/persons/persons.component';
import { EventsComponent } from './manager/events/events.component';
import { TimelinesComponent } from './timelines/timelines.component';
import { TimelineComponent } from './timelines/timeline/timeline.component';
import { EssaysComponent } from './essays/essays.component';
import {EssayComponent} from './essays/essay/essay.component';
import {SourceDetailsComponent} from './manager/sources/source-details/source-details.component';
import {EventDetailsComponent} from './manager/events/event-details/event-details.component';


const routes: Routes = [
  {path: 'manager/sources', component: SourcesComponent},
  {path: 'manager/sources/:id', component: SourceDetailsComponent},
  {path: 'manager/authors', component: AuthorsComponent},
  {path: 'manager/persons', component: PersonsComponent},
  {path: 'manager/events', component: EventsComponent},
  {path: 'manager/events/:id', component: EventDetailsComponent},
  {path: 'timelines', component: TimelinesComponent},
  {path: 'timeline/:id', component: TimelineComponent},
  {path: 'essays', component: EssaysComponent},
  {path: 'essay/:id', component: EssayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
