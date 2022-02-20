import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputFileModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgxFilesizeModule } from 'ngx-filesize';

import { AddFileComponent } from './add-file/add-file.component';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { CabinetComponent } from './cabinet.component';
import { FileListComponent } from './files-list/files-list.component';
import { FileComponent } from './files-list/file/file.component';

@NgModule({
  imports: [
    CommonModule,
    CabinetRoutingModule,
    ReactiveFormsModule,
    TuiInputFileModule,
    TuiButtonModule,
    TuiIslandModule,
    NgxFilesizeModule,
  ],
  declarations: [
    CabinetComponent,
    AddFileComponent,
    FileListComponent,
    FileComponent,
  ],
})
export class CabinetModule {}
