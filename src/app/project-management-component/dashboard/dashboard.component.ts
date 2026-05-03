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

  tasks: any[] = [];
  issues: any[] = [];
  discussions: any[] = [];
  notes: any[] = [];

  loadingTasks = false;
  loadingIssues = false;
  loadingDiscussions = false;
  loadingNotes = false;

  loadedTabs: Set<number> = new Set();

  taskStatusConfig: any = {
    'To Do': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
  };
  taskPriorityConfig: any = {
    'Low': 'success',
    'Medium': 'warning',
    'High': 'danger'
  };
  issueStatusConfig: any = {
    'Open': 'danger',
    'In Progress': 'warning',
    'Resolved': 'success',
    'Closed': 'info'
  };
  issuePriorityConfig: any = {
    'Low': 'success',
    'Medium': 'warning',
    'High': 'danger',
    'Critical': 'danger'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Load the first tab (Tasks) on init
    this.onTabChange({ index: 0 });
  }

  onTabChange(event: any) {
    const index = event.index;
    if (this.loadedTabs.has(index)) return; // Already loaded, skip
    this.loadedTabs.add(index);

    switch (index) {
      case 0: this.fetchTasks(); break;
      case 1: this.fetchIssues(); break;
      case 2: this.fetchDiscussions(); break;
      case 3: this.fetchNotes(); break;
    }
  }

  fetchTasks() {
    this.loadingTasks = true;
    this.apiService.get(apiPaths.getDashboardTasks).subscribe({
      next: (res: any) => { this.tasks = res.tasks; this.loadingTasks = false; },
      error: () => { this.loadingTasks = false; }
    });
  }

  fetchIssues() {
    this.loadingIssues = true;
    this.apiService.get(apiPaths.getDashboardIssues).subscribe({
      next: (res: any) => { this.issues = res.issues; this.loadingIssues = false; },
      error: () => { this.loadingIssues = false; }
    });
  }

  fetchDiscussions() {
    this.loadingDiscussions = true;
    this.apiService.get(apiPaths.getDashboardDiscussions).subscribe({
      next: (res: any) => { this.discussions = res.discussions; this.loadingDiscussions = false; },
      error: () => { this.loadingDiscussions = false; }
    });
  }

  fetchNotes() {
    this.loadingNotes = true;
    this.apiService.get(apiPaths.getDashboardNotes).subscribe({
      next: (res: any) => { this.notes = res.notes; this.loadingNotes = false; },
      error: () => { this.loadingNotes = false; }
    });
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
