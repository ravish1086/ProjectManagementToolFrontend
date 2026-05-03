import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

 import { ButtonModule } from 'primeng/button'; 
 import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { apiPaths } from '../../apiPaths';
@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, InputTextModule
    , ButtonModule, ReactiveFormsModule],
  templateUrl: './add-project.component.html'
})
export class AddProjectComponent {
  @Input('editProjectData') editProjectData: any;
  @Output('projectAdded') projectAdded = new EventEmitter<any>();
  formGroupeName!: FormGroup;
  usersList:any[] = [];
  projectStatusList:string[] = ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

  constructor(private apiService:ApiService) { }

  ngOnInit(){
    this.initForm();
    if (this.editProjectData) {
      this.formGroupeName.patchValue({
        projectId: this.editProjectData.projectId,
        projectName: this.editProjectData.projectName,
        projectDescription: this.editProjectData.projectDescription,
        projectManager: this.editProjectData.projectManager?._id || this.editProjectData.projectManager,
        projectMembers: this.editProjectData.projectMembers?.map((m: any) => m._id || m),
        projectStatus: this.editProjectData.projectStatus,
      });
    }
    this.getUsers();
  }

  initForm(): void {
    this.formGroupeName = new FormGroup({
      projectId: new FormControl(null,[]),
      projectName: new FormControl(null,[Validators.required]),
      projectDescription: new FormControl(null,[Validators.required]),
      projectManager: new FormControl(null,[Validators.required]),
      projectMembers: new FormControl(null,[Validators.required]),
      projectStatus: new FormControl(this.projectStatusList[0],[Validators.required]),
      })
  }

  saveUpdateForm(): void {
    if (this.editProjectData) {
      this.apiService.put(`${apiPaths.updateProject}/${this.editProjectData._id}`, this.formGroupeName.value).subscribe({
        next: (response:any) => {
          if(response.status == 200){
            this.projectAdded.emit(true);
          }
        },
        error: (error) => {
          console.error(error); 
        }
      });
    } else {
      this.apiService.post(apiPaths.createProject, this.formGroupeName.value).subscribe({
        next: (response:any) => {
          if(response.status == 200){
          this.projectAdded.emit(true);
          }
        },
      error: (error) => {
        console.error(error); 
      }
    });
    }
  }

  getUsers(): void {
    this.apiService.get(apiPaths.getUsers).subscribe({
      next: (response:any) => {
        this.usersList = response.users;
      },
    error: (error) => {
      console.error(error); 
    }
  });
  }
}
