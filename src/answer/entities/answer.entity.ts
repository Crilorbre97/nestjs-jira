import { Question } from "../../question/entities/question.entity";
import { AnswerOption } from "../../answer-option/entities/answer-option.entity";
import { ExamSession } from "../../exam-session/entities/exam-session.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    response: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => ExamSession, (examSession) => examSession.answers)
    examSession: ExamSession;

    @OneToMany(() => AnswerOption, (answerOption) => answerOption.answer)
    answerOption: AnswerOption[];

    @ManyToOne(() => Question, (question) => question.answers)
    question: Question;
}