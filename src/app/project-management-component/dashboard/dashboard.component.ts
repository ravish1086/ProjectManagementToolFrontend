import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { apiPaths } from '../../apiPaths';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TabViewModule, TagModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  apiUrl = environment.apiUrl;
  dashboardData: any = {
    tasks: [],
    issues: [],
    discussions: [],
    notes: []
  };
  isLoading = true;

  taskStatusConfig:any = {
    'To Do': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
  }
  taskPriorityConfig:any = {
    'Low': 'success',
    'Medium': 'warning',
    'High': 'danger'
  }
  issueStatusConfig:any = {
    'Open': 'danger',
    'In Progress': 'warning',
    'Resolved': 'success',
    'Closed': 'info'
  }
  issuePriorityConfig:any = {
    'Low': 'success',
    'Medium': 'warning',
    'High': 'danger',
    'Critical': 'danger'
  }

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getDashboardData();
  }

  getDashboardData() {
    this.isLoading = true;
    this.apiService.get(apiPaths.getDashboardData).subscribe({
      next: (response: any) => {
        this.dashboardData = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  extractImage(html: string): string | null {
    if (!html) return null;
    const div = document.createElement('div');
    div.innerHTML = html;
    const img = div.querySelector('img');
    return img ? img.src : null;
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
