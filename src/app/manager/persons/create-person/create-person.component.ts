import { Component, OnInit } from '@angular/core';

import { Era } from '../../../models/era';
import { Month } from '../../../models/month';
import { Person } from '../../../models/person';
import { Reference } from '../../../models/reference';

import { EraService } from '../../../services/era.service';
import { MonthService } from '../../../services/month.service';
import { PersonService } from '../../../services/person.service';
import { ReferenceService } from '../../../services/reference.service';

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.scss']
})
export class CreatePersonComponent implements OnInit {
  public person: Person;
  public eras: Era[] = [];
  public months: Month[] = [];
  public references: Reference[] = [];

  constructor(private eraService: EraService,
              private monthService: MonthService,
              private referenceService: ReferenceService,
              private personService: PersonService) {
    this.initializeNewPerson();

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

    this.referenceService.getApiReferences().subscribe(references => {
      for (const reference of references) {
        this.referenceService.setReference(reference);
      }

      this.references = this.referenceService.getReferences();
    });
  }

  ngOnInit() {
  }

  initializeNewPerson() {
    this.person = new Person();

    this.person.firstName = '';
    this.person.middleName = '';
    this.person.lastName = '';
    this.person.birthDay = 0;
    this.person.birthMonth = new Month();
    this.person.birthYear = 0;
    this.person.birthEra = new Era();
    this.person.deathDay = 0;
    this.person.deathMonth = new Month();
    this.person.deathYear = 0;
    this.person.deathEra = new Era();
    this.person.reference = new Reference();
  }

  createPerson() {
    return this.personService.createApiPerson(this.person).subscribe(result => {
      this.personService.setPerson(this.person);
    });
  }
}
