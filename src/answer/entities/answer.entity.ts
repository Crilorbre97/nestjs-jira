import { AnswerOption } from "../../answer-option/entities/answer-option.entity";
import { ExamSession } from "../../exam-session/entities/exam-session.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}