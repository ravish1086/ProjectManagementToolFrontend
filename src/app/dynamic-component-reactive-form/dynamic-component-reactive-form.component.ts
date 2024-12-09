import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-dynamic-component-reactive-form',
  standalone: true,
  imports: [NgxJsonViewerModule, FormsModule, CommonModule, NgSelectModule,
    SidebarModule, ButtonModule, ReactiveFormsModule, InputTextModule, CalendarModule,
    RadioButtonModule, CheckboxModule
  ],
  template: `<div #templateContainer></div>`,
  // templateUrl: './dynamic-component-reactive-form.component.html'
})
export class DynamicComponentReactiveFormComponent {
  @Input() template!: string; // HTML template as a string
  @Input() form!: FormGroup;
  @ViewChild('templateContainer', { static: true }) templateContainer!: ElementRef;

  constructor(private renderer: Renderer2){

  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Insert HTML template string into the component's view
    const templateElement = this.renderer.createElement('div');
    templateElement.innerHTML = this.template;

    // Bind form control names dynamically
    const inputElements = templateElement.querySelectorAll('input[formControlName]');
    inputElements.forEach((element: any) => {
      const controlName = element.getAttribute('formControlName');
      const control = this.form.get(controlName);
      if (control) {
        element.value = control.value;
        element.addEventListener('input', (event: any) => {
          control.setValue(event.target.value);
        });
      }
    });

    // Append the template to the container
    this.renderer.appendChild(this.templateContainer.nativeElement, templateElement);
  }

}
