import { Component, OnInit } from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Essay} from '../../models/essays/essay';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {EssayService} from '../../services/essay.service';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-existing-essay-dialog',
  templateUrl: './add-existing-essay-dialog.component.html',
  styleUrls: ['./add-existing-essay-dialog.component.scss']
})
export class AddExistingEssayDialogComponent implements OnInit {
  public essay: Essay;

  public searchEssays: Essay[] = [];

  public essayTitleAutocompleteControl = new FormControl();
  public essayTitleFilteredOptions: Observable<Essay[]>;
  public essayTitleFieldDisplayValue: string;

  private userId: string;

  constructor(public dialogRef: MatDialogRef<AddExistingEssayDialogComponent>, private essayService: EssayService,) {
    this.userId = localStorage.getItem('user.id');

    this.essay = new Essay();
    this.essay.initializeNewEssay();

    this.essayService.getApiEssays(
      '/essay_users',
      this.userId,
      '0',
      null,
      null,
      false,
      null,
      false).subscribe(response => {

      this.searchEssays = response.essays;

      this.essayTitleFilteredOptions = this.essayTitleAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(essay => this._filterEssayTitle(essay))
      );
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveExistingEssay(essay) {
    this.dialogRef.close(essay);
  }

  displayEssayName(essay: Essay) {
    if (essay) {
      this.essayTitleFieldDisplayValue = '';

      if (essay.title) {
        this.essayTitleFieldDisplayValue = essay.title;
      }
    }

    return this.essayTitleFieldDisplayValue;
  }

  private _filterEssayTitle(filterValue: any): Essay[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchEssays.filter(essay => {

        if (essay.title) {
          return essay.title.toLowerCase().includes(filterValue);
        } else {
          return null;
        }
      });
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('existing_essay_label').focus();
  }
}
