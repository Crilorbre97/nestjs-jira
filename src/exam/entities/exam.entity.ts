import { Question } from "../../question/entities/question.entity";
import { OpenPeriod } from "../../open-period/entities/open-period.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExamSession } from "../../exam-session/entities/exam-session.entity";

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    isOpen: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OpenPeriod, (openPeriod) => openPeriod.exam)
    openPeriods: OpenPeriod[]

    @OneToMany(() => Question, (question) => question.exam)
    questions: Question[]

    @OneToMany(() => ExamSession, (examSession) => examSession.exam)
    examSessions: ExamSession[]
}