import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html'
})
export class TeamsComponent {
  @Input('selectedProject') selectedProject:any;
  projectMembers:any[] = [];
  constructor() { }

  ngOnChanges(){
    this.getTeamMembers();
  }

  getTeamMembers(){
    this.projectMembers = this.selectedProject.projectMembers;
  }
}
