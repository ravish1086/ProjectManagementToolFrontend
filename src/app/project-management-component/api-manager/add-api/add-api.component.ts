import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { apiPaths } from '../../../apiPaths';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-add-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, InputTextareaModule, CheckboxModule, FieldsetModule, NgxJsonViewerModule],
  templateUrl: './add-api.component.html'
})
export class AddApiComponent implements OnInit {
  @Input() selectedProject: any;
  @Input() modules: any[] = [];
  @Input() selectedApi: any = null;
  @Output() apiAdded = new EventEmitter<any>();

  apiForm!: FormGroup;
  methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  paramTypes = ['String', 'Number', 'Boolean'];

  parsedBody: any = null;
  parsedResponse: any = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiForm = this.fb.group({
      moduleId: [this.selectedApi?.moduleId?._id || this.selectedApi?.moduleId || '', Validators.required],
      apiName: [this.selectedApi?.apiName || '', Validators.required],
      apiMethod: [this.selectedApi?.apiMethod || 'GET', Validators.required],
      apiEndpoint: [this.selectedApi?.apiEndpoint || '', Validators.required],
      apiDescription: [this.selectedApi?.apiDescription || ''],
      apiHeaders: this.fb.array([]),
      apiQueryParams: this.fb.array([]),
      apiBodyText: [this.selectedApi?.apiBody ? JSON.stringify(this.selectedApi.apiBody, null, 2) : ''],
      apiResponseText: [this.selectedApi?.apiResponses && this.selectedApi?.apiResponses.length > 0 ? JSON.stringify(this.selectedApi.apiResponses[0].responseBody, null, 2) : '']
    });

    if (this.selectedApi?.apiHeaders) {
      this.selectedApi.apiHeaders.forEach((h: any) => this.addHeader(h));
    }
    if (this.selectedApi?.apiQueryParams) {
      this.selectedApi.apiQueryParams.forEach((q: any) => this.addQueryParam(q));
    }

    this.parseJsonFields();
    this.apiForm.get('apiBodyText')?.valueChanges.subscribe(() => this.parseJsonFields());
    this.apiForm.get('apiResponseText')?.valueChanges.subscribe(() => this.parseJsonFields());
  }

  get apiHeaders() { return this.apiForm.get('apiHeaders') as FormArray; }
  get apiQueryParams() { return this.apiForm.get('apiQueryParams') as FormArray; }

  addHeader(header?: any) {
    this.apiHeaders.push(this.fb.group({
      key: [header?.key || '', Validators.required],
      value: [header?.value || ''],
      description: [header?.description || '']
    }));
  }

  removeHeader(index: number) { this.apiHeaders.removeAt(index); }

  addQueryParam(param?: any) {
    this.apiQueryParams.push(this.fb.group({
      key: [param?.key || '', Validators.required],
      type: [param?.type || 'String'],
      description: [param?.description || ''],
      required: [param?.required || false]
    }));
  }

  removeQueryParam(index: number) { this.apiQueryParams.removeAt(index); }

  parseJsonFields() {
    try {
      const body = this.apiForm.get('apiBodyText')?.value;
      this.parsedBody = body ? JSON.parse(body) : null;
    } catch(e) { this.parsedBody = null; }

    try {
      const resp = this.apiForm.get('apiResponseText')?.value;
      this.parsedResponse = resp ? JSON.parse(resp) : null;
    } catch(e) { this.parsedResponse = null; }
  }

  saveApi() {
    if (this.apiForm.invalid) return;

    const formVal = this.apiForm.value;
    
    // Parse JSON strings back to objects
    let apiBody = null;
    let apiResponses:any[] = [];
    
    try { if (formVal.apiBodyText) apiBody = JSON.parse(formVal.apiBodyText); } catch(e) {}
    try { 
        if (formVal.apiResponseText) {
            apiResponses = [{ statusCode: 200, responseBody: JSON.parse(formVal.apiResponseText), description: 'Success' }];
        }
    } catch(e) {}

    const payload = {
      projectId: this.selectedProject._id,
      moduleId: formVal.moduleId,
      apiName: formVal.apiName,
      apiMethod: formVal.apiMethod,
      apiEndpoint: formVal.apiEndpoint,
      apiDescription: formVal.apiDescription,
      apiHeaders: formVal.apiHeaders,
      apiQueryParams: formVal.apiQueryParams,
      apiBody: apiBody,
      apiResponses: apiResponses
    };

    if (this.selectedApi) {
        this.apiService.put(`${apiPaths.updateApi}/${this.selectedApi._id}`, payload).subscribe({
            next: (res) => this.apiAdded.emit(res),
            error: (err) => console.error(err)
        });
    } else {
        this.apiService.post(apiPaths.createApi, payload).subscribe({
            next: (res) => this.apiAdded.emit(res),
            error: (err) => console.error(err)
        });
    }
  }
}
