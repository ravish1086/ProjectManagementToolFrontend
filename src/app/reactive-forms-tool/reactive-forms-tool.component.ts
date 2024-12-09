import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicComponentReactiveFormComponent } from '../dynamic-component-reactive-form/dynamic-component-reactive-form.component';
import { DynamicHooksComponent } from 'ngx-dynamic-hooks';
import { TabViewModule } from 'primeng/tabview';
@Component({
  selector: 'app-reactive-forms-tool',
  standalone: true,
  imports: [NgxJsonViewerModule, FormsModule, CommonModule, NgSelectModule,
    SidebarModule, ButtonModule, ReactiveFormsModule, InputTextModule, CalendarModule,
    RadioButtonModule, CheckboxModule, DynamicHooksComponent, TabViewModule
  ],
  templateUrl: './reactive-forms-tool.component.html'
})
/**
 * Component for dynamically generating reactive forms based on a JSON input.
 * 
 * @export
 * @class ReactiveFormsToolComponent
 */
export class ReactiveFormsToolComponent {
  /**
   * Reference to the container where dynamic components will be inserted.
   * 
   * @type {ViewContainerRef}
   * @memberof ReactiveFormsToolComponent
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  /**
   * Reference to the dynamically created component.
   * 
   * @type {ComponentRef<DynamicComponentReactiveFormComponent>}
   * @memberof ReactiveFormsToolComponent
   */
  componentRef!: ComponentRef<DynamicComponentReactiveFormComponent>;

  /**
   * String input that will be parsed into JSON.
   * 
   * @type {*}
   * @memberof ReactiveFormsToolComponent
   */
  pastedString: any;

  /**
   * Selected category from the dropdown.
   * 
   * @type {*}
   * @memberof ReactiveFormsToolComponent
   */
  selectedCategory: any;

  /**
   * Parsed JSON object from the input string.
   * 
   * @type {*}
   * @memberof ReactiveFormsToolComponent
   */
  parsedJson: any;

  /**
   * Minimum date for date input fields.
   * 
   * @type {Date}
   * @memberof ReactiveFormsToolComponent
   */
  minDate = new Date();

  /**
   * Array of form controls generated from the parsed JSON.
   * 
   * @type {any[]}
   * @memberof ReactiveFormsToolComponent
   */
  formControls: any[] = [];

  /**
   * Boolean indicating whether the sidebar is visible.
   * 
   * @type {boolean}
   * @memberof ReactiveFormsToolComponent
   */
  sidebarVisible = false;

  /**
   * Form group for the generated form.
   * 
   * @type {FormGroup}
   * @memberof ReactiveFormsToolComponent
   */
  formGroupeName!: FormGroup;

  /**
   * Code for creating form controls.
   * 
   * @type {*}
   * @memberof ReactiveFormsToolComponent
   */
  formControlCode!: any;

  /**
   * HTML template for the generated form.
   * 
   * @type {*}
   * @memberof ReactiveFormsToolComponent
   */
  htmlTemplate: any;

  /**
   * Array of input types for form controls.
   * 
   * @type {any[]}
   * @memberof ReactiveFormsToolComponent
   */
  inputType: any = [
    { name: 'text', value: 'text' },
    { name: 'number', value: 'number' },
    { name: 'email', value: 'email' },
    { name: 'password', value: 'password' },
    { name: 'date', value: 'date' },
    { name: 'time', value: 'time' },
    { name: 'phone', value: 'phone' },
    { name: 'url', value: 'url' },
    { name: 'file', value: 'file' },
    { name: 'checkbox', value: 'checkbox' },
    { name: 'radio', value: 'radio' },
    { name: 'Dropdown', value: 'dropdown' },
    { name: 'textarea', value: 'textarea' }
  ];

