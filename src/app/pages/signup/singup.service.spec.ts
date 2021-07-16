/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SingupService } from './singup.service';

describe('Service: Singup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SingupService]
    });
  });

  it('should ...', inject([SingupService], (service: SingupService) => {
    expect(service).toBeTruthy();
  }));
});
