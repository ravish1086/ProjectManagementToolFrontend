import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ApiService } from '../services/api.service';
import { apiPaths } from '../apiPaths';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AddTaskComponent } from "./tasks/add-task/add-task.component";
import { AddIssueComponent } from './issues/add-issue/add-issue.component';
import { AddDiscussionComponent } from './discussions/add-discussion/add-discussion.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TasksComponent } from "./tasks/tasks.component";
import { IssuesComponent } from "./issues/issues.component";
import { DiscussionsComponent } from "./discussions/discussions.component";
import { TeamsComponent } from "./teams/teams.component";
import { sessionObject } from '../login/session';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { AddProjectComponent } from "./add-project/add-project.component";
import { io } from 'socket.io-client';
import { NotificationsComponent } from "../notifications/notifications.component";
import { MessageService } from 'primeng/api';
import { ChatComponent } from "../chat/chat.component";
import { SubjectUtilService } from '../services/subject-util.service';
import { ApiManagerComponent } from './api-manager/api-manager.component';
import { environment } from '../../environments/environment';
import { NotesComponent } from './notes/notes.component';

@Component({
  selector: 'app-project-management-component',
  standalone: true,
  imports: [CommonModule, TabViewModule, SidebarModule, ButtonModule,
    OverlayPanelModule, DialogModule, MenuModule,
    AddTaskComponent, AddIssueComponent, AddDiscussionComponent,
    SelectButtonModule, FormsModule, TasksComponent, IssuesComponent,
    DiscussionsComponent, TeamsComponent, AddProjectComponent, NotificationsComponent, ChatComponent,
    ApiManagerComponent, NotesComponent],
  templateUrl: './project-management-component.component.html'
})
export class ProjectManagementComponentComponent {
  receiver:any;
  sessionObject = sessionObject;
  notificationsVisible = false;
addProjectTrue=false;
editProjectTrue=false;
  sidebarVisible=false;
  projectMenuItems: any[] = [
    { label: 'Edit Project', icon: 'pi pi-pencil', command: () => { this.editProjectTrue = true; } },
    { label: 'Archive Project', icon: 'pi pi-trash', command: () => { this.archiveProject(); } }
  ];
  projectsList:any[] = [];
  notificationsList:any[] = [];
  selectedProject:any;
  activeUsers:any[] = [];
  activeIndex = 0;
  selectedView = 'tasks';
  justifyOptions: any[] = [
    { icon: 'pi pi-credit-card', justify: 'card' },
    { icon: 'pi pi-table', justify: 'table' }
];
  sessionUser:any = {
    loggedIn: true,
    userName: 'John Doe'
  }
  constructor(private apiService:ApiService, private router:Router, 
    private messageService:MessageService, private viewportScroller:ViewportScroller,
  private subjectUtilService:SubjectUtilService) { }

  ngOnInit(): void {
    this.getAllProjects();
    this.getNotifications();
    // this.createSocketConnection();
    this.checkNotificationPermission();
  }

  selectProject(project:any){
    this.selectedProject = project;
    this.sidebarVisible = false;

  }

  getAllProjects(){
    this.apiService.get(apiPaths.getProjects).subscribe({
      next: (response:any) => {
        this.projectsList = response.projects;
        if(this.selectedProject) {
            let found = this.projectsList.find(p => p._id === this.selectedProject._id);
            this.selectedProject = found || this.projectsList[0];
        } else {
            this.selectedProject = this.projectsList[0];
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  archiveProject() {
    if(confirm(`Are you sure you want to archive project "${this.selectedProject.projectName}"?`)) {
      this.apiService.put(`${apiPaths.updateProject}/${this.selectedProject._id}`, { isArchived: true }).subscribe({
        next: (res: any) => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Project archived successfully'});
          this.selectedProject = null;
          this.getAllProjects();
        },
        error: (err: any) => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to archive project'});
        }
      });
    }
  }

  

  viewComments(entityId:string, entityType:string, entity:any){
    this.apiService.get(apiPaths.getComments+'?entityId=' + entityId + '&entityType=' + entityType).subscribe({
      next: (response:any) => {
        entity.discussionComments = response.comments;
      }
    });
  }

  addComment(entityId:string, entityType:string, comment:any, discussion:any){
    let userId = '672c64f72363828105fe1e84'
    let commentObj = {
      "comment": comment.value,
      "entityType": entityType,
      "entityId": entityId,
      "commentedBy": userId
  }
    this.apiService.post(apiPaths.addComment, commentObj).subscribe({
      next: (response:any) => {
        comment.value = '';
       this.viewComments(entityId, entityType, discussion);
      }
    });
  }

  getNotifications(){
    this.apiService.get(apiPaths.getNotifications).subscribe({
      next: (response:any) => {
        this.notificationsList = response.notifications;
      }
    });
  }

  getActiveUsers(){
    this.apiService.get(apiPaths.getActiveUsers).subscribe({
      next: (response:any) => {
        this.activeUsers = response.users;
      }
    });
  }

  //call notification API method when io connection receives newNotification event
  socket:any//io(environment.apiUrl);
  
  newNotificationSocketConnection(){
    this.socket.on('newNotification', (data:any) => {
      this.messageService.add({severity:'info', summary:'You have a new notification', detail:data.title});
      this.pushNotificationToBrowser({
        title: data.title,
        body: data.message,
        icon: '',
        url: ''
      })
      this.getNotifications();
    });
  }

  newMessageSocketConnection(){
    this.socket.on('newMessage', (data:any) => {
      console.log(sessionObject.activeChat, data.sender._id != sessionObject.activeChat);
      if(data.sender._id != sessionObject.activeChat){
        this.messageService.add({severity:'info', summary:'You have a new message from : '+ data.sender.fullName , detail:data.message});
      }
      this.subjectUtilService.sendMessage(data);
    });
  }

  getActiveUserSocketConnection(){
    this.socket.on('activeUsers', (data:any) => {
      this.getActiveUsers();
    });
  }

  createSocketConnection(){
    this.socket.on('connect', () => {
      console.log(`Connected to server with ID: ${this.socket.id}`);
      this.socket.emit('registerUser', sessionObject.user._id);
    });

    //listen for newNotification event
    this.newNotificationSocketConnection()

    //listen for activeUsers event
    this.getActiveUserSocketConnection();

    //listen for newMessage event
    this.newMessageSocketConnection();
  }

  goToAnchor(anchor:string){
    this.viewportScroller.scrollToAnchor(anchor);
  }

  logout() {
    sessionObject.loggedIn = false;
    localStorage.removeItem('sessionObject');
    this.router.navigate(['/login']);
  }

  pushNotificationToBrowser(data:any) {
    // if (Notification.permission == "granted") {
        const notificationOptions = {
            body: data.body, // Message content
            icon: data.icon || '/assets/noti.png', // Optional icon
            data: data.url || '/', // Optional URL to open on click
        };

        const notification = new Notification(data.title, notificationOptions);
        console.log(notification);
        // Handle notification click
        notification.onclick = () => {
            window.open(data.url || '/');
        };
    // }
}

  checkNotificationPermission() {
    if (Notification.permission === "default" || Notification.permission === "denied") {
      Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
          console.log("User denied notifications.");
        }
      });
    }
    console.log(Notification.permission);
  }

  openChat(member:any)
  {
    this.receiver = member;
     sessionObject.activeChat = this.receiver._id;  
     this.sidebarVisible=false;
  }

  closeChat()
  {
      this.receiver=null; 
      sessionObject.activeChat=''
  }
}
