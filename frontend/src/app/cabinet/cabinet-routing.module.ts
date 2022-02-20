import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFileComponent } from './add-file/add-file.component';
import { CabinetComponent } from './cabinet.component';
import { FileListComponent } from './files-list/files-list.component';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'add',
        component: AddFileComponent,
      },
      {
        path: 'list',
        component: FileListComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabinetRoutingModule {}
