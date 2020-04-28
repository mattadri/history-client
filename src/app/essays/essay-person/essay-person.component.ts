import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {EssayPerson} from '../../models/essay-person';

@Component({
  selector: 'app-essay-person',
  templateUrl: './essay-person.component.html',
  styleUrls: ['./essay-person.component.scss']
})
export class EssayPersonComponent implements OnInit {
  @Input() public essayPerson: EssayPerson;

  @Output() private personSelected: EventEmitter<EssayPerson>;
  @Output() private delselectAllEssayPersons: EventEmitter<any>;

  public selectedPerson: EssayPerson;
  public personIsSelected: boolean;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {

    this.personSelected = new EventEmitter<EssayPerson>();
    this.delselectAllEssayPersons = new EventEmitter<any>();
    this.personIsSelected = false;
  }

  ngOnInit() {
  }

  applySelectState() {
    const el = this.elementRef.nativeElement.querySelector('#person-container');

    this.renderer.addClass(el, 'essay-person-selected');
  }

  async onSelectPerson() {
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
