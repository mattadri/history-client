import { Component, OnInit } from '@angular/core';
import {Sleep} from '../sleep';
import {Brainstorm} from '../../models/brainstorm';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialogRef} from '@angular/material/dialog';
import {BrainstormService} from '../../services/brainstorm.service';

@Component({
  selector: 'app-add-existing-brainstorm-dialog',
  templateUrl: './add-existing-brainstorm-dialog.component.html',
  styleUrls: ['./add-existing-brainstorm-dialog.component.scss']
})
export class AddExistingBrainstormDialogComponent implements OnInit {
  public brainstorms: Brainstorm[];
  public brainstorm: Brainstorm;

  public searchBrainstorms: Brainstorm[] = [];

  public brainstormNameAutocompleteControl = new FormControl();
  public brainstormNameFilteredOptions: Observable<Brainstorm[]>;

  constructor(public dialogRef: MatDialogRef<AddExistingBrainstormDialogComponent>,
              private brainstormService: BrainstormService) {
    this.brainstorm = new Brainstorm();
    this.brainstorm.initializeNewBrainstorm();

    this.brainstormService.getApiBrainstorms(null, null, '0', null, null, null, null, false, null, false).subscribe(response => {

      this.searchBrainstorms = response.brainstorms;

      this.brainstormNameFilteredOptions = this.brainstormNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(chart => this._filterBrainstormsName(chart))
      );
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveExistingBrainstorm(brainstorm) {
    this.dialogRef.close(brainstorm);
  }

  private _filterBrainstormsName(filterValue: any): Brainstorm[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchBrainstorms.filter(brainstorm => {
        if (brainstorm.title) {
          return brainstorm.title.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('existing_brainstorm_title').focus();
  }
}
