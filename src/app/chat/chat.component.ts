import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { apiPaths } from '../apiPaths';
import { sessionObject } from '../login/session';
import { SubjectUtilService } from '../services/subject-util.service';
import { Subject, takeUntil } from 'rxjs';

interface Message {
  message: string;
  sender: string;
  receiver: string;
  status: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent {
  $destroy = new Subject();
  userId = sessionObject.user._id // Example user ID
  @Input('receiver') receiver!: any;
  @Output('closeChat') closeChat = new EventEmitter();
  newMessage = '';
  messages: any[] = [
    {
      message: "Hello, how are you?",
      sender: "672c659523",
      receiver: "672c64f723",
      status: "unread"
    }
  ];

  constructor(private apiService:ApiService, private subjectUtilService:SubjectUtilService) { }

  ngOnChanges(){
    this.getMessages();
    this.setupSubscriptions();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        message: this.newMessage,
        sender: this.userId,
        receiver: this.receiver._id, // Example receiver ID
        status: 'unread'
      };

      this.apiService.post(apiPaths.sendMessage, message).subscribe({
        next: (response: any) => {
          if(response.status == 200){
            this.messages.push(response.message);
            this.scrollContainerToBottom();
            this.newMessage = '';
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  getMessages() {
    this.apiService.get(apiPaths.getMessages + '?receiver=' + this.receiver._id).subscribe({
      next: (response: any) => {
        this.messages = response.messages;
        
          this.scrollContainerToBottom();
        
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  
  setupSubscriptions(){
    this.subjectUtilService.getMessage().pipe(takeUntil(this.$destroy)).subscribe({
      next: (message:any) => {
        console.log('Message Received', message, this.receiver);
        if(message.sender._id == this.receiver._id){
          this.messages.push(message);
          this.scrollContainerToBottom();
        }
      }
    });
  }

  closeChatWindow(){
    this.closeChat.emit();
  }

  scrollContainerToBottom(){
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-container');
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 200);
    
  }

  ngOnDestroy(){
    this.$destroy.next(true);
  }
}