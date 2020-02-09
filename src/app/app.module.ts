import { } from ''

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material';
import { Ng5SliderModule } from 'ng5-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EraService } from './services/era.service';
import { MonthService } from './services/month.service';
import { ReferenceService } from './services/reference.service';
import { AuthorService } from './services/author.service';
import { PersonService } from './services/person.service';
import { EventService } from './services/event.service';

import { ReferencesComponent } from './manager/references/references.component';
import { ReferenceComponent } from './manager/references/reference/reference.component';
import { AuthorsComponent } from './manager/references/authors/authors.component';
import { AuthorComponent } from './manager/references/author/author.component';
import { CreateReferenceComponent } from './manager/references/create-reference/create-reference.component';

import { PersonsComponent } from './manager/persons/persons.component';
import { PersonComponent } from './manager/persons/person/person.component';
import { CreatePersonComponent } from './manager/persons/create-person/create-person.component';

import { EventsComponent } from './manager/events/events.component';
import { EventComponent } from './manager/events/event/event.component';
import { EventNoteComponent } from './manager/events/event/event-note/event-note.component';

import { TimelinesComponent } from './timelines/timelines.component';
import { TimelineComponent } from './timelines/timeline/timeline.component';

import { ReferenceInterceptor } from './services/interceptors/reference.interceptor';
import { AuthorInterceptor } from './services/interceptors/author.interceptor';
import { PersonInterceptor } from './services/interceptors/person.interceptor';
import { EventInterceptor } from './services/interceptors/event.interceptor';
import { TimelineInterceptor } from './services/interceptors/timeline.interceptor';
import { TimelineEventComponent } from './timelines/timeline-event/timeline-event.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineCardComponent } from './timelines/timeline-card/timeline-card.component';


@NgModule({
  declarations: [
    AppComponent,
    ReferencesComponent,
    ReferenceComponent,
    AuthorsComponent,
    AuthorComponent,
    CreateReferenceComponent,
    PersonsComponent,
    PersonComponent,
    CreatePersonComponent,
    EventsComponent,
    EventComponent,
    EventNoteComponent,
    TimelineComponent,
    TimelinesComponent,
    TimelineEventComponent,
    TimelineCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    Ng5SliderModule
  ],
  providers: [
    EraService,
    MonthService,
    ReferenceService,
    AuthorService,
    PersonService,
    EventService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ReferenceInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PersonInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EventInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimelineInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
