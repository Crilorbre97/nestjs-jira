import { AnswerOption } from "../../answer-option/entities/answer-option.entity";
import { Question } from "../../question/entities/question.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class QuestionOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column()
    isCorrect: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Question, (question) => question.questionOptions)
    question: Question

    @OneToMany(() => AnswerOption, (answerOption) => answerOption.questionOption)
    answerOption: AnswerOption[]
}