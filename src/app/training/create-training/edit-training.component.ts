import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-training',
  template: `<app-add-training
                [isDialog]="true"
                [ex]="data"
              ></app-add-training>`
})
export class EditTrainingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
