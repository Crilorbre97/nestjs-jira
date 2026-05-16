import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { QuestionOptionService } from '../question-option/question-option.service';
import { ExamService } from '../exam/exam.service';
import { Repository } from 'typeorm';
import { Question, QuestionType } from './entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let questionOptionService: QuestionOptionService;
  let examService: ExamService;
  let questionRepository: Repository<Question>;

  const mockExam: Exam = 
    {
      id: 1,
      title: 'Examen 1',
      description: 'Descripción del examen 1',
      isOpen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      openPeriods: [],
      questions: [],
      examSessions: [],
    }
    

  const mockQuestions: Question[] = [
    {
      "id": 1,
      "title": "Pregunta 1",
      "questionType": QuestionType.MULTIPLE_CHOICE,
      "scoreable": true,
      "score": 10,
      "createdAt": new Date(),
      "updatedAt": new Date(),
      "exam": {} as any,
      "questionOptions": [],
    },
     {
      "id": 2,
      "title": "Pregunta 2",
      "questionType": QuestionType.OPEN_ANSWER,
      "scoreable": false,
      "score": 0,
      "createdAt": new Date(),
      "updatedAt": new Date(),
      "exam": {} as any,
      "questionOptions": [],
    }
  ]

  const mockQuestionOptionService = {
    newQuestionOption: jest.fn()
  }

  const mockExamService = {
    findOne: jest.fn()
  }

  const mockQuestionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: QuestionOptionService, useValue: mockQuestionOptionService },
        { provide: ExamService, useValue: mockExamService },
        { provide: getRepositoryToken(Question), useValue: mockQuestionRepository }     
      ],
    }).compile();

    questionService = module.get<QuestionService>(QuestionService);
    questionOptionService = module.get<QuestionOptionService>(QuestionOptionService);
    examService = module.get<ExamService>(ExamService);
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(questionService).toBeDefined();
  });

  it('should return questions by exam id', async () => {
    const examId = 1;
    const spyFindExam = jest.spyOn(examService, 'findOne').mockResolvedValue(mockExam);
    const spy = jest.spyOn(questionRepository, 'find').mockResolvedValue(mockQuestions as any);
    
    const result = await questionService.findQuestionsByExam(examId); 
    expect(spyFindExam).toHaveBeenCalledWith(examId);
    expect(spy).toHaveBeenCalledWith({ where: { exam: { id: examId } }, relations: ['questionOptions'] });
    expect(result).toBe(mockQuestions);
  });

  it('should throw exception when exam not found on findOne', async () => {
    const examId = 1;
    const spyFindExam = jest.spyOn(examService, 'findOne').mockResolvedValue(null);

    await expect(questionService.findQuestionsByExam(examId)).rejects.toThrow(NotFoundException);
    await expect(questionService.findQuestionsByExam(examId)).rejects.toThrow(`Exam with ${examId} not found`);
    expect(spyFindExam).toHaveBeenCalledWith(examId);
  });

  it('should return a question by id', async () => {
    const questionId = 1;
    const spy = jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestions[0]);

    const result = await questionService.findOne(questionId);
    
    expect(spy).toHaveBeenCalledWith({ where: { id: questionId }, relations: ['questionOptions'] });
    expect(result).toBe(mockQuestions[0]);
  })

  it('should throw exception when question not found on findOne', async () => {
    const questionId = 1;
    const spy = jest.spyOn(questionRepository, 'findOne').mockResolvedValue(null);

    await expect(questionService.findOne(questionId)).rejects.toThrow(NotFoundException);
    await expect(questionService.findOne(questionId)).rejects.toThrow(`Question with ${questionId} not found`);
    expect(spy).toHaveBeenCalledWith({ where: { id: questionId }, relations: ['questionOptions'] });
  });

  it('should create a question when dto is valid', async () => {
    const examId = 1;
    const dto: CreateQuestionDto = {
      title: 'Pregunta nueva',
      questionType: QuestionType.ONE_CHOICE,
      scoreable: true,
      score: 5,
      questionOptions: [
        { title: 'Opción 1', isCorrect: false },
        { title: 'Opción 2', isCorrect: true },
      ],
    };

    const spyFindExam = jest.spyOn(examService, 'findOne').mockResolvedValue(mockExam);
    const spyNewQuestionOption = jest.spyOn(questionOptionService, 'newQuestionOption').mockImplementation(option => option as any);
    const spyCreate = jest.spyOn(questionRepository, 'create').mockImplementation(question => question as any);
    const spySave = jest.spyOn(questionRepository, 'save').mockResolvedValue({ id: 1, ...dto, exam: mockExam } as any);

    const result = await questionService.createQuestion(examId, dto);

    expect(spyFindExam).toHaveBeenCalledWith(examId);
    expect(spyNewQuestionOption).toHaveBeenCalledTimes(dto.questionOptions?.length ?? 0);
    dto.questionOptions?.forEach(option => {
      expect(spyNewQuestionOption).toHaveBeenCalledWith({ ...option });
    });
    expect(spyCreate).toHaveBeenCalledWith({ ...dto, questionOptions: dto.questionOptions, exam: mockExam });
    expect(spySave).toHaveBeenCalledWith({ ...dto, questionOptions: dto.questionOptions, exam: mockExam });
    expect(result).toEqual({ id: 1, ...dto, exam: mockExam });
  });

  it('should throw exception when exam not found on create', async () => {
    const examId = 1;
    const dto: CreateQuestionDto = {
      title: 'Pregunta nueva',
      questionType: QuestionType.ONE_CHOICE,
      scoreable: true,
      score: 5,
      questionOptions: [
        { title: 'Opción 1', isCorrect: false },
        { title: 'Opción 2', isCorrect: true },
      ],
    };

    const spyFindExam = jest.spyOn(examService, 'findOne').mockResolvedValue(null);
    const spyNewQuestionOption = jest.spyOn(questionOptionService, 'newQuestionOption');
    const spyCreate = jest.spyOn(questionRepository, 'create');
    const spySave = jest.spyOn(questionRepository, 'save');

    await expect(questionService.createQuestion(examId, dto)).rejects.toThrow(NotFoundException);
    await expect(questionService.createQuestion(examId, dto)).rejects.toThrow(`Exam with ${examId} not found`);
    expect(spyFindExam).toHaveBeenCalledWith(examId);
    expect(spyNewQuestionOption).not.toHaveBeenCalled();
    expect(spyCreate).not.toHaveBeenCalled();
    expect(spySave).not.toHaveBeenCalled();
  });

  it('should delete question', async () => {
    const questionId = 1;
    const spy = jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestions[0]);
    const spyRemove = jest.spyOn(questionRepository, 'remove').mockResolvedValue(undefined as any);

    await questionService.deleteQuestion(questionId);

    expect(spy).toHaveBeenCalledWith({ where: { id: questionId } });
    expect(spyRemove).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it('should throw exception when question not found on delete', async () => {
    const questionId = 1;
    const spy = jest.spyOn(questionRepository, 'findOne').mockResolvedValue(null);
    const spyRemove = jest.spyOn(questionRepository, 'remove');

    await expect(questionService.deleteQuestion(questionId)).rejects.toThrow(NotFoundException);
    await expect(questionService.deleteQuestion(questionId)).rejects.toThrow(`Question with ${questionId} not found`);
    expect(spy).toHaveBeenCalledWith({ where: { id: questionId } });
    expect(spyRemove).not.toHaveBeenCalled();   
  });
});
