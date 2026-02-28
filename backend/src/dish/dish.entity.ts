import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
