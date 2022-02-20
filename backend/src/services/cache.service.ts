import * as redis from 'redis';
import { ONE_HOUR_IN_SECONDS } from '../consts/system';

export class CacheService {
    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }

        return CacheService.instance;
    }

    private static instance: CacheService;
    private client: redis.RedisClient;

    constructor() {
        this.client = redis.createClient();
    }

    public save(key: string, value: any, ttl = ONE_HOUR_IN_SECONDS): void {
        this.client.set(
            key,
            typeof value !== 'string' ? JSON.stringify(value) : value,
            'EX',
            ttl,
        );
    }

    public get(key: string): Promise<any> {
        return new Promise(resolve => {
            this.client.get(key, (err, res) => {
                if (err) {
                    return resolve(null);
                }

                try {
                    return resolve(JSON.parse(res));
                } catch {
                    return resolve(res);
                }
            });
        });
    }

    public async clear(key: string): Promise<void> {
        return new Promise(resolve => {
            this.client.del(key, () => {
                return resolve();
            });
        });
    }
}
