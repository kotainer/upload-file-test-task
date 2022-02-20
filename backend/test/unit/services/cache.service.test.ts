import { expect } from 'chai';
import { CacheService } from '../../../src/services/cache.service';

describe(CacheService.name, () => {
    let service: CacheService;

    beforeEach(() => {
        service = CacheService.getInstance();
    })

    it('should create', () => {
        expect(service).to.be.an.instanceof(CacheService);
    });

});