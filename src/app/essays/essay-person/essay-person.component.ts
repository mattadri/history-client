import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {Person} from '../../models/person';
import {EssayPerson} from '../../models/essay-person';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-essay-person',
  templateUrl: './essay-person.component.html',
  styleUrls: ['./essay-person.component.scss']
})
export class EssayPersonComponent implements OnInit {
  @Input() public essayPerson: EssayPerson;

  @Output() private personSelected: EventEmitter<EssayPerson>;
  @Output() private delselectAllEssayPersons: EventEmitter<>;

  public selectedPerson: EssayPerson;
  public personIsSelected: boolean;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {

    this.personSelected = new EventEmitter<EssayPerson>();
    this.delselectAllEssayPersons = new EventEmitter<>();
    this.personIsSelected = false;
  }

  ngOnInit() {
  }

  applySelectState() {
    const el = this.elementRef.nativeElement.querySelector('#person-container');

    this.renderer.addClass(el, 'essay-person-selected');
  }

  async onSelectPerson(): Observable<EssayPerson> {
    this.personIsSelected = !this.personIsSelected;
    this.delselectAllEssayPersons.emit();

    await this.sleep(200);

    this.applySelectState();
    this.personSelected.emit(this.selectedPerson);
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
