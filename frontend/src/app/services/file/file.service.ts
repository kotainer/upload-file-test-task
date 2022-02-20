import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, IApiResponseList, IFile } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private readonly http: HttpClient) {}

  public uploadFile(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/files/upload`, formData);
  }

  public getFilesList() {
    return this.http.get<IApiResponse<IApiResponseList<IFile>>>(`${environment.apiUrl}/files`);
  }
}
