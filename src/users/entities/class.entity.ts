import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "./document.entity";
import { User } from "./user.entity";

@Entity() 
export class Class {
    @PrimaryGeneratedColumn()
    classId: number;
    @Column()
    className: string;
    @OneToMany(()=> Document,doc=>doc.class)
    documents:Document[];
    @OneToMany(() => User, (user) => user.class)
    users: User[]
}