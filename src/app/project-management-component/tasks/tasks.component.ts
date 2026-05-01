import { Component, Input } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { apiPaths } from '../../apiPaths';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AddTaskComponent } from "./add-task/add-task.component";
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { CommentsComponent } from '../comments/comments.component';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import {  MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ButtonModule, FormsModule,SelectButtonModule,
     CommonModule, OverlayPanelModule, AddTaskComponent, DialogModule,RippleModule, MenuModule,
      TableModule, TagModule, PanelModule, ChipModule, CommentsComponent, TabViewModule, ImageModule],
  templateUrl: './tasks.component.html'
})
export class TasksComponent {
  addTaskTrue=false;
  selectedTask:any;
  items:MenuItem[];
  dueType = 'Today';
  apiUrl = environment.apiUrl;
  @Input('selectedProject') selectedProject:any;
  justifyOptions: any[] = [
    { icon: 'pi pi-credit-card', value: 'card' },
    { icon: 'pi pi-table', value: 'table' }
];

taskDueOptions: any[] = [
  { icon: 'pi pi-exclamation-triangle', value: 'Overdue', label:'Overdue' },
  { icon: 'pi pi-clock', value: 'Today' , label:'Due Today'},
  { icon: 'pi pi-briefcase', value: 'All', label:'All Tasks' }

];

selectedView = 'card';
allTasks:any[] = [];
modulesList: any[] = [];
activeModuleIndex: number = 0;
  taskStatusConfig:any = {
    'Not Started': 'secondary',
    'In Progress': 'warning',
    'Completed': 'success'
  };
  taskPriorityConfig:any = {
  'Low':  'secondary',
   'Medium': 'darning',
    'High':'danger'
  }
constructor(private apiService:ApiService) { 
  this.items = [
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.addTaskTrue = true;
            this.editTask();
        }
    },
    {
        separator: true
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.deleteTask();
        }
    }
];
}

ngOnInit(): void {
}

ngOnChanges(){
  this.getModules();
  this.getTasks(this.selectedProject._id);
}

getModules(): void {
  if (this.selectedProject) {
    this.apiService.get(apiPaths.getProjectModules + '/' + this.selectedProject._id).subscribe({
      next: (res: any) => {
        this.modulesList = [{ _id: 'ALL', moduleName: 'All Modules' }, ...res.data];
      },
      error: (err) => console.error(err)
    });
  }
}

onModuleTabChange(event: any) {
    this.activeModuleIndex = event.index;
    this.getTasks(this.selectedProject._id);
}

getTasks(projectId:string){
  if(!this.selectedProject){
    this.allTasks = [];
    return;
  }
  let moduleId = this.modulesList[this.activeModuleIndex]?._id || 'ALL';
  this.apiService.get(apiPaths.getTasks+'?projectId=' + projectId + '&dueType=' + this.dueType + '&moduleId=' + moduleId).subscribe({
    next: (response:any) => {
      this.allTasks = response.tasks;
    },
    error: (error) => {
      console.error(error);
    }
  });
}

editTask(){

  console.log('Edit Discussion', this.selectedTask);
  setTimeout(() => {
    this.selectedTask = null;
  },1000)
}

deleteTask(){
  console.log('Delete Discussion', this.selectedTask);
  setTimeout(() => {
    this.selectedTask = null;
  },1000)
  this.apiService.get(apiPaths.deleteTask+"?taskId=" + this.selectedTask._id).subscribe({
    next: (response:any) => {
      this.getTasks(this.selectedProject._id);
    },
    error: (error) => {
      console.error(error);
    }
  })
}

fetchRecordsByDueType(){
  this.getTasks(this.selectedProject._id);
}

openFile(attachment:any){
  window.open(environment.apiUrl +"/"+ attachment.attachmentUrl, '_blank');
}
}
