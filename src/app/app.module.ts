import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MatExpansionModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';

import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';

import {SafeHtmlPipe} from './pipes/htmlSanitizer';

import { EraService } from './services/era.service';
import { SourceService} from './services/source.service';
import { AuthorService } from './services/author.service';
import { PersonService } from './services/person.service';
import { EventService } from './services/event.service';
import { MonthService } from './services/month.service';

import { SourcesComponent } from './manager/sources/sources.component';
import { SourceCardComponent } from './manager/sources/source-card/source-card.component';

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

import { SourceInterceptor } from './services/interceptors/source.interceptor';
import { AuthorInterceptor } from './services/interceptors/author.interceptor';
import { PersonInterceptor } from './services/interceptors/person.interceptor';
import { EventInterceptor } from './services/interceptors/event.interceptor';
import { TimelineInterceptor } from './services/interceptors/timeline.interceptor';
import { EssayInterceptor } from './services/interceptors/essay.interceptor';

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
import { EssaysComponent } from './essays/essays.component';
import { EssayReferenceDetailsComponent } from './essays/essay-reference-details/essay-reference-details.component';
import { EssayEventDetailsComponent } from './essays/essay-event-details/essay-event-details.component';
import { EssayPersonDetailsComponent } from './essays/essay-person-details/essay-person-details.component';
import { EssayTimelineDetailsComponent } from './essays/essay-timeline-details/essay-timeline-details.component';
import { EssayComponent } from './essays/essay/essay.component';
import { EssayCardComponent } from './essays/essay-card/essay-card.component';
import { EssayNoteComponent } from './essays/essay-note/essay-note.component';
import { EssayReferenceComponent } from './essays/essay-reference/essay-reference.component';
import { EssayEventComponent } from './essays/essay-event/essay-event.component';
import { EssayPersonComponent } from './essays/essay-person/essay-person.component';
import { EssayTimelineComponent } from './essays/essay-timeline/essay-timeline.component';

@NgModule({
  declarations: [
    AppComponent,

    SafeHtmlPipe,

    SourcesComponent,
    SourceCardComponent,

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
    EventDetailsComponent,
    EssaysComponent,
    EssayReferenceDetailsComponent,
    EssayEventDetailsComponent,
    EssayPersonDetailsComponent,
    EssayTimelineDetailsComponent,
    EssayComponent,
    EssayCardComponent,
    EssayNoteComponent,
    EssayReferenceComponent,
    EssayEventComponent,
    EssayPersonComponent,
    EssayTimelineComponent,
  ],
  entryComponents: [
    TimelineEventDetailsComponent,
    TimelinePersonDetailsComponent,
    EssayReferenceDetailsComponent,
    EssayEventDetailsComponent,
    EssayPersonDetailsComponent,
    EssayTimelineDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatExpansionModule,
    MatAutocompleteModule,
    Ng5SliderModule,
    FroalaViewModule.forRoot(),
    FroalaEditorModule.forRoot()
  ],
  providers: [
    EraService,
    MonthService,
    SourceService,
    AuthorService,
    PersonService,
    EventService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SourceInterceptor,
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EssayInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
