import { Context } from 'koa';
import * as appRoot from 'app-root-path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';
import * as mime from 'mime-types';

import FileModel from '../models/file.model';
import { FileDTO } from '../dto/file.dto';
import { IFile } from '../types/file.type';

export class FilesController {
    public async uploadUserFile(ctx: Context) {
        const { file } = ctx.request.files || {};

        if (!file) {
            throw {
                status: 400,
                message: 'File not attached',
            };
        }

        const userId = ctx.user.id;
        const { path, name, type, size } = Array.isArray(file) ? file[0] : file;

        if (!name) {
            throw {
                status: 400,
                message: 'File without name',
            };
        }

        const existFile = await FileModel.getUserFileByName(name, userId);

        if (existFile) {
            await fs.rm(path);

            return (ctx.body = {
                result: true,
                data: new FileDTO(existFile),
            });
        }

        const fileExtension = mime.extension(type || '');
        const newFileName = uuid.v4();
        const newFileFsPath = `${appRoot}/public/uploads/${newFileName}.${fileExtension}`;
        const newFileDownloadPath = `uploads/${newFileName}.${fileExtension}`;

        await fs.copyFile(path, newFileFsPath);

        const createdFile = await FileModel.create({
            userId,
            name,
            size,
            path: newFileFsPath,
            url: newFileDownloadPath,
        });

        ctx.body = {
            result: true,
            data: new FileDTO(createdFile),
        };
    }

    public async getUserFilesList(ctx: Context) {
        const userId = ctx.user.id;

        const files = await FileModel.find({ userId }).lean();
        const count = await FileModel.count({ userId });

        ctx.body = {
            result: true,
            data: {
                list: files.map(file => new FileDTO(file as IFile)),
                count,
            }
        }
    }
}
