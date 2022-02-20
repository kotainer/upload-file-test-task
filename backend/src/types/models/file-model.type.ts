import { Model } from 'mongoose';
import { IFile } from '../file.type';

export interface IFileModel extends Model<IFile> {
  getUserFileByName(name: string, userId: string): Promise<IFile | null>;
}