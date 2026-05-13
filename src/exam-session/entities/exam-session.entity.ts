import { Answer } from "../../answer/entities/answer.entity";
import { Exam } from "../../exam/entities/exam.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ExamSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isCompleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Exam, (exam) => exam.examSessions)
    exam: Exam

    @OneToMany(() => Answer, (answer) => answer.examSession)
    answers: Answer[];
}