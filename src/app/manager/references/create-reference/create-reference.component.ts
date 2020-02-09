import { Component, OnInit } from '@angular/core';
import { Reference } from '../../../models/reference';
import { Era } from '../../../models/era';
import { Month } from '../../../models/month';

import { EraService } from '../../../services/era.service';
import { MonthService } from '../../../services/month.service';
import { ReferenceService } from '../../../services/reference.service';
import {Author} from '../../../models/author';

@Component({
  selector: 'app-create-reference',
  templateUrl: './create-reference.component.html',
  styleUrls: ['./create-reference.component.scss']
})

export class CreateReferenceComponent implements OnInit {
  public reference: Reference;
  public eras: Era[] = [];
  public months: Month[] = [];

  constructor(private eraService: EraService,
              private monthService: MonthService,
              private referenceService: ReferenceService) {

    this.initializeNewReference();

    this.eraService.getEras().subscribe(eras => {
      for (const era of eras.data) {
        this.eras.push(new Era().mapEra(era));
      }
    });

    this.monthService.getMonths().subscribe(months => {
      for (const month of months.data) {
        this.months.push(new Month().mapMonth(month));
      }
    });
  }

  initializeNewReference() {
    this.reference = new Reference();
    this.reference.id = 0;
    this.reference.title = '';
    this.reference.publishedDay = 0;
    this.reference.publishedMonth = new Month();
    this.reference.publishedYear = 0;
    this.reference.publishedEra = new Era();
    this.reference.authors = [];
  }

  ngOnInit() { }

  createReference() {
    return this.referenceService.createApiReference(this.reference).subscribe((reference: Reference) => {
      this.initializeNewReference();

      this.referenceService.setReference(reference);
    });
  }
}
