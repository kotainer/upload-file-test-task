import { expect } from 'chai';
import { DBService } from '../../../src/services/db.service';

describe(DBService.name, () => {
    let service: DBService;

    beforeEach(() => {
        service = new DBService();
    })

    it('should create', () => {
        expect(service).to.be.an.instanceof(DBService);
    });

});