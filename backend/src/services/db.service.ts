import * as config from 'config';
import * as mongoose from 'mongoose';

export class DBService {
    public async connect() {
        try {
            await mongoose.connect(`mongodb://${config.get('db.host')}/${config.get('db.name')}`);
        } catch {
            console.error('Failed database connection');
            process.exit(0);
        }

    }
}
