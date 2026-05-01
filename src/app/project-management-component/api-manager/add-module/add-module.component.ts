import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { apiPaths } from '../../../apiPaths';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-module',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './add-module.component.html'
})
export class AddModuleComponent implements OnInit {
  @Input() selectedProject: any;
  @Input() selectedModule: any = null;
  @Output() moduleAdded = new EventEmitter<any>();

  moduleForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      moduleName: [this.selectedModule ? this.selectedModule.moduleName : '', Validators.required]
    });
  }

  saveModule() {
    if (this.moduleForm.invalid) return;

    const payload = {
      ...this.moduleForm.value,
      projectId: this.selectedProject._id
    };

    if (this.selectedModule) {
        // Update logic (we don't have update path in apiPaths yet but using direct path)
        this.apiService.put(apiPaths.createProjectModule.replace('create', this.selectedModule._id), payload).subscribe({
            next: (res) => this.moduleAdded.emit(res),
            error: (err) => console.error(err)
        });
    } else {
        this.apiService.post(apiPaths.createProjectModule, payload).subscribe({
            next: (res) => this.moduleAdded.emit(res),
            error: (err) => console.error(err)
        });
    }
  }
}
