import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { apiPaths } from '../apiPaths';
import { sessionObject } from './session';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule ,ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {


  formGroupeName!: FormGroup;

  constructor(private apiService:ApiService, private mesasageService:MessageService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.formGroupeName = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login(): void {
    if(this.formGroupeName.invalid){
      this.formGroupeName.markAllAsTouched();
      this.mesasageService.add({severity:'error', summary:'Invalid Input', detail:'Please enter valid username and password'});
      return;
    }
    else{
        this.apiService.post(apiPaths.authenticate, this.formGroupeName.value).subscribe({
          next: (response:any) => {
            if(response.status == 200){
              sessionObject.loggedIn = true;
              sessionObject.user = response.user;
              sessionObject.token = response.token;
              localStorage.setItem('session', JSON.stringify(sessionObject));
              this.router.navigate(['/pmTool']);
            }
            else{
              this.mesasageService.add({severity:'error', summary:'Unauthorised Access', detail:response.message});
            }
          },
          error: (error) => {
            this.mesasageService.add({severity:'error', summary:'Unauthorised Access', detail:error.error.message});
            console.error(error);
          }

        });
  }
}
}
