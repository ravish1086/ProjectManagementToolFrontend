import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { apiPaths } from '../../apiPaths';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';

import { TableModule } from 'primeng/table';
import { AddDiscussionComponent } from './add-discussion/add-discussion.component';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommentsComponent } from "../comments/comments.component";
@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [ButtonModule, FormsModule, SelectButtonModule,
    CommonModule, OverlayPanelModule, AddDiscussionComponent,
    TableModule, TagModule, PanelModule, PanelMenuModule, BadgeModule, RippleModule,
    ChipModule, MenuModule, CommentsComponent, DialogModule],
  templateUrl: './discussions.component.html'
})
export class DiscussionsComponent {
  allDiscussions:any[] = [];
  @ViewChild('newDiscussion') newDiscussion!: any;
  addDiscussionTrue=false;
  @Input('selectedProject') selectedProject:any;
  discussionStatusConfig:any = {
    'Open': 'info',
    'Closed': 'success'
  };
  items:MenuItem[];
  selectedDiscussion:any;
  constructor(private apiService:ApiService) { 
    this.items = [
      {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
            this.addDiscussionTrue = true;
              this.editDiscussion();
          }
      },
      {
          separator: true
      },
      {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => {
            this.deleteDiscussion();
          }
      }
  ];

  }


  ngOnChanges(){
    this.getDiscussions(this.selectedProject._id);
  
  }

  getDiscussions(projectId:string){
    this.apiService.get(apiPaths.getDiscussions+'?projectId=' + projectId).subscribe({
      next: (response:any) => {
        console.log(response);
        this.allDiscussions = response.discussions;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }



  editDiscussion(){

    console.log('Edit Discussion', this.selectedDiscussion);
    setTimeout(() => {
      this.selectedDiscussion = null;
    },1000)
  }

  deleteDiscussion(){
    console.log('Delete Discussion', this.selectedDiscussion);
    setTimeout(() => {
      this.selectedDiscussion = null;
    },1000)
    this.apiService.get(apiPaths.deleteDiscussion+"?discussionId=" + this.selectedDiscussion._id).subscribe({
      next: (response:any) => {
        this.getDiscussions(this.selectedProject._id);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
