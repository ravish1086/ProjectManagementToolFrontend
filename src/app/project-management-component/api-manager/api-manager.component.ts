import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { apiPaths } from '../../apiPaths';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AddModuleComponent } from './add-module/add-module.component';
import { AddApiComponent } from './add-api/add-api.component';
import { ApiTesterComponent } from './api-tester/api-tester.component';

@Component({
  selector: 'app-api-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, DialogModule, TagModule, ListboxModule, TooltipModule, NgxJsonViewerModule, AddModuleComponent, AddApiComponent, ApiTesterComponent],
  templateUrl: './api-manager.component.html'
})
export class ApiManagerComponent implements OnChanges {
  @Input() selectedProject: any;

  modules: any[] = [];
  apis: any[] = [];
  selectedModule: any = null;

  showAddModule = false;
  showAddApi = false;
  showApiTester = false;
  selectedApiToEdit: any = null;
  selectedModuleToEdit: any = null;
  selectedApiToTest: any = null;

  get moduleOptions() {
    return [{_id: 'ALL', moduleName: 'All Modules'}, ...this.modules];
  }

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject'] && this.selectedProject) {
      this.fetchModules();
      this.fetchApis(); // Fetch all by default
    }
  }

  fetchModules() {
    this.apiService.get(`${apiPaths.getProjectModules}/${this.selectedProject._id}`).subscribe({
      next: (res: any) => {
        this.modules = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  fetchApis() {
    let url = `${apiPaths.getApis}/${this.selectedProject._id}`;
    if (this.selectedModule && this.selectedModule._id !== 'ALL') {
      url += `?moduleId=${this.selectedModule._id}`;
    }
    
    this.apiService.get(url).subscribe({
      next: (res: any) => {
        this.apis = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  onModuleSelect(event: any) {
    this.fetchApis();
  }

  openAddModule() {
    this.selectedModuleToEdit = null;
    this.showAddModule = true;
  }

  openAddApi(api?: any) {
    this.selectedApiToEdit = api || null;
    this.showAddApi = true;
  }

  onModuleSaved() {
    this.showAddModule = false;
    this.fetchModules();
  }

  onApiSaved() {
    this.showAddApi = false;
    this.fetchApis();
  }

  getMethodSeverity(method: string) {
    switch(method) {
      case 'GET': return 'success';
      case 'POST': return 'warning';
      case 'PUT': return 'info';
      case 'DELETE': return 'danger';
      default: return 'info';
    }
  }

  deleteApi(id: string) {
    if(confirm("Are you sure you want to delete this API?")) {
      this.apiService.delete(`${apiPaths.deleteApi}/${id}`).subscribe({
        next: () => this.fetchApis(),
        error: (err) => console.error(err)
      });
    }
  }

  openApiTester(api: any) {
    this.selectedApiToTest = api;
    this.showApiTester = true;
  }
}

