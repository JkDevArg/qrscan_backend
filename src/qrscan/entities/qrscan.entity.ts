import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Qrscan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    url: string;

    @Column({ type: 'text' })
    data: string;

    @CreateDateColumn()
    createdAt: Date;
}