import { User } from "./user.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserAccountRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

@Entity()
export class UserAccount {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserAccountRole,
        default: UserAccountRole.USER
    })
    role: UserAccountRole;

    @OneToOne(() => User, (user) => user.userAccount)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date
}