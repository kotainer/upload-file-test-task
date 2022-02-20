import * as Router from 'koa-router';
import * as config from 'config';

import users from './users.route';
import files from './files.route';

export class RoutesProvider {
    constructor(
        private readonly router: Router,
    ) {
        this.init();
    }

    private init(): void {
        this.router.prefix(`/api/${config.get('apiVersion')}`);
        this.router.get('/healthz', (ctx) => ctx.body = {status: 'OK'});

        users(this.router);
        files(this.router);
    }
}