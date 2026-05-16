import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { CreateExamDTO } from './dto/create-exam.dto';
import { UpdateExamDTO } from './dto/update-exam.dto';
import { NotFoundException } from '@nestjs/common';

describe('ExamService', () => {
  let service: ExamService;
  let repository: Repository<Exam>;

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

  const mockExamRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamService,
        {
          provide: getRepositoryToken(Exam),
          useValue: mockExamRepository,
        },
      ],
    }).compile();

    service = module.get<ExamService>(ExamService);
    repository = module.get<Repository<Exam>>(getRepositoryToken(Exam));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find exams with default pagination', async () => {
    const dto: PaginationDTO = {};
    const spy = jest
      .spyOn(repository, 'findAndCount')
      .mockResolvedValue([mockExams, mockExams.length]);

    const result = await service.findAll(dto);

    expect(spy).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result).toEqual({
      data: mockExams,
      total: mockExams.length,
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('should find one exam by id', async () => {
    const examId = 1;
    const spy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(mockExams[0]);

    const result = await service.findOne(examId);

    expect(spy).toHaveBeenCalledWith({ where: { id: examId } });
    expect(result).toBe(mockExams[0]);
  });

  it('should throw NotFoundException when exam is not found', async () => {
    const examId = 999;
    const spy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(null);

    await expect(service.findOne(examId)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(examId)).rejects.toThrow(
      `Exam with ${examId} not found`,
    );
    expect(spy).toHaveBeenCalledWith({ where: { id: examId } });
  });

  it('should create an exam', async () => {
    const dto: CreateExamDTO = {
      title: 'Examen nuevo',
      description: 'Descripción del examen nuevo',
    };
    const createdExam = { ...mockExams[0], ...dto };
    const spyCreate = jest
      .spyOn(repository, 'create')
      .mockReturnValue(createdExam as Exam);
    const spySave = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(createdExam as Exam);

    const result = await service.create(dto);

    expect(spyCreate).toHaveBeenCalledWith(dto);
    expect(spySave).toHaveBeenCalledWith(createdExam);
    expect(result).toBe(createdExam);
  });

  it('should update an exam', async () => {
    const examId = 1;
    const dto: UpdateExamDTO = {
      title: 'Examen actualizado',
    };
    const existingExam = { ...mockExams[0] };
    const updatedExam = { ...existingExam, ...dto };
    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(existingExam as Exam);
    const spySave = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(updatedExam as Exam);

    const result = await service.update(examId, dto);

    expect(spyFindOne).toHaveBeenCalledWith({ where: { id: examId } });
    expect(spySave).toHaveBeenCalledWith(updatedExam);
    expect(result).toBe(updatedExam);
  });

  it('should throw NotFoundException when updating a non-existing exam', async () => {
    const examId = 999;
    const dto: UpdateExamDTO = { title: 'No existe' };
    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(null);
    const spySave = jest.spyOn(repository, 'save');

    await expect(service.update(examId, dto)).rejects.toThrow(NotFoundException);
    await expect(service.update(examId, dto)).rejects.toThrow(
      `Exam with ${examId} not found`,
    );
    expect(spyFindOne).toHaveBeenCalledWith({ where: { id: examId } });
    expect(spySave).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when update dto is empty', async () => {
    const examId = 1;
    const dto: UpdateExamDTO = {};

    await expect(service.update(examId, dto)).rejects.toThrow(NotFoundException);
    await expect(service.update(examId, dto)).rejects.toThrow(
      'No data provided for update',
    );
  });

  it('should delete an exam', async () => {
    const examId = 1;
    const existingExam = { ...mockExams[0] };
    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(existingExam as Exam);
    const spyRemove = jest
      .spyOn(repository, 'remove')
      .mockResolvedValue(undefined as any);

    await service.delete(examId);

    expect(spyFindOne).toHaveBeenCalledWith({ where: { id: examId } });
    expect(spyRemove).toHaveBeenCalledWith(existingExam);
  });

  it('should throw NotFoundException when deleting a non-existing exam', async () => {
    const examId = 999;
    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(null);
    const spyRemove = jest.spyOn(repository, 'remove');

    await expect(service.delete(examId)).rejects.toThrow(NotFoundException);
    await expect(service.delete(examId)).rejects.toThrow(
      `Exam with ${examId} not found`,
    );
    expect(spyFindOne).toHaveBeenCalledWith({ where: { id: examId } });
    expect(spyRemove).not.toHaveBeenCalled();
  });
});
