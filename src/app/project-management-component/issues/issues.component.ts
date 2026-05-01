import { Component, Input } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { apiPaths } from '../../apiPaths';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AddIssueComponent } from './add-issue/add-issue.component';
import { CommentsComponent } from '../comments/comments.component';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [ButtonModule, FormsModule,SelectButtonModule,
    CommonModule, OverlayPanelModule, AddIssueComponent,
     TableModule, TagModule, PanelModule, CommentsComponent, ChipModule, DialogModule, EditorModule, TabViewModule, ImageModule],
  templateUrl: './issues.component.html'
})
export class IssuesComponent {
  allIssues:any[] = [];
  modulesList: any[] = [];
  activeModuleIndex: number = 0;
  addIssueTrue=false;
  selectedIssue:any;
  @Input('selectedProject') selectedProject:any;
  justifyOptions: any[] = [
    { icon: 'pi pi-credit-card', value: 'card' },
    { icon: 'pi pi-table', value: 'table' }
];
selectedView = 'card';
issueStatusConfig:any = {
    'Not Started': 'contrast',
    'In Progress': 'info',
    'Completed': 'success'
  };
  issuePriorityConfig:any = {
  'Low':  'secondary',
   'Medium': 'warning',
    'High':'danger'
  }

constructor(private apiService:ApiService) { }

  extractImage(html: string): string | undefined {
    if (!html) return undefined;
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : undefined;
  }
  
  stripHtml(html: string): string {
    if (!html) return '';
    let text = html.replace(/<[^>]*>?/gm, '');
    return text.length > 60 ? text.substring(0, 60) + '...' : text;
  }


  ngOnChanges(){
    this.getModules();
    this.getIssues(this.selectedProject._id);
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
      this.getIssues(this.selectedProject._id);
  }

  getIssues(projectId:string){
    let moduleId = this.modulesList[this.activeModuleIndex]?._id || 'ALL';
    this.apiService.get(apiPaths.getIssues+'?projectId=' + projectId + '&moduleId=' + moduleId).subscribe({
      next: (response:any) => {
        console.log(response);
        this.allIssues = response.issues;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  editIssue(){

    console.log('Edit Discussion', this.selectedIssue);
    setTimeout(() => {
      this.selectedIssue = null;
    },1000)
  }
  
  deleteIssue(){
    console.log('Delete Discussion', this.selectedIssue);
    setTimeout(() => {
      this.selectedIssue = null;
    },1000)
    this.apiService.get(apiPaths.deleteTask+"?taskId=" + this.selectedIssue._id).subscribe({
      next: (response:any) => {
        this.getIssues(this.selectedProject._id);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
