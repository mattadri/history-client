/*
tslint:disable:no-conditional-assignment
 */

import {
  Component, Input, NgZone, OnInit, ElementRef, Renderer2, ViewEncapsulation, EventEmitter,
  Output
} from '@angular/core';

import {MatBottomSheet, MatDialog} from '@angular/material';

import FroalaEditor from 'froala-editor/js/froala_editor.min.js';

import {Sleep} from '../sleep';

import {EditorSelectSourceComponent} from './editor-select-source/editor-select-source.component';

import {Source} from '../../models/source';
import {MessageDialogComponent} from '../message-dialog/message-dialog.component';
import {SourceService} from '../../services/source.service';
import {EssayReferenceDetailsComponent} from '../../essays/essay-reference-details/essay-reference-details.component';
import {Event} from '../../models/event';
import {Person} from '../../models/person';
import {Timeline} from '../../models/timeline';
import {EditorSelectEventComponent} from './editor-select-event/editor-select-event.component';
import {EventService} from '../../services/event.service';
import {EssayEventDetailsComponent} from '../../essays/essay-event-details/essay-event-details.component';
import {ChartService} from '../../services/chart.service';
import {Chart} from '../../models/chart';
import {PersonService} from '../../services/person.service';
import {TimelineService} from '../../services/timeline.service';
import {EditorSelectPersonComponent} from './editor-select-person/editor-select-person.component';
import {EssayPersonDetailsComponent} from '../../essays/essay-person-details/essay-person-details.component';
import {EditorSelectTimelineComponent} from './editor-select-timeline/editor-select-timeline.component';
import {EditorSelectChartComponent} from './editor-select-chart/editor-select-chart.component';
import {EssayTimelineDetailsComponent} from '../../essays/essay-timeline-details/essay-timeline-details.component';
import {EssayChartDetailsComponent} from '../../essays/essay-chart-details/essay-chart-details.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit {
  @Input() public content: string;
  @Input() public autoEdit: boolean;
  @Input() public isNote: boolean;
  @Input() public canDelete: boolean;
  @Input() public isEditable: boolean;

  @Output() private saveContent: EventEmitter<string>;
  @Output() private deleteNote: EventEmitter<boolean>;

  public displayContent: string;

  public editor: FroalaEditor;
  public initControls;

  public isEditMode: boolean;

  public source: Source;
  public chapter: string;
  public pages: string;
  public addType: string;

  public event: Event;
  public person: Person;
  public timeline: Timeline;

  public chart: Chart;

  private referenceRegex = /\(\(r (\d+) &quot;(.*?)&quot; &quot;(.*?)&quot; ([^))]*)\)\)/gi;
  private eventRegex = /\(\(e (\d+) ([^))]*)\)\)/ig;
  private personRegex = /\(\(p (\d+) ([^))]*)\)\)/ig;
  private timelineRegex = /\(\(t (\d+) ([^))]*)\)\)/ig;
  private chartRegex = /\(\(c (\d+) ([^))]*)\)\)/ig;

  constructor(public dialog: MatDialog,
              public bottomSheet: MatBottomSheet,
              private ngZone: NgZone,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private sourceService: SourceService,
              private eventService: EventService,
              private personService: PersonService,
              private timelineService: TimelineService,
              private chartService: ChartService) {

    this.isEditMode = false;

    this.saveContent = new EventEmitter<string>();
    this.deleteNote = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (this.autoEdit) {
      this.isEditMode = true;
    } else {
      this.displayContent = this.content;

      this.tokenizeReferences();
      this.tokenizeEvents();
      this.tokenizePersons();
      this.tokenizeTimelines();
      this.tokenizeCharts();

      this.addClickEvents().then();
    }
  }

  public initializeEditor(initControls) {
    this.initControls = initControls;
    this.initControls.initialize();
    this.editor = this.initControls.getEditor();

    this.editor.opts.toolbarButtons = {
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
          'chart',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 5
      },
      moreMisc: {
        buttons: [
          'generic_add',
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
        buttonsVisible: 1
      }
    };

    this.editor.opts.toolbarButtonsMD = {
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
          'chart',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 5
      },
      moreMisc: {
        buttons: [
          'generic_add',
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
        buttonsVisible: 1
      }
    };

    this.editor.opts.toolbarButtonsSM = {
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
          'chart',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 5
      },
      moreMisc: {
        buttons: [
          'generic_add',
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
        buttonsVisible: 1
      }
    };

    this.editor.opts.toolbarButtonsXS = {
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
          'chart',
          'insertLink',
          'insertImage',
          'insertVideo',
          'insertTable',
          'fontAwesome',
          'specialCharacters',
          'insertFile',
          'insertHR'
        ],
        buttonsVisible: 5
      },
      moreMisc: {
        buttons: [
          'generic_add',
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
        buttonsVisible: 1
      }
    };

    FroalaEditor.DefineIconTemplate('add_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('addIcon', { NAME: 'add', template: 'add_icon'});

    FroalaEditor.DefineIconTemplate('reference_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('referenceIcon', { NAME: 'bookmark', template: 'reference_icon'});

    FroalaEditor.DefineIconTemplate('event_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('eventIcon', {NAME: 'event', template: 'event_icon'});

    FroalaEditor.DefineIconTemplate('person_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('personIcon', {NAME: 'person', template: 'person_icon'});

    FroalaEditor.DefineIconTemplate('timeline_icon', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('timelineIcon', {NAME: 'timeline', template: 'timeline_icon'});

    FroalaEditor.DefineIconTemplate('pie_chart', '<i class="material-icons">[NAME]</i>');
    FroalaEditor.DefineIcon('chartIcon', {NAME: 'pie_chart', template: 'pie_chart'});

    FroalaEditor.RegisterCommand('generic_add', {
      title: 'Add',
      icon: 'addIcon',
      undo: false,
      focus: false,
      callback: () => {
        const selectedText = this.editor.selection.text();

        if (!selectedText) {
          this.ngZone.run(() => {
            this.dialog.open(MessageDialogComponent, {
              width: '250px',
              data: {
                title: 'Error',
                message: 'Select the text to be linked.'
              }
            });
          });

        } else {
          let insertValue = '';

          if (this.addType === 'source') {
            insertValue = '((r ' + this.source.id + ' "' + this.chapter + '" "' + this.pages + '" ' + selectedText + '))';
          } else if (this.addType === 'event') {
            insertValue = '((e ' + this.event.id + ' ' + selectedText + '))';
          } else if (this.addType === 'person') {
            insertValue = '((p ' + this.person.id + ' ' + selectedText + '))';
          } else if (this.addType === 'timeline') {
            insertValue = '((t ' + this.timeline.id + ' ' + selectedText + '))';
          } else if (this.addType === 'chart') {
            insertValue = '((c ' + this.chart.id + ' ' + selectedText + '))';
          }

          this.editor.html.insert(insertValue, false);
        }
      }
    });

    FroalaEditor.RegisterCommand('reference', {
      title: 'Add Reference',
      icon: 'referenceIcon',
      undo: false,
      focus: false,
      callback: () => {
        this.ngZone.run(() => {
          const dialogRef = this.dialog.open(EditorSelectSourceComponent, {
            width: '750px'
          });

          dialogRef.afterClosed().subscribe(response => {
            if (response && response.source) {
              this.addType = 'source';
              this.source = response.source;

              if (response.chapter) {
                this.chapter = response.chapter;
              }

              if (response.startPage) {
                this.pages = response.startPage.toString();
              }

              if (response.endPage) {
                this.pages += ' - ' + response.endPage.toString();
              }
            }
          });
        });
      }
    });

    FroalaEditor.RegisterCommand('event', {
      title: 'Add Event',
      icon: 'eventIcon',
      undo: false,
      focus: false,
      callback: () => {
        this.ngZone.run(() => {
          const dialogRef = this.dialog.open(EditorSelectEventComponent, {
            width: '750px'
          });

          dialogRef.afterClosed().subscribe(response => {
            if (response && response.event) {
              this.addType = 'event';
              this.event = response.event;
            }
          });
        });
      }
    });

    FroalaEditor.RegisterCommand('person', {
      title: 'Add Person',
      icon: 'personIcon',
      undo: false,
      focus: false,
      callback: () => {
        this.ngZone.run(() => {
          const dialogRef = this.dialog.open(EditorSelectPersonComponent, {
            width: '750px'
          });

          dialogRef.afterClosed().subscribe(response => {
            if (response && response.person) {
              this.addType = 'person';
              this.person = response.person;
            }
          });
        });
      }
    });

    FroalaEditor.RegisterCommand('timeline', {
      title: 'Add Timeline',
      icon: 'timelineIcon',
      undo: false,
      focus: false,
      callback: () => {
        this.ngZone.run(() => {
          const dialogRef = this.dialog.open(EditorSelectTimelineComponent, {
            width: '750px'
          });

          dialogRef.afterClosed().subscribe(response => {
            if (response && response.timeline) {
              this.addType = 'timeline';
              this.timeline = response.timeline;
            }
          });
        });
      }
    });

    FroalaEditor.RegisterCommand('chart', {
      title: 'Add Chart',
      icon: 'chartIcon',
      undo: false,
      focus: false,
      callback: () => {
        this.ngZone.run(() => {
          const dialogRef = this.dialog.open(EditorSelectChartComponent, {
            width: '750px'
          });

          dialogRef.afterClosed().subscribe(response => {
            if (response && response.chart) {
              this.addType = 'chart';
              this.chart = response.chart;
            }
          });
        });
      }
    });
  }

  tokenizeReferences() {
    let match;

    while (match = this.referenceRegex.exec(this.displayContent)) {
      let chapter = '';
      let pages = '';

      if (match[2] && match[2] !== 'undefined') {
        chapter = 'data-chapter="' + match[2] + '"';
      }

      if (match[3] && match[3] !== 'undefined') {
        pages = 'data-page="' + match[3] + '"';
      }

      this.displayContent = this.displayContent.replace(
        match[0],
        '<span data-referenceid="' + match[1] + '" ' + chapter + '' + pages +
        ' class="content-reference">' + match[4] + '</span>'
      );
    }
  }

  tokenizeEvents() {
    let match;

    while (match = this.eventRegex.exec(this.displayContent)) {
      this.displayContent = this.displayContent.replace(
        match[0],
        '<span data-eventid="' + match[1] + '" class="content-event">' + match[2] + '</span>'
      );
    }
  }

  tokenizePersons() {
    let match;

    while (match = this.personRegex.exec(this.displayContent)) {
      this.displayContent = this.displayContent.replace(
        match[0],
        '<span data-personid="' + match[1] + '" class="content-person">' + match[2] + '</span>'
      );
    }
  }

  tokenizeTimelines() {
    let match;

    while (match = this.timelineRegex.exec(this.displayContent)) {
      this.displayContent = this.displayContent.replace(
        match[0],
        '<span data-timelineid="' + match[1] + '" class="content-timeline">' + match[2] + '</span>'
      );
    }
  }

  tokenizeCharts() {
    let match;

    while (match = this.chartRegex.exec(this.displayContent)) {
      this.displayContent = this.displayContent.replace(
        match[0],
        '<span data-chartid="' + match[1] + '" class="content-chart">' + match[2] + '</span>'
      );
    }
  }

  setEditMode() {
    if (this.isEditable) {
      this.isEditMode = true;
    }
  }

  setViewMode() {
    this.isEditMode = false;

    this.displayContent = this.content;

    this.tokenizeReferences();
    this.tokenizeEvents();
    this.tokenizePersons();
    this.tokenizeTimelines();
    this.tokenizeCharts();

    this.addClickEvents().then();
  }

  doSaveContent() {
    this.displayContent = this.content;

    this.saveContent.emit(this.content);
  }

  doDeleteNote() {
    this.deleteNote.emit(true);
  }

  async addClickEvents() {
    await Sleep.wait(1000);

    this.elementRef.nativeElement.querySelectorAll('.content-reference').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handleReferenceClick(element);
        }
      );
    });

    this.elementRef.nativeElement.querySelectorAll('.content-event').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handleEventClick(element);
        }
      );
    });

    this.elementRef.nativeElement.querySelectorAll('.content-person').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handlePersonClick(element);
        }
      );
    });

    this.elementRef.nativeElement.querySelectorAll('.content-timeline').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handleTimelineClick(element);
        }
      );
    });

    this.elementRef.nativeElement.querySelectorAll('.content-chart').forEach(item => {
      this.renderer.listen(
        item,
        'click',
        (element) => {
          this.handleChartClick(element);
        }
      );
    });
  }

  handleReferenceClick(event) {
    let sourceId = null;
    let chapter = null;
    let pages = null;

    if (event.toElement.localName === 'sup') {
      sourceId = event.toElement.parentNode.dataset.referenceid;
    } else {
      sourceId = event.toElement.dataset.referenceid;
      chapter = event.toElement.dataset.chapter;
      pages = event.toElement.dataset.page;
    }

    this.sourceService.getApiSource(sourceId).subscribe(source => {
      this.bottomSheet.open(EssayReferenceDetailsComponent as any, {
        data: {
          source,
          chapter,
          page: pages
        }
      });
    });
  }

  handleEventClick(event) {
    let eventId = null;

    if (event.toElement.localName === 'sup') {
      eventId = event.toElement.parentNode.dataset.eventid;
    } else {
      eventId = event.toElement.dataset.eventid;
    }

    this.eventService.getApiEvent(eventId).subscribe(returnedEvent => {
      returnedEvent.formatYears();
      returnedEvent.formatDates();

      this.bottomSheet.open(EssayEventDetailsComponent as any, {
        data: {
          event: returnedEvent
        }
      });
    });
  }

  handlePersonClick(person) {
    let personId = null;

    if (person.toElement.localName === 'sup') {
      personId = person.toElement.parentNode.dataset.personid;
    } else {
      personId = person.toElement.dataset.personid;
    }

    this.personService.getApiPerson(personId).subscribe(returnedPerson => {
      returnedPerson.formatYears();
      returnedPerson.formatBirthAndDeath();
      returnedPerson.setAge();

      this.bottomSheet.open(EssayPersonDetailsComponent as any, {
        data: {
          person: returnedPerson
        }
      });
    });
  }

  handleTimelineClick(timeline) {
    let timelineId = null;

    if (timeline.toElement.localName === 'sup') {
      timelineId = timeline.toElement.parentNode.dataset.timelineid;
    } else {
      timelineId = timeline.toElement.dataset.timelineid;
    }

    this.timelineService.getApiTimeline(timelineId).subscribe(returnedTimeline => {
      this.bottomSheet.open(EssayTimelineDetailsComponent as any, {
        panelClass: 'timeline-bottomsheet-width',
        data: {
          timeline: returnedTimeline
        }
      });
    });
  }

  handleChartClick(chart) {
    let chartId = null;

    if (chart.toElement.localName === 'sup') {
      chartId = chart.toElement.parentNode.dataset.chartid;
    } else {
      chartId = chart.toElement.dataset.chartid;
    }

    this.chartService.getApiChart(chartId).subscribe(returnedChart => {
      this.bottomSheet.open(EssayChartDetailsComponent as any, {
        data: {
          chart: returnedChart
        }
      });
    });
  }
}
