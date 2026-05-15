import { Test, TestingModule } from '@nestjs/testing';
import { QuestionOptionService } from './question-option.service';

describe('QuestionOptionService', () => {
  let service: QuestionOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionOptionService],
    }).compile();

    service = module.get<QuestionOptionService>(QuestionOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
