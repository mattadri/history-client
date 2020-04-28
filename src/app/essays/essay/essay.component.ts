import {Component, ElementRef, OnInit, AfterViewInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

import FroalaEditor from 'froala-editor/js/froala_editor.min.js';

import { MatBottomSheet } from '@angular/material';

import {EssayReferenceDetailsComponent} from '../essay-reference-details/essay-reference-details.component';
import {EssayEventDetailsComponent} from '../essay-event-details/essay-event-details.component';
import {EssayPersonDetailsComponent} from '../essay-person-details/essay-person-details.component';
import {EssayTimelineDetailsComponent} from '../essay-timeline-details/essay-timeline-details.component';

import {Essay} from '../../models/essay';
import {EssayNote} from '../../models/essay-note';
import {Source} from '../../models/source';
import {EssayReference} from '../../models/essay-reference';
import {Event} from '../../models/event';
import {Person} from '../../models/person';
import {Timeline} from '../../models/timeline';
import {EssayEvent} from '../../models/essay-event';
import {EventService} from '../../services/event.service';
import {EssayPerson} from '../../models/essay-person';
import {EssayTimeline} from '../../models/essay-timeline';

import {EssayService} from '../../services/essay.service';
import {SourceService} from '../../services/source.service';
import {TimelineService} from '../../services/timeline.service';
import {PersonService} from '../../services/person.service';

@Component({
  selector: 'app-essay',
  templateUrl: './essay.component.html',
  styleUrls: ['./essay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EssayComponent implements OnInit, AfterViewInit {
  public essayEditor: FroalaEditor;
  public initControls;

  public essay: Essay;

  public selectedEssayReference: EssayReference;
  public selectedEssayEvent: EssayEvent;
  public selectedEssayPerson: EssayPerson;
  public selectedEssayTimeline: EssayTimeline;

  public isAbstractEditMode: boolean;
  public isEssayEditMode: boolean;

  public title: string;

  public essayContent: string;

  public essayNotes: EssayNote[];

  public essayNote: EssayNote;
  public essayReference: EssayReference;
  public essayEvent: EssayEvent;
  public essayPerson: EssayPerson;
  public essayTimeline: EssayTimeline;

  public essayScreenSize: string;

  public isAddEssayNoteMode: boolean;
  public isAddEssayReferenceMode: boolean;
  public isAddEssayEventMode: boolean;
  public isAddEssayPersonMode: boolean;
  public isAddEssayTimelineMode: boolean;

  public source: Source;
  public sources: Source[] = [];
  public sourceId: number;

  public event: Event;
  public events: Event[];

  public person: Person;
  public persons: Person[];

  public timeline: Timeline;
  public timelines: Timeline[];

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  public eventsAutocompleteControl = new FormControl();
  public eventsFilteredOptions: Observable<Event[]>;
  public eventFieldDisplayValue: string;

  public personsAutocompleteControl = new FormControl();
  public personsFilteredOptions: Observable<Person[]>;
  public personFieldDisplayValue: string;

  public timelinesAutocompleteControl = new FormControl();
  public timelinesFilteredOptions: Observable<Timeline[]>;
  public timelineFieldDisplayValue: string;

  private referenceRegex = /\(\(r (\d+) ([^))]*)\)\)/ig;
  private eventRegex = /\(\(e (\d+) ([^))]*)\)\)/ig;
  private personRegex = /\(\(p (\d+) ([^))]*)\)\)/ig;
  private timelineRegex = /\(\(t (\d+) ([^))]*)\)\)/ig;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private route: ActivatedRoute,
              private essayService: EssayService,
              private sourceService: SourceService,
              private eventService: EventService,
              private personService: PersonService,
              private timelineService: TimelineService,
              public bottomSheet: MatBottomSheet) {

    const essayId = this.route.snapshot.paramMap.get('id');

    this.sourceId = 22;

    this.isAbstractEditMode = false;
    this.isEssayEditMode = false;

    this.isAddEssayNoteMode = false;

    this.essayScreenSize = 'fullscreen_exit';

    this.essay = new Essay();
    this.essay.initializeNewEssay();

    this.initializeNewEssayNote();

    this.essayService.getApiEssay(essayId).subscribe(essay => {
      this.essay = essay;

      this.essayNotes = essay.essayNotes;

      this.setEssayContent();

      // once the raw content has been retrieved tokenize the content
      this.tokenizeReferences();
      this.tokenizeEvents();
      this.tokenizePeople();
      this.tokenizeTimelines();
    });

    this.sourceService.getApiSources('/references?page[size]=0&fields[reference]=title,sub_title').subscribe(response => {
      this.sources = response.sources;

      this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(source => this._filterSources(source))
      );
    });

    this.eventService.getApiEvents('events?page[size]=0&fields[event]=label', null, null, false).subscribe(response => {
      this.events = response.events;

      this.eventsFilteredOptions = this.eventsAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(event => this._filterEvents(event))
      );
    });

    this.personService.getApiPersons('persons?page[size]=0&fields[person]=first_name,middle_name,last_name').subscribe(response => {
      this.persons = response.persons;

      this.personsFilteredOptions = this.personsAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPersons(person))
      );
    });

    this.timelineService.getApiTimelines('timelines?page[size]=0&fields[timeline]=label').subscribe(response => {
      this.timelines = response.timelines;

      this.timelinesFilteredOptions = this.timelinesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(timeline => this._filterTimelines(timeline))
      );
    });
  }

  ngOnInit() {
    FroalaEditor.DefineIconTemplate('reference_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('referenceIcon', {NAME: 'bookmark', template: 'reference_icon'});

    FroalaEditor.DefineIconTemplate('event_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('eventIcon', {NAME: 'event', template: 'event_icon'});

    FroalaEditor.DefineIconTemplate('person_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('personIcon', {NAME: 'person', template: 'person_icon'});

    FroalaEditor.DefineIconTemplate('timeline_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('timelineIcon', {NAME: 'timeline', template: 'timeline_icon'});

    FroalaEditor.RegisterCommand('reference', {
      title: 'Add Reference',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      icon: 'referenceIcon',
      callback: () => {
        const selectedText = this.essayEditor.selection.text();
        const referenceId = this.selectedEssayReference.id;
        const insertValue = '((r ' + referenceId + ' ' + selectedText + '))';

        this.essayEditor.html.insert(insertValue, false);
      }
    });

    FroalaEditor.RegisterCommand('event', {
      title: 'Add Event',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      icon: 'eventIcon',
      callback: () => {
        const selectedText = this.essayEditor.selection.text();
        const eventId = this.selectedEssayEvent.id;
        const insertValue = '((e ' + eventId + ' ' + selectedText + '))';

        this.essayEditor.html.insert(insertValue, false);
      }
    });

    FroalaEditor.RegisterCommand('person', {
      title: 'Add Person',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      icon: 'personIcon',
      callback: () => {
        const selectedText = this.essayEditor.selection.text();
        const personId = this.selectedEssayPerson.id;
        const insertValue = '((p ' + personId + ' ' + selectedText + '))';

        this.essayEditor.html.insert(insertValue, false);
      }
    });

    FroalaEditor.RegisterCommand('timeline', {
      title: 'Add Timeline',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      icon: 'timelineIcon',
      callback: () => {
        const selectedText = this.essayEditor.selection.text();
        const timelineId = this.selectedEssayTimeline.id;
        const insertValue = '((t ' + timelineId + ' ' + selectedText + '))';

        this.essayEditor.html.insert(insertValue, false);
      }
    });
  }

  async ngAfterViewInit() {
    this.addClickEvents().then();
  }

  public initializeEssayEditor(initControls) {
    this.initControls = initControls;
    this.initControls.initialize();
    this.essayEditor = this.initControls.getEditor();

    console.log(this.essayEditor);

    this.essayEditor.opts.toolbarButtons = {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          'inlineClass',
          'inlineStyle',
          'clearFormatting'
        ],
        align: 'left',
        buttonsVisible: 0
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignRight',
          'alignJustify',
          'formatOLSimple',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 0
      },
      moreRich: {
        buttons: [
          'reference',
          'event',
          'person',
          'timeline',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 4
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          'print',
          'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2
      }
    };

    this.essayEditor.opts.toolbarButtonsMD = {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          'inlineClass',
          'inlineStyle',
          'clearFormatting'
        ],
        align: 'left',
        buttonsVisible: 0
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignRight',
          'alignJustify',
          'formatOLSimple',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 0
      },
      moreRich: {
        buttons: [
          'reference',
          'event',
          'person',
          'timeline',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 4
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          'print',
          'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2
      }
    };

    this.essayEditor.opts.toolbarButtonsSM = {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          'inlineClass',
          'inlineStyle',
          'clearFormatting'
        ],
        align: 'left',
        buttonsVisible: 0
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignRight',
          'alignJustify',
          'formatOLSimple',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 0
      },
      moreRich: {
        buttons: [
          'reference',
          'event',
          'person',
          'timeline',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 4
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          'print',
          'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2
      }
    };

    this.essayEditor.opts.toolbarButtonsXS = {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          'inlineClass',
          'inlineStyle',
          'clearFormatting'
        ],
        align: 'left',
        buttonsVisible: 0
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignRight',
          'alignJustify',
          'formatOLSimple',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 0
      },
      moreRich: {
        buttons: [
          'reference',
          'event',
          'person',
          'timeline',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 4
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          'print',
          'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2
      }
    };
  }

  initializeNewEssayNote() {
    this.sourceFieldDisplayValue = '';

    this.essayNote = new EssayNote();
    this.essayNote.initializeNewEssayNote();
  }

  initializeNewEssayReference() {
    this.essayReference = new EssayReference();
    this.essayReference.initializeNewEssayReference();
  }

  initializeNewEssayEvent() {
    this.essayEvent = new EssayEvent();
    this.essayEvent.initializeNewEssayEvent();
  }

  initializeNewEssayPerson() {
    this.essayPerson = new EssayPerson();
    this.essayPerson.initializeNewEssayPerson();
  }

  initializeNewEssayTimeline() {
    this.essayTimeline = new EssayTimeline();
    this.essayTimeline.initializeNewEssayTimeline();
  }

  deselectAllEssayReferences() {
    this.elementRef.nativeElement.querySelectorAll('.essay-reference-selected').forEach(item => {
      this.renderer.removeClass(item, 'essay-reference-selected');
    });
  }

  deselectAllEssayEvents() {
    this.elementRef.nativeElement.querySelectorAll('.essay-event-selected').forEach(item => {
      this.renderer.removeClass(item, 'essay-event-selected');
    });
  }

  deselectAllEssayPersons() {
    this.elementRef.nativeElement.querySelectorAll('.essay-person-selected').forEach(item => {
      this.renderer.removeClass(item, 'essay-person-selected');
    });
  }

  deselectAllEssayTimelines() {
    this.elementRef.nativeElement.querySelectorAll('.essay-timeline-selected').forEach(item => {
      this.renderer.removeClass(item, 'essay-timeline-selected');
    });
  }

  selectEssayReference(reference) {
    this.selectedEssayReference = reference;
  }

  selectEssayEvent(event) {
    this.selectedEssayEvent = event;
  }

  selectEssayPerson(person) {
    this.selectedEssayPerson = person;
  }

  selectEssayTimeline(timeline) {
    this.selectedEssayTimeline = timeline;
  }

  handleReferenceClick(event) {
    let referenceId = null;

    if (event.toElement.localName === 'sup') {
      referenceId = event.toElement.parentNode.dataset.referenceid;
    } else {
      referenceId = event.toElement.dataset.referenceid;
    }

    const thisReference = this.essay.essayReferences.find(reference => reference.id === referenceId);

    this.bottomSheet.open(EssayReferenceDetailsComponent as any, {
      data: {
        ref: thisReference
      }
    });
  }

  handleEventClick(event) {
    let eventId = null;

    if (event.toElement.localName === 'sup') {
      eventId = event.toElement.parentNode.dataset.eventid;
    } else {
      eventId = event.toElement.dataset.eventid;
    }

    const thisEvent = this.essay.essayEvents.find(foundEvent => foundEvent.id === eventId);

    this.bottomSheet.open(EssayEventDetailsComponent as any, {
      data: {
        event: thisEvent.event
      }
    });
  }

  handlePersonClick(person) {
    let personId = null;

    if (person.toElement.localName === 'sup') {
      personId = person.toElement.parentNode.dataset.personid;
    } else {
      personId = person.toElement.dataset.personid;
    }

    const thisPerson = this.essay.essayPeople.find(foundPerson => foundPerson.id === personId);

    this.bottomSheet.open(EssayPersonDetailsComponent as any, {
      data: {
        person: thisPerson.person
      }
    });
  }

  handleTimelineClick(timeline): void {
    let timelineId = null;

    console.log('working');

    if (timeline.toElement.localName === 'sup') {
      timelineId = timeline.toElement.parentNode.dataset.timelineid;
    } else {
      timelineId = timeline.toElement.dataset.timelineid;
    }

    const thisTimeline = this.essay.essayTimelines.find(foundTimeline => foundTimeline.id === timelineId);

    this.bottomSheet.open(EssayTimelineDetailsComponent as any, {
      data: {
        timeline: thisTimeline.timeline
      }
    });
  }

  tokenizeReferences() {
    let match;

    while (match = this.referenceRegex.exec(this.essayContent)) {
      this.essayContent = this.essayContent.replace(
        match[0],
        '<span data-referenceid="' + match[1] + '" class="essay-reference">' + match[2] + '</span>'
      );
    }
  }

  tokenizeEvents() {
    let match;

    while (match = this.eventRegex.exec(this.essayContent)) {
      this.essayContent = this.essayContent.replace(
        match[0],
        '<span data-eventid="' + match[1] + '" class="essay-event">' + match[2] + '</span>'
      );
    }
  }

  tokenizePeople() {
    let match;

    while (match = this.personRegex.exec(this.essayContent)) {
      this.essayContent = this.essayContent.replace(
        match[0],
        '<span data-personid="' + match[1] + '" class="essay-person">' + match[2] + '</span>'
      );
    }
  }

  tokenizeTimelines() {
    let match;

    while (match = this.timelineRegex.exec(this.essayContent)) {
      this.essayContent = this.essayContent.replace(
        match[0],
        '<span data-timelineid="' + match[1] + '" class="essay-timeline">' + match[2] + '</span>'
      );
    }
  }

  setAbstractEditMode() {
    this.isAbstractEditMode = true;
  }

  setAbstractViewMode() {
    this.isAbstractEditMode = false;
  }

  setEssayEditMode() {
    this.isEssayEditMode = true;
  }

  setEssayViewMode() {
    this.isEssayEditMode = false;

    this.addClickEvents().then();
  }

  saveAbstractContent() {
    console.log(this.essay.abstract);
    this.essayService.patchApiEssay(this.essay).subscribe();
  }

  saveEssayContent() {
    console.log(this.essay.essay);
    this.essayService.patchApiEssay(this.essay).subscribe(() => {
      this.setEssayContent();

      this.tokenizeReferences();
      this.tokenizeEvents();
      this.tokenizePeople();
      this.tokenizeTimelines();
    });
  }

  addReference() {
    this.essayReference.source = this.source;

    this.essayService.createApiEssayReference(this.essay, this.essayReference).subscribe(response => {
      this.essayReference.id = response.data.id;
      this.essay.essayReferences.push(this.essayReference);

      this.cancelAddEssayReferenceMode();
    });
  }

  addEvent() {
    this.essayEvent.event = this.event;

    this.essayService.createApiEssayEvent(this.essay, this.essayEvent).subscribe(response => {
      this.essayEvent.id = response.data.id;
      this.essay.essayEvents.push(this.essayEvent);

      this.cancelAddEssayEventMode();
    });
  }

  addPerson() {
    this.essayPerson.person = this.person;

    this.essayService.createApiEssayPerson(this.essay, this.essayPerson).subscribe(response => {
      this.essayPerson.id = response.data.id;
      this.essay.essayPeople.push(this.essayPerson);

      this.cancelAddEssayPersonMode();
    });
  }

  addTimeline() {
    this.essayTimeline.timeline = this.timeline;

    this.essayService.createApiEssayTimeline(this.essay, this.essayTimeline).subscribe(response => {
      this.essayTimeline.id = response.data.id;
      this.essay.essayTimelines.push(this.essayTimeline);

      this.cancelAddEssayTimelineMode();
    });
  }

  addNote() {
    this.essayNote.source = this.source;

    this.essayService.createApiEssayNote(this.essay, this.essayNote).subscribe(response => {
      this.essayNote.id = response.data.id;
      this.essay.essayNotes.push(this.essayNote);

      this.cancelAddEssayNoteMode();
    });
  }

  async setAddEssayNoteMode() {
    this.isAddEssayNoteMode = true;
    this.initializeNewEssayNote();

    await this.sleep(500);

    document.getElementById('essay_note').focus();
  }

  setAddEssayReferenceMode() {
    this.isAddEssayReferenceMode = true;
    this.initializeNewEssayReference();
  }

  setAddEssayEventMode() {
    this.isAddEssayEventMode = true;
    this.initializeNewEssayEvent();
  }

  setAddEssayPersonMode() {
    this.isAddEssayPersonMode = true;
    this.initializeNewEssayPerson();
  }

  setAddEssayTimelineMode() {
    this.isAddEssayTimelineMode = true;
    this.initializeNewEssayTimeline();
  }

  cancelAddEssayNoteMode() {
    this.initializeNewEssayNote();
    this.isAddEssayNoteMode = false;
  }

  cancelAddEssayReferenceMode() {
    this.initializeNewEssayReference();
    this.isAddEssayReferenceMode = false;
  }

  cancelAddEssayEventMode() {
    this.initializeNewEssayEvent();
    this.isAddEssayEventMode = false;
  }

  cancelAddEssayPersonMode() {
    this.initializeNewEssayPerson();
    this.isAddEssayPersonMode = false;
  }

  cancelAddEssayTimelineMode() {
    this.initializeNewEssayTimeline();
    this.isAddEssayTimelineMode = false;
  }

  async addClickEvents() {
    await this.sleep(1000);

    this.elementRef.nativeElement.querySelectorAll('.essay-reference').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handleReferenceClick(element);
        }
      );
    });

    this.elementRef.nativeElement.querySelectorAll('.essay-event').forEach(item => {
        this.renderer.listen(
          item,
          'click',
          (element) => {
            this.handleEventClick(element);
          }
        );
      });

    this.elementRef.nativeElement.querySelectorAll('.essay-person').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handlePersonClick(element);
        }
      );
    });

    this.elementRef.nativeElement.querySelectorAll('.essay-timeline').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handleTimelineClick(element);
        }
      );
    });
  }

  setEssayContent() {
    this.essayContent = this.essay.essay;
  }

  toggleContentPanel(contentPanel) {
    if (contentPanel.opened) {
      this.essayScreenSize = 'fullscreen_exit';
      contentPanel.close();
    } else {
      this.essayScreenSize = 'fullscreen';
      contentPanel.open();
    }
  }

  displaySource(source: Source) {
    if (source) {
      this.sourceFieldDisplayValue = source.title;

      if (source.subTitle) {
        this.sourceFieldDisplayValue = this.sourceFieldDisplayValue + ': ' + source.subTitle;
      }
    }

    return this.sourceFieldDisplayValue;
  }

  displayEvent(event: Event) {
    if (event) {
      this.eventFieldDisplayValue = event.label;

      return this.eventFieldDisplayValue;
    }
  }

  displayPerson(person: Person) {
    if (person) {
      this.personFieldDisplayValue = person.firstName;

      if (person.middleName) {
        this.personFieldDisplayValue = this.personFieldDisplayValue + ' ' + person.middleName;
      }

      if (person.lastName) {
        this.personFieldDisplayValue = this.personFieldDisplayValue + ' ' + person.lastName;
      }

      return this.personFieldDisplayValue;
    }
  }

  displayTimeline(timeline: Timeline) {
    if (timeline) {
      this.timelineFieldDisplayValue = timeline.label;

      return this.timelineFieldDisplayValue;
    }
  }

  saveSource() {
    this.source = this.sourcesAutocompleteControl.value;
  }

  saveEvent() {
    this.event = this.eventsAutocompleteControl.value;
  }

  savePerson() {
    this.person = this.personsAutocompleteControl.value;
  }

  saveTimeline() {
    this.timeline = this.timelinesAutocompleteControl.value;
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private _filterSources(filterValue: string): Source[] {
    filterValue = filterValue.toLowerCase();

    return this.sources.filter(source => {
      return source.title.toLowerCase().includes(filterValue);
    });
  }

  private _filterEvents(filterValue: string): Event[] {
    filterValue = filterValue.toLowerCase();

    return this.events.filter(event => {
      return event.label.toLowerCase().includes(filterValue);
    });
  }

  private _filterPersons(filterValue: string): Person[] {
    let valueToFilterOn = filterValue;

    valueToFilterOn = valueToFilterOn.toLowerCase();

    return this.persons.filter(person => {
      let personFullName = person.firstName;

      if (person.middleName) {
        personFullName = personFullName + ' ' + person.middleName;
      }

      if (person.lastName) {
        personFullName = personFullName + ' ' + person.lastName;
      }

      return personFullName.toLowerCase().includes(valueToFilterOn);
    });
  }

  private _filterTimelines(filterValue: any): Timeline[] {
    if (filterValue) {
      if (filterValue.label) {
        filterValue = filterValue.label.toLowerCase();
      } else {
        filterValue = filterValue.toLowerCase();
      }
    }

    return this.timelines.filter(timeline => {
      return timeline.label.toLowerCase().includes(filterValue);
    });
  }
}
