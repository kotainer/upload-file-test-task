import * as mongoose from 'mongoose';

export interface IFile extends mongoose.Document {
    _id: string;
    userId: string;
    name: string;
    url: string;
    path: string;
    size: number;

    createdAt: number;
    updatedAt: number;
}
