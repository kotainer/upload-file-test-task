import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { IFile } from 'src/app/interfaces';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  public files: IFile[] = [];

  constructor(
    private readonly fileService: FileService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
      this.fileService.getFilesList().subscribe(r => {
        this.files = r.data.list;

        this.changeDetector.markForCheck();
      });
  }
}
