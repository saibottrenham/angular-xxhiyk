import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/message.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  public messages: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.messages = 'loading...';
    this.apiService.submitToAPI(form.value.name, form.value.phone, form.value.email, form.value.message)
      .subscribe(res => {
        this.messages = res.message;
        form.reset();
      }, error => {
        this.messages = 'Something went wrong - contact tobiasmahnert[use the at sign here]web[use a dot here]de';
      });
    
  }

}
