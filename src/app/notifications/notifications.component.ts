import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
@Input('notifications') notifications:any[] = [];
@Output('clickEvent') clickEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  markAsRead(notification:any){
    notification.read = true;
  }

  markAllAsRead(){
    this.notifications.forEach((notification:any) => {
      notification.read = true;
    });
  }

  notificationClicked(notification:any){
    this.clickEvent.emit(notification);
  }

  deleteNotification(notification:any){
    this.notifications = this.notifications.filter((n:any) => n !== notification);
  }

  deleteAllNotifications(){
    this.notifications = [];
  }
}
