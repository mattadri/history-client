import {Component, Input, OnInit} from '@angular/core';

import {EssayService} from '../../services/essay.service';

import {EssayNote} from '../../models/essay-note';
import {Essay} from '../../models/essay';

@Component({
  selector: 'app-essay-note',
  templateUrl: './essay-note.component.html',
  styleUrls: ['./essay-note.component.scss']
})
export class EssayNoteComponent implements OnInit {
  @Input() essay: Essay;
  @Input() note: EssayNote;

  constructor(private essayService: EssayService) { }

  ngOnInit() { }

  deleteEssayNote() {
    this.essayService.removeApiEssayNote(this.note.id).subscribe(() => {
      this.essayService.removeEssayNote(this.essay, this.note);
    });
  }
}
