import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum QuestionType {
    MULTIPLE_CHOICE = 'multiple_choice',
    ONE_CHOICE = 'one_choice',
    OPEN_ANSWER = 'open_answer'
}

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
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
}