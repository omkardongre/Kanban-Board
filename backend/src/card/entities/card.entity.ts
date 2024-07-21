import { Swimlane } from 'src/swimlane/entities/swimlane.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @ManyToOne(() => User, (user) => user.cards)
  assignee: User;

  @ManyToOne(() => Swimlane, (swimlane) => swimlane.cards, {
    onDelete: 'CASCADE',
  })
  swimlane: Swimlane;
}
