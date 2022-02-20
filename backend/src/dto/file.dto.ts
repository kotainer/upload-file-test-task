import { IFile } from '../types/file.type';

export class FileDTO {
  public id: string;
  public name: string;
  public size: number;
  public url: string;

  constructor(file: IFile) {
    this.id = file._id;
    this.name = file.name;
    this.size = file.size;
    this.url = file.url;
  }
}