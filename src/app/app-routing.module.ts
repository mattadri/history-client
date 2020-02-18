import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferencesComponent } from './manager/references/references.component';
import { AuthorsComponent } from './manager/authors/authors.component';
import { PersonsComponent } from './manager/persons/persons.component';
import { EventsComponent } from './manager/events/events.component';
import { TimelinesComponent } from './timelines/timelines.component';
import { TimelineComponent } from './timelines/timeline/timeline.component';


const routes: Routes = [
  {path: 'manager/references', component: ReferencesComponent},
  {path: 'manager/authors', component: AuthorsComponent},
  {path: 'manager/persons', component: PersonsComponent},
  {path: 'manager/events', component: EventsComponent},
  {path: 'timelines', component: TimelinesComponent},
  {path: 'timeline/:id', component: TimelineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