  /**
   * Array of validation types for form controls.
   * 
   * @type {any[]}
   * @memberof ReactiveFormsToolComponent
   */
  validations: any = [
    { name: 'required', value: 'required', validationMessage: 'This field is required' },
    { name: 'min', value: 'min', validationMessage: 'Please enter Minimum value' },
    { name: 'max', value: 'max', validationMessage: 'Please enter Maximum value' },
    { name: 'minLength', value: 'minLength', validationMessage: 'Please enter Minimum length' },
    { name: 'maxLength', value: 'maxLength', validationMessage: 'Please enter Maximum length' },
    { name: 'pattern', value: 'pattern', validationMessage: 'Please enter valid pattern' },
    { name: 'email', value: 'email', validationMessage: 'Please enter valid email' }
  ];

  /**
   * Array of categories for radio button controls.
   * 
   * @type {any[]}
   * @memberof ReactiveFormsToolComponent
   */
  categories: any[] = [
    { name: 'Yes', key: 'Y', value: true },
    { name: 'No', key: 'N', value: false }
  ];

  defaultImports: string = `import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
\n import { ButtonModule } from 'primeng/button'; \n import { CommonModule } from '@angular/common';
  <br>
  FormsModule, CommonModule, NgSelectModule,
, ButtonModule, ReactiveFormsModule
  `


  imports: any[] = [
      {
        controlType: 'text',
        importModuleName: 'InputTextModule',
        importStatement: 'import { InputTextModule } from \'primeng/inputtext\';'
      },
      {
        controlType: 'number',
        importModuleName: 'InputTextModule',
        importStatement: 'import { InputTextModule } from \'primeng/inputtext\';'
      },
      {
        controlType: 'email',
        importModuleName: 'InputTextModule',
        importStatement: 'import { InputTextModule } from \'primeng/inputtext\';'
      },
      {
        controlType: 'password',
        importModuleName: 'InputTextModule',
        importStatement: 'import { InputTextModule } from \'primeng/inputtext\';'
      },
      {
        controlType: 'date',
        importModuleName: 'CalendarModule',
        importStatement: 'import { CalendarModule } from \'primeng/calendar\';'
      },
      {
        controlType: 'time',
        importModuleName: 'CalendarModule',
        importStatement: 'import { CalendarModule } from \'primeng/calendar\';'
      },
      {
        controlType: 'checkbox',
        importModuleName: 'CheckboxModule',
        importStatement: 'import { CheckboxModule } from \'primeng/checkbox\';'
      },
      {
        controlType: 'radio',
        importModuleName: 'RadioButtonModule',
        importStatement: 'import { RadioButtonModule } from \'primeng/radiobutton\';'
      },
      {
        controlType: 'dropdown',
        importModuleName: 'NgSelectModule',
        importStatement: 'import { NgSelectModule } from \'@ng-select/ng-select\';'
      },
      {
        controlType: 'textarea',
        importModuleName: 'InputTextModule',
        importStatement: 'import { InputTextModule } from \'primeng/inputtext\';'
      }
  ]

  /**
   * Creates an instance of ReactiveFormsToolComponent.
   * 
   * @param {DomSanitizer} sanitizer
   * @memberof ReactiveFormsToolComponent
   */
  constructor(public sanitizer: DomSanitizer) {}

  /**
   * Parses the input string into a JSON object.
   * 
   * @memberof ReactiveFormsToolComponent
   */
  parseInput() {
    this.parsedJson = JSON.parse(this.pastedString);
  }

  /**
   * Processes the parsed JSON to generate form controls.
   * 
   * @memberof ReactiveFormsToolComponent
   */
  processJson() {
    let keys = Object.keys(this.parsedJson);
    let values = Object.values(this.parsedJson);
    this.formControls = [];
    console.log(this.parsedJson, keys);
    let allValidators: any[] = [];
    this.validations.forEach((validation: any) => {
      allValidators.push(validation.value);
    });
    keys.forEach((key, index) => {
      let type = '';
      if (key.includes('modifiedDate') || key.includes('createdDate') || key.includes('updatedDate')
        || key.includes('modifiedBy') || key.includes('createdBy') || key.includes('updatedBy')) {
        return;
      }
      this.formControls.push({
        controlLabel: this.createcontrolLabelFromcontrolName(key),
        controlType: this.getControlType(key, this.parsedJson),
        controlName: key,
        isHtmlControl: true,
        validations: []
      });
    });
    console.log(this.formControls);
  }

