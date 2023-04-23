import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}


  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  async registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password);
      this.store.dispatch(new UI.StopLoading());
    } catch (error) {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    }
  }

  async login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(authData.email, authData.password);
      this.store.dispatch(new UI.StopLoading());
    } catch (error) {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    }
  }

  logout() {
    this.afAuth.signOut();
  }
}
