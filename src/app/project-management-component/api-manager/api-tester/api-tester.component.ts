import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export interface KVRow {
  key: string;
  value: string;
  enabled: boolean;
}

export interface TesterResponse {
  status: number;
  statusText: string;
  body: any;
  rawBody: string;
  respHeaders: KVRow[];
  time: number;
  isJson: boolean;
}

@Component({
  selector: 'app-api-tester',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    NgxJsonViewerModule,
    InputTextareaModule,
    TabViewModule,
    InputSwitchModule,
    ProgressSpinnerModule
  ],
  templateUrl: './api-tester.component.html',
  styleUrls: ['./api-tester.component.scss']
})
export class ApiTesterComponent implements OnInit, OnChanges {
  @Input() api: any;
  @Input() projectId: string = '';
  @Output() closeTester = new EventEmitter<void>();

  // ─── Enumerations ────────────────────────────────────────────────────────────
  readonly methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  // ─── Request state ───────────────────────────────────────────────────────────
  method = 'GET';
  baseUrl = '';
  endpoint = '';
  headers: KVRow[] = [];
  queryParams: KVRow[] = [];
  bodyText = '';

  // ─── UI state ────────────────────────────────────────────────────────────────
  activeReqTab = 0;   // 0=Headers | 1=Params | 2=Body
  activeRespTab = 0;  // 0=Body    | 1=Headers
  isLoading = false;
  baseUrlSavedFlash = false;
  bodyCopied = false;

  // ─── Response state ───────────────────────────────────────────────────────────
  response: TesterResponse | null = null;

  private get storageKey(): string {
    return `api_tester_baseurl_${this.projectId}`;
  }

  constructor(private http: HttpClient) {}

  // ─── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (this.projectId) {
      this.baseUrl = localStorage.getItem(this.storageKey) || '';
    }
    this.initFromApi();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.projectId) {
      this.baseUrl = localStorage.getItem(this.storageKey) || '';
    }
    if (changes['api'] && this.api) {
      this.initFromApi();
    }
  }

  // ─── Initialisation ──────────────────────────────────────────────────────────
  initFromApi(): void {
    if (!this.api) return;

    this.method   = this.api.apiMethod   || 'GET';
    this.endpoint = this.api.apiEndpoint || '';
    this.response = null;
    this.bodyText = this.api.apiBody
      ? JSON.stringify(this.api.apiBody, null, 2)
      : '';

    this.headers = [
      ...(this.api.apiHeaders || []).map((h: any) => ({
        key: h.key || '', value: h.value || '', enabled: true
      })),
      { key: '', value: '', enabled: true }
    ];

    this.queryParams = [
      ...(this.api.apiQueryParams || []).map((p: any) => ({
        key: p.key || '', value: '', enabled: true
      })),
      { key: '', value: '', enabled: true }
    ];
  }

  // ─── Base URL ────────────────────────────────────────────────────────────────
  saveBaseUrl(): void {
    localStorage.setItem(this.storageKey, this.baseUrl);
    this.baseUrlSavedFlash = true;
    setTimeout(() => (this.baseUrlSavedFlash = false), 2000);
  }

  get fullUrl(): string {
    const base = (this.baseUrl || '').replace(/\/$/, '');
    const ep   = this.endpoint.startsWith('/') ? this.endpoint : `/${this.endpoint}`;
    return base + ep;
  }

  // ─── KV helpers ──────────────────────────────────────────────────────────────
  addHeader()              { this.headers.push({ key: '', value: '', enabled: true }); }
  removeHeader(i: number)  { this.headers.splice(i, 1); }

  addParam()               { this.queryParams.push({ key: '', value: '', enabled: true }); }
  removeParam(i: number)   { this.queryParams.splice(i, 1); }

  // ─── Request building ────────────────────────────────────────────────────────
  private buildFinalUrl(): string {
    const activeParams = this.queryParams.filter(p => p.enabled && p.key.trim());
    if (!activeParams.length) return this.fullUrl;
    const qs = activeParams
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    return `${this.fullUrl}?${qs}`;
  }

  // ─── Send ─────────────────────────────────────────────────────────────────────
  sendRequest(): void {
    this.isLoading = true;
    this.response  = null;

    const headersObj: Record<string, string> = {};
    this.headers
      .filter(h => h.enabled && h.key.trim())
      .forEach(h => (headersObj[h.key] = h.value));

    let body: any = null;
    if (['POST', 'PUT', 'PATCH'].includes(this.method) && this.bodyText.trim()) {
      try   { body = JSON.parse(this.bodyText); }
      catch { body = this.bodyText; }
    }

    const t0 = Date.now();

    this.http
      .request(this.method, this.buildFinalUrl(), {
        headers:      new HttpHeaders(headersObj),
        body,
        observe:      'response',
        responseType: 'text',
        withCredentials: false
      })
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          this.handleResponse(resp.status, resp.statusText, resp.body || '', resp.headers.keys().map(k => ({ key: k, value: resp.headers.get(k) || '', enabled: true })), Date.now() - t0);
        },
        error: (err: HttpErrorResponse) => {
          this.handleResponse(err.status, err.statusText || 'Error', err.error || err.message || '', [], Date.now() - t0);
        }
      });
  }

  private handleResponse(
    status: number,
    statusText: string,
    rawBody: string,
    respHeaders: KVRow[],
    time: number
  ): void {
    let body: any = rawBody;
    let isJson = false;
    try {
      body   = JSON.parse(rawBody);
      isJson = true;
    } catch { /* keep raw */ }

    this.response  = { status, statusText, body, rawBody, respHeaders, time, isJson };
    this.isLoading = false;
  }

  // ─── Utilities ────────────────────────────────────────────────────────────────
  getStatusSeverity(status: number): 'success' | 'info' | 'warning' | 'danger' {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'info';
    if (status >= 400 && status < 500) return 'warning';
    return 'danger';
  }

  copyBody(): void {
    const text = this.response?.isJson
      ? JSON.stringify(this.response.body, null, 2)
      : (this.response?.rawBody || '');
    navigator.clipboard.writeText(text).then(() => {
      this.bodyCopied = true;
      setTimeout(() => (this.bodyCopied = false), 2000);
    });
  }

  get methodClass(): string {
    return `method-${(this.method || 'GET').toLowerCase()}`;
  }

  get activeHeaderCount(): number {
    return this.headers.filter(h => h.enabled && h.key.trim()).length;
  }

  get activeParamCount(): number {
    return this.queryParams.filter(p => p.enabled && p.key.trim()).length;
  }
}
