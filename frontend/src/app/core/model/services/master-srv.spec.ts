import { TestBed } from '@angular/core/testing';

import { MasterSrv } from './master-srv';

describe('MasterSrv', () => {
  let service: MasterSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterSrv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
