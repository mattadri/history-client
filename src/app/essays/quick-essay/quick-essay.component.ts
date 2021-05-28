import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Essay} from '../../models/essays/essay';
import {Sleep} from '../../utilities/sleep';
import {EssayType} from '../../models/essays/essay-type';
import {EssayService} from '../../services/essay.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface DialogData {
  showExisting: boolean;
  showNew: boolean;
}

class QuickEssayReturnData {
  essay: Essay;
  isExisting: boolean;
}

@Component({
  selector: 'app-quick-essay',
  templateUrl: './quick-essay.component.html',
  styleUrls: ['./quick-essay.component.scss']
})
export class QuickEssayComponent implements OnInit, AfterViewInit {
  public essay: Essay;

  public essayTypes: EssayType[];

  public searchEssays: Essay[] = [];

  public essayTitleAutocompleteControl = new FormControl();
  public essayTitleFilteredOptions: Observable<Essay[]>;
  public essayTitleFieldDisplayValue: string;

  private userId: string;

  private returnData: QuickEssayReturnData;

  constructor(public dialogRef: MatDialogRef<QuickEssayComponent>,
              private essayService: EssayService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.userId = localStorage.getItem('user.id');

    this.essayTypes = [];

    this.returnData = new QuickEssayReturnData;

    this.essay = new Essay();
    this.essay.initializeNewEssay();

    this.essayService.getApiEssayTypes().subscribe((response) => {
      for (const type of response.data) {
        const newType = new EssayType();
        newType.initializeNewEssayType();

        newType.mapEssayType(type);

        this.essayService.setEssayType(newType);
      }

      this.essayTypes = this.essayService.getEssayTypes();
    });

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
    this.returnData.essay = essay;
    this.returnData.isExisting = true;

    this.dialogRef.close(this.returnData);
  }

  saveNewEssay() {
    this.returnData.essay = this.essay;
    this.returnData.isExisting = false;

    this.dialogRef.close(this.returnData);
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

  selectEssayType(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    try {
      document.getElementById('existing_essay_label').focus();
    } catch(e) {
      document.getElementById('essay_label').focus();
    }
  }
}
