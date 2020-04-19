import { TestBed } from '@angular/core/testing';

import { ClimacellService } from './climacell.service';

describe('ClimacellService', () => {
  let service: ClimacellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimacellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
