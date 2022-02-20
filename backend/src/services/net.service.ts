import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as koaBody from 'koa-body';
import * as cors from 'koa-cors';
import * as serve from 'koa-static';
import * as config from 'config';
import * as appRoot from 'app-root-path';

import { errorMiddleware, notFoundMiddleware} from '@kotainer/services-middlewares';

import { RoutesProvider } from '../routes';

export class NetService{
    private app: Koa;
    private router: Router;
    private routes: RoutesProvider;

    constructor() {
        this.app = new Koa();
        this.router = new Router();
        this.routes = new RoutesProvider(this.router);
    }

    public init(): void {
        try {
            this.initMiddlewares();
            this.initRoutes();

            this.app.listen(config.get('appPort'), () => {
                console.log(
                    `${config.get('serviceName')} started at port ${config.get(
                        'appPort',
                    )}`,
                );
            });
        } catch {
            console.error('Failed up network service');
            process.exit(0);
        }

    }

    public getRoutes(): RoutesProvider {
        return this.routes;
    }

    private initMiddlewares(): void {
        this.app.use(koaBody({
            formLimit: 5000000,
            multipart: true,
        }));
        this.app.use(logger());
        this.app.use(json());
        this.app.use(errorMiddleware);
        this.app.use(cors());
        this.app.use(serve(appRoot + '/public'));
    }

    private initRoutes(): void {
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());

        this.app.use(notFoundMiddleware);
    }
}
