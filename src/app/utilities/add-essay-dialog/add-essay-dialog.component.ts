import { Component, OnInit } from '@angular/core';
import {Essay} from '../../models/essays/essay';
import {EssayType} from '../../models/essays/essay-type';
import {EssayService} from '../../services/essay.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-essay-dialog',
  templateUrl: './add-essay-dialog.component.html',
  styleUrls: ['./add-essay-dialog.component.scss']
})
export class AddEssayDialogComponent implements OnInit {
  public essay: Essay;

  public essayTypes: EssayType[];

  private userId: string;

  constructor(public dialogRef: MatDialogRef<AddEssayDialogComponent>,
              private essayService: EssayService) {
    this.userId = localStorage.getItem('user.id');

    this.essayTypes = [];

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
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewEssay() {
    this.dialogRef.close(this.essay);
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

    document.getElementById('essay_label').focus();
  }
}
