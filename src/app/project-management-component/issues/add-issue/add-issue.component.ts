import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

 import { ButtonModule } from 'primeng/button'; 
 import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

import { NgSelectModule } from '@ng-select/ng-select';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { apiPaths } from '../../../apiPaths';
import { EditorModule } from 'primeng/editor';
@Component({
  selector: 'app-add-issue',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule,ButtonModule, ReactiveFormsModule,
     InputTextModule, CalendarModule, EditorModule],
  templateUrl: './add-issue.component.html'
})
export class AddIssueComponent {
  @Input('selectedProject') selectedProject!: any;
  @Input('selectedIssue') selectedIssue!: any;
  @Output('issueAdded') issueAdded = new EventEmitter<any>();
  formGroupName!: FormGroup;
  issueStatusList:string[] = ['Not Started', 'In Progress', 'Completed'];
  issuePriorityList:string[] = ['Low', 'Medium', 'High'];
  issueTypesList:string[] = ['Bug', 'Feature', 'Task', 'Improvement'];
  modulesList: any[] = [];
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.initForm();
    this.getModules();
  }

  getModules(): void {
    if(this.selectedProject) {
      this.apiService.get(apiPaths.getProjectModules + '/' + this.selectedProject._id).subscribe({
        next: (res: any) => {
          this.modulesList = res.data;
        },
        error: (err) => console.error(err)
      });
    }
  }

  initForm(): void {
    console.log(this.selectedProject)
    this.formGroupName = new FormGroup({
      issueProjectId: new FormControl(this.selectedProject._id,[]),
      moduleId: new FormControl(null,[]),
      issueTitle: new FormControl(null,[]),
      issueDescription: new FormControl(null,[]),
      issueStatus: new FormControl(this.issueStatusList[0],[]),
      issuePriority: new FormControl(this.issuePriorityList[0],[]),
      issueType: new FormControl(this.issueTypesList[0],[]),
      issueAssignee: new FormControl(null,[]),
      issueDueDate: new FormControl(null,[]),
      })

      if(this.selectedIssue){
        let localSelectedIssue = JSON.parse(JSON.stringify(this.selectedIssue));
        if (localSelectedIssue.moduleId && typeof localSelectedIssue.moduleId === 'object') {
            localSelectedIssue.moduleId = localSelectedIssue.moduleId._id;
        }
        this.formGroupName.patchValue(localSelectedIssue);
      }
  }

    

    saveUpdateForm(): void {
        this.apiService.post(apiPaths.createIssue, this.formGroupName.value).subscribe({
          next: (response:any) => {
            this.issueAdded.emit(response);
            console.log(response)
          },
        error: (error) => {
          console.error(error); 
        }
      });
    }

}
