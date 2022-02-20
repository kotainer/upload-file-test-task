import * as Router from 'koa-router';
import { FilesController } from '../controllers/files.controller';

import { tokenAuthMiddleware } from '@kotainer/services-middlewares';

import { CacheService } from '../services/cache.service';

const controller = new FilesController();
const cacheService = CacheService.getInstance();

export default (router: Router) => {
    router.get(
        '/files',
        tokenAuthMiddleware(cacheService),
        controller.getUserFilesList.bind(controller),
    );

    router.post(
        '/files/upload',
        tokenAuthMiddleware(cacheService),
        controller.uploadUserFile.bind(controller),
    );
};
