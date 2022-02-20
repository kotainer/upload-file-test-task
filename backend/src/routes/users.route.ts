import * as Router from 'koa-router';
import { UsersController } from '../controllers/users.controller';
import { registerSchema, loginSchema } from '../schemas/user.schema';
import {
    validationMiddleware,
    tokenAuthMiddleware,
} from '@kotainer/services-middlewares';

import { CacheService } from '../services/cache.service';

const controller = new UsersController();
const cacheService = CacheService.getInstance();

export default (router: Router) => {
    router.get('/account', tokenAuthMiddleware(cacheService), controller.me);

    router.post(
        '/account/register',
        validationMiddleware(registerSchema),
        controller.register.bind(controller),
    );

    router.post(
        '/account/login',
        validationMiddleware(loginSchema),
        controller.login.bind(controller),
    );

    router.post(
        '/account/logout',
        tokenAuthMiddleware(cacheService),
        controller.logout.bind(controller),
    );

    router.post('/account/refresh', controller.refreshToken.bind(controller));
};
