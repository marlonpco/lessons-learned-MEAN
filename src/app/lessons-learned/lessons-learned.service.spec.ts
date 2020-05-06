import { TestBed } from '@angular/core/testing';

import { LessonsLearnedService } from './lessons-learned.service';

describe('LessonsLearnedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LessonsLearnedService = TestBed.get(LessonsLearnedService);
    expect(service).toBeTruthy();
  });
});
