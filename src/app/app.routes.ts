import { Routes } from '@angular/router';
import { ReactiveFormsToolComponent } from './reactive-forms-tool/reactive-forms-tool.component';
import { ProjectManagementComponentComponent } from './project-management-component/project-management-component.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'reactive-form-tool',
        component: ReactiveFormsToolComponent
    }
    ,
    {
        path: 'pmTool',
        component: ProjectManagementComponentComponent
    },
    {
        path:'login',
        component: LoginComponent
    }
];
