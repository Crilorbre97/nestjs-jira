import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionType } from './entities/question.entity';
import { Question } from './entities/question.entity';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  const mockQuestions: Question[] = [
    {
      id: 1,
      title: 'Pregunta 1',
      questionType: QuestionType.MULTIPLE_CHOICE,
      scoreable: true,
      score: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      exam: {} as any,
      questionOptions: [],
    },
  ];

  const mockQuestionService = {
    findQuestionsByExam: jest.fn(),
    findOne: jest.fn(),
    createQuestion: jest.fn(),
    deleteQuestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [QuestionService],
    })
      .overrideProvider(QuestionService)
      .useValue(mockQuestionService)
      .compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return questions by exam id', async () => {
    const examId = 1;
    const spy = jest
      .spyOn(service, 'findQuestionsByExam')
      .mockResolvedValue(mockQuestions as any);

    const result = await controller.getQuestionsByExam(examId);

    expect(spy).toHaveBeenCalledWith(examId);
    expect(result).toBe(mockQuestions);
  });

  it('should return a question by id', async () => {
    const questionId = 1;
    const spy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockQuestions[0] as any);

    const result = await controller.getQuestionById(questionId);

    expect(spy).toHaveBeenCalledWith(questionId);
    expect(result).toBe(mockQuestions[0]);
  });

  it('should create a question when dto is valid', async () => {
    const examId = 1;
    const dto: CreateQuestionDto = {
      title: 'Nueva pregunta',
      questionType: QuestionType.OPEN_ANSWER,
      scoreable: true,
      score: 5,
      questionOptions: undefined,
    };
    jest.spyOn(CreateQuestionDto, 'validate').mockResolvedValue([]);
    const spy = jest
      .spyOn(service, 'createQuestion')
      .mockResolvedValue(mockQuestions[0] as any);

    const result = await controller.createQuestion(examId, dto);

    expect(CreateQuestionDto.validate).toHaveBeenCalledWith(dto);
    expect(spy).toHaveBeenCalledWith(examId, dto);
    expect(result).toBe(mockQuestions[0]);
  });

  it('should throw BadRequestException when create dto is invalid', async () => {
    const examId = 1;
    const dto: CreateQuestionDto = {
      title: 'Err',
      questionType: QuestionType.ONE_CHOICE,
      scoreable: true,
      score: 5,
      questionOptions: [],
    };
    jest.spyOn(CreateQuestionDto, 'validate').mockResolvedValue([
      'questionOptions is required for multiple choice or one choice questions',
    ]);

    await expect(controller.createQuestion(examId, dto)).rejects.toThrow(BadRequestException);
    expect(CreateQuestionDto.validate).toHaveBeenCalledWith(dto);
    expect(service.createQuestion).not.toHaveBeenCalled();
  });

  it('should delete a question', async () => {
    const questionId = 1;
    const spy = jest
      .spyOn(service, 'deleteQuestion')
      .mockResolvedValue(undefined as any);

    const result = await controller.deleteQuestion(questionId);

    expect(spy).toHaveBeenCalledWith(questionId);
    expect(result).toBeUndefined();
  });
});
