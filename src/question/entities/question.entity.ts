import { QuestionOption } from "../../question-option/entities/question-option.entity";
import { Exam } from "../../exam/entities/exam.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum QuestionType {
    MULTIPLE_CHOICE = 'multiple_choice',
    ONE_CHOICE = 'one_choice',
    OPEN_ANSWER = 'open_answer'
}

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'enum', enum: QuestionType })
    questionType: QuestionType;

    @Column()
    scoreable: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2 })   
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
    exam: Exam

    @OneToMany(() => QuestionOption, (questionOption) => questionOption.question, { cascade: [ "insert" ] })
    questionOptions: QuestionOption[]
}