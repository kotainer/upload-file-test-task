import * as mongoose from 'mongoose';
import * as config from 'config';
import * as uuid from 'uuid';

import { IFile } from '../types/file.type';
import { IFileModel } from '../types/models/file-model.type';

const schema: mongoose.Schema<IFile> = new mongoose.Schema({
    _id: { type: String, default: uuid.v4 },

    userId: { type: String, required: true },

    name: { type: String, required: true },
    url: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },

    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
});

schema.statics.getUserFileByName = async (name: string, userId: string) => {
    const file = await FileModel.findOne({ name, userId }).lean();

    return file;
};

const FileModel = mongoose.model<IFile, IFileModel>(
    `${config.get('db.prefix')}Files`,
    schema,
);

export default FileModel;