  /**
   * Determines the control type based on the key and its value in the JSON object.
   * 
   * @param {string} key
   * @param {*} jsonValue
   * @return {string}
   * @memberof ReactiveFormsToolComponent
   */
  getControlType(key: string, jsonValue: any): string {
    console.log(jsonValue[key]);
    if (Array.isArray(jsonValue[key])) {
      return 'dropdown';
    } else if (jsonValue[key] == 'string') {
      return 'text';
    } else if (typeof (jsonValue[key]) == 'number') {
      return 'number';
    } else if (jsonValue[key] == 'boolean') {
      return 'checkbox';
    } else if (jsonValue[key] == 'array') {
      return 'select';
    } else if (jsonValue[key] == 'object') {
      return 'object';
    } else {
      return 'text';
    }
  }

  /**
   * Deletes a form control at the specified index.
   * 
   * @param {number} index
   * @memberof ReactiveFormsToolComponent
   */
  deleteControl(index: number) {
    this.formControls.splice(index, 1);
  }

  /**
   * Creates a control label from the control name by converting camel case to space-separated words.
   * 
   * @param {string} controlName
   * @return {string}
   * @memberof ReactiveFormsToolComponent
   */
  createcontrolLabelFromcontrolName(controlName: string): string {
    let controlLabel = controlName.replace(/([A-Z])/g, ' $1').trim();
    controlLabel = controlLabel.charAt(0).toUpperCase() + controlLabel.slice(1);
    return controlLabel;
  }

  /**
   * Generates the code for creating form controls and the HTML template for the form.
   * 
   * @memberof ReactiveFormsToolComponent
   */
  createFormControlCode() {
    let formControlCode = 'this.formGroupeName = new FormGroup({\n';
    this.formControls.forEach(control => {
      formControlCode += control.controlName + ': new FormControl(null,[' + this.getValidationCodeForControl(control) + ']),\n';
    });
    formControlCode += '})';
    this.formControlCode = formControlCode;
    console.log(formControlCode);
    this.getHTMLBoilerplateCodeForAllControls();
    this.sidebarVisible = true;
  }

  /**
   * Saves or updates the form.
   * 
   * @memberof ReactiveFormsToolComponent
   */
  saveUpdateForm() {}

  /**
   * Initializes the form group and adds controls to it.
   * 
   * @memberof ReactiveFormsToolComponent
   */
  initiateForm() {
    this.formGroupeName = new FormGroup({});
    this.formControls.forEach(control => {
      this.formGroupeName.addControl(control.controlName, new FormControl(null, [Validators.required]));
    });
    console.log(this.htmlTemplate);
  }

  /**
   * Generates the validation code for a form control.
   * 
   * @param {*} control
   * @return {*}
   * @memberof ReactiveFormsToolComponent
   */
  getValidationCodeForControl(control: any): any {
    let validationCode: any[] = [];
    control.validations.forEach((validationtype: string) => {
      validationCode.push(this.getValidationCode(validationtype));
    });
    console.log(validationCode);
    return validationCode;
  }

  /**
   * Returns the validation code for a specific validation type.
   * 
   * @param {*} validation
   * @return {*}
   * @memberof ReactiveFormsToolComponent
   */
  getValidationCode(validation: any) {
    switch (validation) {
      case 'required':
        return 'Validators.required';
      case 'min':
        return 'Validators.min(0)';
      case 'max':
        return 'Validators.max(0)';
      case 'minLength':
        return 'Validators.minLength(0)';
      case 'maxLength':
        return 'Validators.maxLength(0)';
      case 'pattern':
        return 'Validators.pattern(/^[a-zA-Z0-9]*$/)';
      case 'email':
        return 'Validators.email';
      case 'url':
        return 'Validators.url';
      case 'date':
        return 'Validators.date';
      case 'time':
        return 'Validators.time';
      case 'phone':
        return 'Validators.phone';
      case 'number':
        return 'Validators.number';
      case 'alphanumeric':
        return 'Validators.pattern(/^[a-zA-Z0-9]*$/)';
      case 'alphabets':
        return 'Validators.pattern(/^[a-zA-Z]*$/)';
      case 'decimal':
        return 'Validators.pattern(/^[0-9]*$/)';
      case 'lowercase':
        return 'Validators.pattern(/^[a-z]*$/)';
      case 'uppercase':
        return 'Validators.pattern(/^[A-Z]*$/)';
      default:
        return '';
    }
  }

