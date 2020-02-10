import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/subscription';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UiService } from '../shared/ui.service';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  private userID: string;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private afAuth: AngularFireAuth,
    private store: Store<fromTraining.State>) {
    this.afAuth.authState.subscribe(user => {
      if (user) { this.userID = user.uid; }});
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['exName'],
            link: doc.payload.doc.data()['exLink'],
            weight: doc.payload.doc.data()['exWeight']
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(e => {
      this.addDataToDatabase({
        ...e,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(e => {
      this.addDataToDatabase({
        ...e,
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises', ref => ref.where('userID', '==', this.userID))
      .valueChanges().subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }));
  }

  addExercise(e: Exercise) {
    e.userID = this.userID;
    this.store.dispatch(new UI.StartLoading());
    this.db.collection('availableExercises')
      .add(e).then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Somehting Went wrong, can\'t save exercise', null, 3000);
    });
  }

  updateExercise(e: Exercise, id: string) {
    e.userID = this.userID;
    this.store.dispatch(new UI.StartLoading());
    this.db.collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .doc(id).update(e).then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Somehting Went wrong, can\'t update exercise', null, 3000);
    });
  }

  deleteExercise(id: string) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection('availableExercises', ref => ref.where('userID', '==', this.userID))
      .doc(id).delete().then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Somehting Went wrong, can\'t delete exercise', null, 3000);
    });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}

