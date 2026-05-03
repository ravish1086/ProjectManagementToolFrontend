import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { apiPaths } from '../../apiPaths';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, NgSelectModule, FormsModule],
  templateUrl: './teams.component.html'
})
export class TeamsComponent {
  @Input('selectedProject') selectedProject:any;
  @Output('projectUpdated') projectUpdated = new EventEmitter<any>();
  projectMembers:any[] = [];
  usersList:any[] = [];
  manageMembersVisible = false;
  selectedMembers:any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnChanges(){
    this.getTeamMembers();
  }

  getTeamMembers(){
    this.projectMembers = this.selectedProject.projectMembers;
  }

  openManageMembers(){
    this.getUsers();
    this.selectedMembers = this.projectMembers.map(m => m._id);
    this.manageMembersVisible = true;
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

  saveMembers(){
    this.apiService.put(`${apiPaths.updateProject}/${this.selectedProject._id}`, { projectMembers: this.selectedMembers }).subscribe({
      next: (response:any) => {
        this.manageMembersVisible = false;
        this.projectUpdated.emit();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
