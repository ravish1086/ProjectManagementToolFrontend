import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { apiPaths } from '../../../apiPaths';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, ReactiveFormsModule, NgSelectModule, InputTextModule, CalendarModule],
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  @Input('selectedTask') selectedtask!: any;
  @Input('selectedProject') selectedProject!: any;
  @Output('taskAdded') taskAdded = new EventEmitter<any>();
  formGroupName!: FormGroup;
  taskStatusList:string[] = ['Not Started', 'In Progress', 'Completed'];
  taskPriorityList:string[] = ['Low', 'Medium', 'High'];
  localSelectedTask:any;
  selectedFile!: File;
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    console.log(this.selectedProject)
    this.formGroupName = new FormGroup({
      projectId: new FormControl(this.selectedProject._id,[]),
      _id: new FormControl(null,[]),
      taskId: new FormControl(null,[]),
      taskName: new FormControl(null,[]),
      taskDescription: new FormControl(null,[]),
      taskStatus: new FormControl(this.taskStatusList[0],[]),
      taskMembers: new FormControl(null,[]),
      taskDueDate: new FormControl(null,[]),
      taskPriority: new FormControl(this.taskPriorityList[0],[]),
      // taskComments: new FormControl(null,[]),
      })

      if(this.selectedtask){
        this.localSelectedTask = JSON.parse(JSON.stringify(this.selectedtask));
    this.localSelectedTask.taskMembers = this.localSelectedTask.taskMembers.map((member:any) => member._id);
        this.formGroupName.patchValue(this.localSelectedTask);
      }
    }

    

    saveUpdateForm(): void {
      let url = '';
      let reqObj =this.formGroupName.value
      reqObj._id = this.localSelectedTask?this.localSelectedTask._id:null;
      if(this.localSelectedTask){
        url = apiPaths.updateTask;
      }
      else{
       url = apiPaths.createTask;
      }
      const formData = new FormData();
      formData.append('_id', this.formGroupName.value._id);
      formData.append('projectId', this.selectedProject._id);
      formData.append('taskId', this.localSelectedTask?this.localSelectedTask._id:null);
      formData.append('taskName', this.formGroupName.value.taskName);
      formData.append('taskDescription', this.formGroupName.value.taskDescription);
      formData.append('taskStatus', this.formGroupName.value.taskStatus);
      // formData.append('taskMembers', (this.formGroupName.value.taskMembers));
      const taskMembers = this.formGroupName.value.taskMembers; // This should be an array
      taskMembers.forEach((member: string) => {
        formData.append('taskMembers[]', member); // Append each member with a consistent key
      });
      formData.append('taskDueDate', this.formGroupName.value.taskDueDate);
      formData.append('taskPriority', this.formGroupName.value.taskPriority);
      if (this.selectedFile) {
        formData.append('taskAttachment', this.selectedFile);
      }
        this.apiService.post(url, formData).subscribe({
          next: (response:any) => {
            this.taskAdded.emit(response);
            console.log(response)
          },
        error: (error) => {
          console.error(error); 
        }
      });
    }

    onFileSelected(event: any): void {
      const file:any = event?.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    }
}
