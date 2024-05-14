import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  documentId: number;
  @Column()
  documentName: string;
  @Column()
  documentUrl: string;
  @Column({
    foreignKeyConstraintName: 'userId',
  })
  teacherId: number;
  @Column({
    foreignKeyConstraintName: 'classId',
  })
  classId: number;
  @ManyToOne(() => Class, (cls) => cls.documents)
  @JoinColumn({ name: 'classId' })
  class: Class;
  @ManyToOne(() => User, (usr) => usr.documents)
  @JoinColumn({
    name: 'teacherId',
    referencedColumnName: 'userId',
    foreignKeyConstraintName: 'userId',
  })
  teacher: User;
}
