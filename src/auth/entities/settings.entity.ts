import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column({ type: 'text' })
    privateKey: string;
}