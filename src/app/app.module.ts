import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { Ng5SliderModule } from 'ng5-slider';

import { MatCardModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatBottomSheetModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';

import { EraService } from './services/era.service';
import { MonthService } from './services/month.service';
import { ReferenceService } from './services/reference.service';
import { AuthorService } from './services/author.service';
import { PersonService } from './services/person.service';
import { EventService } from './services/event.service';

import { ReferencesComponent } from './manager/references/references.component';
import { ReferenceCardComponent } from './manager/references/reference-card/reference-card.component';

import { PersonsComponent } from './manager/persons/persons.component';
import { PersonCardComponent } from './manager/persons/person-card/person-card.component';

import { AuthorsComponent } from './manager/authors/authors.component';
import { AuthorCardComponent } from './manager/authors/author-card/author-card.component';

import { EventsComponent } from './manager/events/events.component';
import { EventCardComponent } from './manager/events/event-card/event-card.component';
import { EventNoteComponent } from './manager/events/event-note/event-note.component';

import { TimelinesComponent } from './timelines/timelines.component';
import { TimelineCardComponent } from './timelines/timeline-card/timeline-card.component';
import { TimelineComponent } from './timelines/timeline/timeline.component';
import { TimelineEventComponent } from './timelines/timeline-event/timeline-event.component';
import { TimelineEventDetailsComponent } from './timelines/timeline-event-details/timeline-event-details.component';
import { TimelineEventListComponent } from './timelines/timeline-event-list/timeline-event-list.component';

import { ReferenceInterceptor } from './services/interceptors/reference.interceptor';
import { AuthorInterceptor } from './services/interceptors/author.interceptor';
import { PersonInterceptor } from './services/interceptors/person.interceptor';
import { EventInterceptor } from './services/interceptors/event.interceptor';
import { TimelineInterceptor } from './services/interceptors/timeline.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventTimelineComponent } from './manager/events/event-timeline/event-timeline.component';
import { TimelineEventDetailNoteComponent } from './timelines/timeline-event-detail-note/timeline-event-detail-note.component';
import { TimelinePersonComponent } from './timelines/timeline-person/timeline-person.component';
import { TimelinePersonListComponent } from './timelines/timeline-person-list/timeline-person-list.component';
import { TimelinePersonDetailsComponent } from './timelines/timeline-person-details/timeline-person-details.component';
import { PersonNoteComponent } from './manager/persons/person-note/person-note.component';
import { TimelineCategoryComponent } from './timelines/timeline-categories/timeline-category/timeline-category.component';
import { TimelineCategoriesComponent } from './timelines/timeline-categories/timeline-categories.component';
import { CategoryComponent } from './timelines/category/category.component';
import { EventDetailsComponent } from './manager/events/event-details/event-details.component';

@NgModule({
  declarations: [
    AppComponent,

    ReferencesComponent,
    ReferenceCardComponent,

    AuthorsComponent,
    AuthorCardComponent,

    EventsComponent,
    EventCardComponent,
    EventNoteComponent,

    PersonsComponent,
    PersonCardComponent,

    TimelineComponent,
    TimelinesComponent,
    TimelineEventComponent,
    TimelineCardComponent,
    TimelineEventDetailsComponent,
    TimelineEventListComponent,
    EventTimelineComponent,
    TimelineEventDetailNoteComponent,
    TimelinePersonComponent,
    TimelinePersonListComponent,
    TimelinePersonDetailsComponent,
    PersonNoteComponent,
    TimelineCategoryComponent,
    TimelineCategoriesComponent,
    CategoryComponent,
    EventDetailsComponent
  ],
  entryComponents: [TimelineEventDetailsComponent, TimelinePersonDetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatTabsModule,
    MatTooltipModule,
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
