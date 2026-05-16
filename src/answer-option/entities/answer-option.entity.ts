import { QuestionOption } from "../../question-option/entities/question-option.entity";
import { Answer } from "../../answer/entities/answer.entity";
import { CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AnswerOption {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Answer, (answer) => answer.answerOption)
    answer: Answer;

    @ManyToOne(() => QuestionOption, (questionOption) => questionOption.answerOption)
    questionOption: QuestionOption;
}