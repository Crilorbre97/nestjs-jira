import { Test, TestingModule } from '@nestjs/testing';
import { ExamSessionController } from './exam-session.controller';

describe('ExamSessionController', () => {
  let controller: ExamSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSessionController],
    }).compile();

    controller = module.get<ExamSessionController>(ExamSessionController);
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
