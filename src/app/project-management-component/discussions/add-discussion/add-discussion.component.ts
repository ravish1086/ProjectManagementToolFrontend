import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { apiPaths } from '../../../apiPaths';
import { sessionObject } from '../../../login/session';

@Component({
  selector: 'app-add-discussion',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, ReactiveFormsModule, NgSelectModule, InputTextModule, CalendarModule],
  templateUrl: './add-discussion.component.html'
})
export class AddDiscussionComponent {
  @Input('selectedProject') selectedProject!: any;
  @Input('selectedDiscussion') selectedDiscussion!: any;
  @Output('discussionAdded') discussionAdded = new EventEmitter<any>();
  formGroupeName!: FormGroup;
  localSelectedDiscussion:any;
  discussionTypesList:string[] = ['Open', 'Closed'];
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    console.log(this.selectedProject)
    
    this.formGroupeName = new FormGroup({ 
      discussionId: new FormControl(null,[]),
      discussionForProject: new FormControl(this.selectedProject._id,[]),
      discussionTitle: new FormControl(null,[]),
      discussionDescription: new FormControl(null,[]),
      discussionMembers: new FormControl(null,[]),
      discussionType: new FormControl(this.discussionTypesList[1],[]),
      discussionOwner: new FormControl(sessionObject.user._id,[]),
      })

      if(this.selectedDiscussion){
        this.localSelectedDiscussion = JSON.parse(JSON.stringify(this.selectedDiscussion));
    this.localSelectedDiscussion.discussionMembers = this.localSelectedDiscussion.discussionMembers.map((member:any) => member._id);
        this.formGroupeName.patchValue(this.localSelectedDiscussion);
        this.formGroupeName.removeControl('discussionOwner');
      }
    }
    

    saveUpdateForm(): void {
      let url = '';
      let reqObj =this.formGroupeName.value
      reqObj._id = this.localSelectedDiscussion?this.localSelectedDiscussion._id:null;
      if(this.localSelectedDiscussion){
        url = apiPaths.updateDiscussion;
      }
      else{
       url = apiPaths.createDiscussion;

      }
        this.apiService.post(url, reqObj).subscribe({
          next: (response:any) => {
            this.discussionAdded.emit(response);
            console.log(response)
          },
        error: (error) => {
          console.error(error); 
        }
      });
    }
}

