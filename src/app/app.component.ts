import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sessionObject } from './login/session';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-tools';

  constructor() {
    let session = localStorage.getItem('session');
    if(session){
      let sessionObj = JSON.parse(session);
      if(sessionObj.loggedIn){
          sessionObject.user = sessionObj.user;
          sessionObject.token = sessionObj.token;
          sessionObject.loggedIn = sessionObj.loggedIn;
      }
      else{
        if(window.location.pathname != '/login'){
          window.location.href = '/login';
        }
      }
    }
    else{
      if(window.location.pathname != '/login'){
        window.location.href = '/login';
    }
  }
}
  
}
