import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderNo: string;

  @Column('json')
  items: any[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  paymentMethod: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;
}
