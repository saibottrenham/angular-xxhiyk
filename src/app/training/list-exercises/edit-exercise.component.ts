import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-training',
  template: `<app-add-exercise
                [isDialog]="true"
                [ex]="data"
                [week]="data.week"
                [addNewEx]="false"
              ></app-add-exercise>`
})
export class EditExerciseComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