  /**
   * Generates the HTML boilerplate code for all form controls.
   * 
   * @return {*}
   * @memberof ReactiveFormsToolComponent
   */
  getHTMLBoilerplateCodeForAllControls() {
    this.initiateForm();
    let html = `<form [formGroup]="formGroupeName" (ngSubmit)="saveUpdateForm()" class="label-type1 ng-select-type1 calendar-type1 input-type1 input-div-bg master-form">\n`;
    this.formControls.forEach(control => {
      if (control.isHtmlControl) {
        html += this.getHTMLBoilerplateCode(control) + '\n';
        html += this.getHTMLOfValidators(control);
        html += '</div>\n';
      }
    });
    html += '</form>';
    this.htmlTemplate = html;
    return html;
  }

  /**
   * Generates the HTML code for displaying validation messages for a form control.
   * 
   * @param {*} control
   * @return {*}
   * @memberof ReactiveFormsToolComponent
   */
  getHTMLOfValidators(control: any) {
    let html = `<div *ngIf="formGroupeName.get('${control.controlName}')?.invalid && formGroupeName.get('${control.controlName}')?.touched">\n`;
    control.validations.forEach((validationtype: string) => {
      html += `<small *ngIf="formGroupeName.get('${control.controlName}')?.errors?.['${validationtype}']">Custom Message.</small>\n`;
    });
    html += `</div>\n`;
    return html;
  }

  /**
   * Generates the HTML boilerplate code for a specific form control.
   * 
   * @param {*} control
   * @return {string}
   * @memberof ReactiveFormsToolComponent
   */
  getHTMLBoilerplateCode(control: any): string {
    switch (control.controlType) {
      case 'text':
        let html = `<div class="flex-33p" >
            <label for="${control.controlName}">${control.controlLabel}<span class="asterisk">*</span></label>
            <input pInputText type="text" id="${control.controlName}" placeholder="${control.controlLabel}" formControlName="${control.controlName}">
            `;
        return html;

      case 'number':
        return `<div class="flex-33p" >
            <label for="${control.controlName}">${control.controlLabel}<span class="asterisk">*</span></label>
            <input pInputText type="number" id="${control.controlName}" placeholder="${control.controlLabel}" formControlName="${control.controlName}">
            `;
      case 'email':
        return `<div class="flex-33p" >
            <label for="${control.controlName}">${control.controlLabel}<span class="asterisk">*</span></label>
            <input pInputText type="email" id="${control.controlName}" placeholder="${control.controlLabel}" formControlName="${control.controlName}">`;
      case 'checkbox':
        return `<div class="flex-33p" >
            <label for="${control.controlName}">${control.controlLabel}<span class="asterisk">*</span></label>
            <p-checkbox id="${control.controlName}" name="${control.controlName}" binary="true" formControlName="${control.controlName}"></p-checkbox>`;
      case 'dropdown':
        return `<div class="flex-33p" >
            <label for="${control.controlName}">${control.controlLabel}<span class="asterisk">*</span></label>
            <ng-select #ngdrop tabindex="1" [items]="[]" bindLabel=""
                bindValue="" placeholder="" id="${control.controlName}" formControlName="${control.controlName}">
            </ng-select>`;
      case 'date':
        return `<div class="flex-33p" >
            <label for="${control.controlName}">${control.controlLabel}<span class="asterisk">*</span></label>
            <p-calendar id="travelDate" [iconDisplay]="'input'" formControlName="${control.controlName}"
                        [showIcon]="true" dateFormat="dd/mm/yy" placeholder="${control.controlLabel}" [minDate]="minDate"></p-calendar>`;
      case 'radio':
        return `<div class="flex-33p " >
            <label>${control.controlLabel}<span class="asterisk">*</span></label>
            <div class="cm-d-flex f-gap-10 radio-box-div">
                <div *ngFor="let category of categories" class="field-checkbox ">
                    <p-radioButton 
                        [inputId]="category.key" 
                        [value]="category.value"
                        binary="true"
                        formControlName="${control.controlName}"
                         />
                    <label [for]="category.key" class="ml-2">
                        {{ category.name }}
                    </label>
                </div>
            </div>`;
    }

    return '';
  }
}





