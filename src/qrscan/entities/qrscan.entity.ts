import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Qrscan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    url: string;

    @Column({ type: 'text' })
    data: string;

    @Column({ type: 'bool'})
    suspicion: boolean;

    @CreateDateColumn()
    createdAt: Date;
}