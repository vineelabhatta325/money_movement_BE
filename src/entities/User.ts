import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'Id' })
    id!: string;

    @Column({ unique: true, name: 'Username' })
    username!: string;

    @Column({ name: 'PasswordHash' })
    passwordHash!: string;

    @Column({ default: 'user', name: 'Role' })
    role!: string;

    @CreateDateColumn({ name: 'CreatedAt' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'UpdatedAt' })
    updatedAt!: Date;
}
