import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Swimlane {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  order: number;

  @ManyToOne(() => Board, (board) => board.swimlanes, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @OneToMany(() => Card, (card) => card.swimlane, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  cards: Card[];
}
