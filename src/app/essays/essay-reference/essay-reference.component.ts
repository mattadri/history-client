import {Component, OnInit, Input, EventEmitter, Output, Renderer2, ElementRef} from '@angular/core';
import {EssayReference} from '../../models/essay-reference';

@Component({
  selector: 'app-essay-reference',
  templateUrl: './essay-reference.component.html',
  styleUrls: ['./essay-reference.component.scss']
})
export class EssayReferenceComponent implements OnInit {
  @Input() essayReference: EssayReference;

  @Output() private referenceSelected: EventEmitter<EssayReference>;
  @Output() private delselectAllEssayReferences: EventEmitter<any>;

  public selectedReference: EssayReference;
  public referenceIsSelected: boolean;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {

    this.referenceSelected = new EventEmitter<EssayReference>();
    this.delselectAllEssayReferences = new EventEmitter<any>();
    this.referenceIsSelected = false;
  }

  ngOnInit() {
  }

  applySelectState() {
    const el = this.elementRef.nativeElement.querySelector('#reference-container');

    this.renderer.addClass(el, 'essay-reference-selected');

    console.log(el);
  }

  async onSelectReference() {
    this.referenceIsSelected = !this.referenceIsSelected;
    this.delselectAllEssayReferences.emit();

    await this.sleep(200);

    this.applySelectState();
    this.referenceSelected.emit(this.selectedReference);
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
