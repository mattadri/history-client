import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../services/reference.service';

import { Reference } from '../../models/reference';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss']
})
export class ReferencesComponent implements OnInit {
  public references: Reference[];
  public addReference: boolean;

  constructor(private referenceService: ReferenceService) {
    this.addReference = false;
  }

  ngOnInit() {
    this.references = [];

    this.getReferences();
  }

  getReferences() {
    this.referenceService.getApiReferences().subscribe(references => {
      for (const reference of references) {
        this.referenceService.setReference(reference);
      }

      this.references = this.referenceService.getReferences();
    });
  }

  showCreateReference() {
    this.addReference = true;
  }
}
