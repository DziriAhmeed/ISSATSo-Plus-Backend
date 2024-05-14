// user.entity.ts
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.enum';
import { Document } from './document.entity';
import { Class } from './class.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true})
  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT})
  userRole: Role;

  @Column({ unique: true })
  identityNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Document, (doc) => doc.teacher)
  documents: Document[];

  @Column({
    foreignKeyConstraintName: 'classId',
    nullable: true
  })
  classId: number

  @ManyToOne(() => Class, (cls) => cls.users, {
    nullable: true
  })
  @JoinColumn({
    name: 'classId',
    foreignKeyConstraintName: 'classId',
    referencedColumnName: 'classId'
  })
  class: Class

}
