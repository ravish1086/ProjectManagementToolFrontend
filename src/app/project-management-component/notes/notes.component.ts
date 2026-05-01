import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { apiPaths } from '../../apiPaths';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, EditorModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnChanges {
  @Input('selectedProject') selectedProject: any;
  
  selectedDate: Date = new Date();
  noteContent: string = '';
  isSaving: boolean = false;

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject'] && this.selectedProject) {
      this.fetchNote();
    }
  }

  onDateChange(): void {
    this.fetchNote();
  }

  getFormattedDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  fetchNote(): void {
    if (!this.selectedProject) return;
    
    const dateStr = this.getFormattedDate(this.selectedDate);
    const url = `${apiPaths.getNote}?projectId=${this.selectedProject._id}&date=${dateStr}`;
    
    this.apiService.get(url).subscribe({
      next: (res: any) => {
        this.noteContent = res.data?.content || '';
      },
      error: (err) => {
        console.error('Error fetching note', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not fetch notes.' });
      }
    });
  }

  saveNote(): void {
    if (!this.selectedProject) return;

    this.isSaving = true;
    const dateStr = this.getFormattedDate(this.selectedDate);
    const payload = {
      projectId: this.selectedProject._id,
      date: dateStr,
      content: this.noteContent
    };

    this.apiService.post(apiPaths.saveNote, payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Note saved successfully!' });
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving note', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save note.' });
      }
    });
  }
}
