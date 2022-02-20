import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import { tuiPure } from '@taiga-ui/cdk';
import { IFile } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {
  @Input()
  public file!: IFile;

  @tuiPure
  public get downloadUrl(): string {
    return `${environment.baseUrl}/${this.file.url}`;
  }
}