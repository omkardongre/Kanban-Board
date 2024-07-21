import { Swimlane } from 'src/swimlane/entities/swimlane.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToMany(() => User, (user) => user.boards)
  @JoinTable()
  users: User[];

  @OneToMany(() => Swimlane, (swimlane) => swimlane.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  swimlanes: Swimlane[];
}
