import { Exam } from "../../exam/entities/exam.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class OpenPeriod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Exam, (exam) => exam.openPeriods, { onDelete: 'CASCADE' })
    exam: Exam
}