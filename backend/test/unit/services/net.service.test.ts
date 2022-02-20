import { expect } from 'chai';
import { NetService } from '../../../src/services/net.service';

describe(NetService.name, () => {
    let service: NetService;

    beforeEach(() => {
        service = new NetService();
    })

    it('should create', () => {
        expect(service).to.be.an.instanceof(NetService);
    });

});