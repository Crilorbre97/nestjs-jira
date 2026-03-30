import { UserAccount } from "./user-account.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    phone: string;

    @Column({
        type: 'enum',
        enum: UserGender,
        default: UserGender.MALE
    })
    gender: UserGender;

    @OneToOne(() => UserAccount, (userAccount) => userAccount.user, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn()
    userAccount: UserAccount;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}