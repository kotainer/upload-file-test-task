import { DBService} from './services/db.service';
import { NetService } from './services/net.service';

const db = new DBService();
const net = new NetService();

async function initService() {
    await db.connect();

    net.init();
};

initService();
