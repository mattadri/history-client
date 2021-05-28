import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {BrainstormService} from '../../services/brainstorm.service';
import {Brainstorm} from '../../models/brainstorm';
import {Sleep} from '../sleep';

export interface DialogData {
  showExisting: boolean;
  showNew: boolean;
}

class QuickBrainstormReturnData {
  brainstorm: Brainstorm;
  isExisting: boolean;
}

@Component({
  selector: 'app-add-brainstorm-dialog',
  templateUrl: './add-brainstorm-dialog.component.html',
  styleUrls: ['./add-brainstorm-dialog.component.scss']
})
export class AddBrainstormDialogComponent implements OnInit {
  public brainstorms: Brainstorm[];
  public brainstorm: Brainstorm;

  public searchBrainstorms: Brainstorm[] = [];

  public brainstormNameAutocompleteControl = new FormControl();
  public brainstormNameFilteredOptions: Observable<Brainstorm[]>;

  private returnData: QuickBrainstormReturnData;

  constructor(public dialogRef: MatDialogRef<AddBrainstormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private brainstormService: BrainstormService) {
    this.returnData = new QuickBrainstormReturnData();

    this.brainstorm = new Brainstorm();
    this.brainstorm.initializeNewBrainstorm();

    this.brainstormService.getApiBrainstorms(null, null, '0', null, null, null, false, null, false).subscribe(response => {

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
    this.returnData.brainstorm = brainstorm;
    this.returnData.isExisting = true;

    this.dialogRef.close(this.returnData);
  }

  saveNewBrainstorm() {
    this.returnData.brainstorm = this.brainstorm;
    this.returnData.isExisting = false;

    this.dialogRef.close(this.returnData);
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

    try {
      document.getElementById('existing_brainstorm_title').focus();
    } catch(e) {
      document.getElementById('new_brainstorm_title').focus();
    }
  }
}
