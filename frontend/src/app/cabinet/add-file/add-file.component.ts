import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFileComponent implements OnInit {
  public fileControl = new FormControl();

  constructor(
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly fileService: FileService
  ) {}

  public ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((v) => console.log(v));
  }

  public uploadFile() {
    this.fileService
      .uploadFile(this.fileControl.value as File)
      .subscribe(() => {
        this.fileControl.reset();

        this.notificationsService.show('Файл успешно загружен', {
          status: TuiNotification.Success,
        }).subscribe();
      });
  }
}
