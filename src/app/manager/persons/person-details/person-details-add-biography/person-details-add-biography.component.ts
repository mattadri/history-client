import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';


import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {PersonBiography} from '../../../../models/persons/person-biography';
import {Essay} from '../../../../models/essays/essay';
import {EssayService} from '../../../../services/essay.service';

@Component({
  selector: 'app-person-details-add-biography',
  templateUrl: './person-details-add-biography.component.html',
  styleUrls: ['./person-details-add-biography.component.scss']
})
export class PersonDetailsAddBiographyComponent implements OnInit {
  public biographies: PersonBiography[];

  public searchBiographies: Essay[] = [];

  public biographyTitleAutocompleteControl = new FormControl();
  public biographyTitleFilteredOptions: Observable<Essay[]>;

  public userId: string;

  constructor(private essayService: EssayService,
              public dialogRef: MatDialogRef<PersonDetailsAddBiographyComponent>) {
    this.userId = localStorage.getItem('user.id');

    this.essayService.getApiEssays(
      '/essays',
      null,
      '0',
      null,
      null,
      false,
      [EssayService.getBiographyFilter()],
      false).subscribe(response => {

      this.searchBiographies = response.essays;

      this.biographyTitleFilteredOptions = this.biographyTitleAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(timeline => this._filterBiographies(timeline))
      );
    });
  }

  ngOnInit(): void {
  }

  saveBiography(biography) {
    this.dialogRef.close(biography);
  }

  private _filterBiographies(filterValue: any): Essay[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchBiographies.filter(biography => {
        if (biography.title) {
          return biography.title.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }
}
