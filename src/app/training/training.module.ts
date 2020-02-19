import { NgModule } from '@angular/core';
import { TrainingComponent } from './training.component';
import { WeekPlanComponent } from './week-plan/week-plan.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { StoreModule } from '@ngrx/store';
import { trainingReducer } from './training.reducer';
import { ListExerciseComponent } from './list-exercises/list-exercise.component';
import { EditExerciseComponent } from './list-exercises/edit-exercise.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';

@NgModule({
  declarations: [
    TrainingComponent,
    WeekPlanComponent,
    EditExerciseComponent,
    ListExerciseComponent,
    AddExerciseComponent
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule,
    StoreModule.forFeature('training', trainingReducer)
  ],
  entryComponents: [EditExerciseComponent]
})
export class TrainingModule {}
