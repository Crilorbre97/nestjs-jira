import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CreateExamDTO } from './dto/create-exam.dto';
import { UpdateExamDTO } from './dto/update-exam.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { Exam } from './entities/exam.entity';

describe('ExamController', () => {
  let controller: ExamController;
  let service: ExamService;

  const mockExams: Exam[] = [
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
    },
    {
      id: 2,
      title: 'Examen 2',
      description: 'Descripción del examen 2',
      isOpen: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      openPeriods: [],
      questions: [],
      examSessions: [],
    },
  ];

  const mockExamService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [ExamService],
    })
      .overrideProvider(ExamService)
      .useValue(mockExamService)
      .compile();

    controller = module.get<ExamController>(ExamController);
    service = module.get<ExamService>(ExamService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list exams', async () => {
    const dto: PaginationDTO = {};
    const expected = {
      data: mockExams,
      total: mockExams.length,
      currentPage: 1,
      totalPages: 1,
    };
    const spy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(expected as any);

    const result = await controller.findAll(dto);

    expect(spy).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should find one exam', async () => {
    const examId = 1;
    const spy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockExams[0] as any);

    const result = await controller.findOne(examId);

    expect(spy).toHaveBeenCalledWith(examId);
    expect(result).toBe(mockExams[0]);
  });

  it('should create exam', async () => {
    const dto: CreateExamDTO = {
      title: 'Examen nuevo',
      description: 'Descripción nueva',
    };
    const spy = jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockExams[0] as any);

    const result = await controller.create(dto);

    expect(spy).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockExams[0]);
  });

  it('should update exam', async () => {
    const examId = 1;
    const dto: UpdateExamDTO = {
      title: 'Examen actualizado',
    };
    const spy = jest
      .spyOn(service, 'update')
      .mockResolvedValue(mockExams[0] as any);

    const result = await controller.update(examId, dto);

    expect(spy).toHaveBeenCalledWith(examId, dto);
    expect(result).toBe(mockExams[0]);
  });

  it('should delete exam', async () => {
    const examId = 1;
    const response = undefined;
    const spy = jest
      .spyOn(service, 'delete')
      .mockResolvedValue(response as any);

    const result = await controller.delete(examId);

    expect(spy).toHaveBeenCalledWith(examId);
    expect(result).toBe(response);
  });
});
