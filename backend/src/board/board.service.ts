import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private userService: UserService,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: number) {
    const board = new Board();
    board.name = createBoardDto.name;
    const user = await this.userService.findOne(userId);
    board.users = [user];
    return this.boardRepository.save(board);
  }

  findAllByUserId(userId: number) {
    return this.boardRepository.find({
      where: { users: { id: userId } },
      relations: ['users'],
    });
  }

  async findOne(id: number, userId: number) {
    return this.boardRepository.findOne({
      where: { id, users: { id: userId } },
      relations: ['users', 'swimlanes', 'swimlanes.cards'],
    });
  }

  async update(id: number, userId: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardRepository.findOne({
      where: {
        id,
        users: { id: userId },
      },
      relations: ['users'],
    });

    if (!board) {
      throw new NotFoundException(
        'Board not found or you do not have access to update it.',
      );
    }

    board.name = updateBoardDto.name;
    return this.boardRepository.save(board);
  }

  async remove(id: number, userId: number) {
    const board = await this.boardRepository.findOne({
      where: {
        id,
        users: { id: userId },
      },
      relations: ['users'],
    });

    if (!board) {
      throw new NotFoundException('Board not found or you do not have access to delete it.');
    }

    return this.boardRepository.remove(board);
  }

  async findBoardBySwimlaneId(swimlaneId: number) {
    const board = await this.boardRepository.findOne({
      where: {
        swimlanes: {
          id: swimlaneId,
        },
      },
    });
    return board;
  }
}
