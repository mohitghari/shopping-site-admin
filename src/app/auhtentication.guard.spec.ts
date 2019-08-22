import { TestBed, async, inject } from '@angular/core/testing';

import { AuhtenticationGuard } from './auhtentication.guard';

describe('AuhtenticationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuhtenticationGuard]
    });
  });

  it('should ...', inject([AuhtenticationGuard], (guard: AuhtenticationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