/*

    switch (control.controlType) {
      case 'text':
        let html = `<div class="flex-33p" *ngIf="formControl.controlType == '${control.controlType}'">
            <label for="\{\{control.controlName\}\}">\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <input pInputText type="text" id="\{\{control.controlName\}\}" placeholder="\{\{control.controlLabel\}\}" formControlName="\{\{control.controlName\}\}">
            `
        return html;

      case 'number':
        return `<div class="flex-33p" *ngIf="formControl.controlType == '${control.controlType}'">
            <label for="\{\{control.controlName\}\}">\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <input pInputText type="number" id="\{\{control.controlName\}\}" placeholder="\{\{control.controlLabel\}\}" formControlName="\{\{control.controlName\}\}">
            `;
      case 'email':
        return `<div class="flex-33p" *ngIf="formControl.controlType == '${control.controlType}'">
            <label for="\{\{control.controlName\}\}">\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <input pInputText type="email" id="\{\{control.controlName\}\}" placeholder="\{\{control.controlLabel\}\}" formControlName="\{\{control.controlName\}\}">`;
      case 'checkbox':
        return `<div class="flex-33p" *ngIf="formControl.controlType == '${control.controlType}'">
            <label for="\{\{control.controlName\}\}">\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <p-checkbox id="\{\{control.controlName\}\}" name="\{\{control.controlName\}\}" binary="true" formControlName="\{\{control.controlName\}\}"></p-checkbox>`;
      case 'dropdown':
        return `<div class="flex-33p" *ngIf="formControl.controlType == '${control.controlType}'">
            <label for="\{\{control.controlName\}\}">\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <ng-select #ngdrop  tabindex="1"  [items]="[]"  bindLabel="roleName"
                bindValue="roleId"  placeholder="Select Role" id="\{\{control.controlName\}\}"  formControlName="\{\{control.controlName\}\}">
            </ng-select>`;
      case 'date':
        return `<div class="flex-33p" *ngIf="formControl.controlType == '${control.controlType}'">
            <label for="\{\{control.controlName\}\}">\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <p-calendar id="travelDate"  [iconDisplay]="'input'" formControlName="\{\{control.controlName\}\}"
                        [showIcon]="true" dateFormat="dd/mm/yy" placeholder="\{\{control.controlLabel\}\}" [minDate]="minDate"></p-calendar>`;
      case 'radio':
        return `<div class="flex-33p " *ngIf="formControl.controlType == '${control.controlType}'">
            <label >\{\{control.controlLabel\}\}<span class="asterisk">*</span></label>
            <div class="cm-d-flex f-gap-10 radio-box-div">
                <div *ngFor="let category of categories" class="field-checkbox ">
                    <p-radioButton 
                        [inputId]="category.key" 
                        [value]="category.value"
                        binary="true"
                        formControlName="\{\{control.controlName\}\}"
                         />
                    <label [for]="category.key" class="ml-2">
                        {{ category.name }}
                    </label>
                </div>
            </div>`;
      
    }



      getHTMLOfValidators(control: any) {
    let html = `<div *ngIf="formGroupeName.get(control.controlName)?.invalid && formGroupeName.get(control.controlName)?.touched">\n`;
    control.validations.forEach((validationtype: string) => {
      html += `<small *ngIf="formGroupeName.get(control.controlName)?.errors?.['${validationtype}']">Custom Message.</small>\n`;
    });
    html += `</div>\n`;
    return html;
  }
*/