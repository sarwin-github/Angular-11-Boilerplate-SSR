import { Routes } from '@angular/router';
import { StudentGuard } from './shared/guard/auth/student.guard';
import { HeaderComponent } from './shared/components/header/header.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule)
      }
    ]
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'student',
        loadChildren: () => import('./views/auth/students/students.module').then(m => m.StudentsModule)
      }
    ]
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'teacher',
        loadChildren: () => import('./views/auth/teachers/teachers.module').then(m => m.TeachersModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];
