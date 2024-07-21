import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Swimlane } from './entities/swimlane.entity';
import { UserService } from 'src/user/user.service';
import { BoardService } from 'src/board/board.service';
import { UpdateSwimlaneOrderDto } from './dto/update-swimlane-order.dto';

@Injectable()
export class SwimlaneService {
  constructor(
    @InjectRepository(Swimlane)
    private readonly swimlaneRepository: Repository<Swimlane>,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createSwimlaneDto: CreateSwimlaneDto,
    userId: number,
  ): Promise<{ id: number }> {
    const swimlane = new Swimlane();
    swimlane.name = createSwimlaneDto.name;
    swimlane.order = createSwimlaneDto.order;

    const board = await this.boardService.findOne(
      createSwimlaneDto.boardId,
      userId,
    );

    if (!board) {
      throw new UnauthorizedException('Not authorized to create swimlane');
    }

    swimlane.board = board;
    const savedSwimlane = await this.swimlaneRepository.save(swimlane);
    return { id: savedSwimlane.id };
  }

  findAllByBoardId(boardId: number, userId: number) {
    return this.swimlaneRepository.find({
      where: {
        board: {
          id: boardId,
          users: {
            id: userId,
          },
        },
      },
    });
  }

  update(id: number, userId: number, updateSwimlaneDto: UpdateSwimlaneDto) {
    const isUserConnectedToSwimlane = this.hasAccessToSwimlane(id, userId);
    if (!isUserConnectedToSwimlane) {
      throw new UnauthorizedException(
        'You are not authorized to update this swimlane',
      );
    }

    return this.swimlaneRepository.update(
      {
        id,
      },
      {
        name: updateSwimlaneDto.name,
        order: updateSwimlaneDto.order,
      },
    );
  }

  async updateOrder(
    userId: number,
    updateSwimlaneOrderDto: UpdateSwimlaneOrderDto[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const swimlane of updateSwimlaneOrderDto) {
        await queryRunner.manager.update(Swimlane, swimlane.id, {
          order: swimlane.order,
        });
      }

      await queryRunner.commitTransaction();
      return { message: 'Swimlanes order updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Error updating swimlanes order');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, boardId: number, userId: number) {
    const isUserConnectedToBoard = this.userService.isConnectedToBoard(
      userId,
      boardId,
    );
    if (!isUserConnectedToBoard) {
      throw new UnauthorizedException(
        'You are not authorized to delete this swimlane',
      );
    }

    return this.swimlaneRepository.delete({
      id,
      board: {
        id: boardId,
      },
    });
  }

  async hasAccessToSwimlane(swimlaneId: number, userId: number) {
    const hasAcess = await this.swimlaneRepository.count({
      where: {
        id: swimlaneId,
        board: {
          users: {
            id: userId,
          },
        },
      },
    });
    return hasAcess;
  }

  find(swimlaneId: number) {
    return this.swimlaneRepository.findOne({
      where: {
        id: swimlaneId,
      },
    });
  }
}
