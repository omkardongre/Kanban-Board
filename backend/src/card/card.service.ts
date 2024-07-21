import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { SwimlaneService } from 'src/swimlane/swimlane.service';
import { UserService } from 'src/user/user.service';
import { IUpdateCardOrder } from './dto/update-card-order.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private swimlaneService: SwimlaneService,
    private userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const card = new Card();
    card.name = createCardDto.name;
    card.order = createCardDto.order;
    card.content = createCardDto.content;

    const hasAcessToSwimlane = this.swimlaneService.hasAccessToSwimlane(
      createCardDto.swimlaneId,
      userId,
    );

    if (!hasAcessToSwimlane) {
      throw new UnauthorizedException(
        'You do not have access to this swimlane',
      );
    }

    const swimlane = await this.swimlaneService.find(createCardDto.swimlaneId);
    card.swimlane = swimlane;

    card.assignee = await this.userService.findOne(userId);

    return this.cardRepository.save(card);
  }

  update(id: number, userId: number, updateCardDto: UpdateCardDto) {
    return this.cardRepository.update(
      {
        id: id,
        assignee: {
          id: userId,
        },
      },
      {
        name: updateCardDto.name,
        content: updateCardDto.content,
      },
    );
  }

  async updateOrder(id: number, updateCardOrderDto: IUpdateCardOrder[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const card of updateCardOrderDto) {
        await queryRunner.manager.update(Card, card.id, { order: card.order });
      }
      await queryRunner.commitTransaction();
      return { message: 'Cards order updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Error updating cards order');
    } finally {
      await queryRunner.release();
    }
  }

  async moveToSwimlane(cardId: number, swimlaneId: number, userId: number) {
    const swimlane = await this.swimlaneService.find(swimlaneId);
    if (!swimlane) {
      throw new Error('Swimlane not found');
    }
    return this.cardRepository.update(
      {
        id: cardId,
        assignee: {
          id: userId,
        },
      },
      {
        swimlane: swimlane,
      },
    );
  }

  remove(id: number, userId: number) {
    return this.cardRepository.delete({
      id,
      assignee: {
        id: userId,
      },
    });
  }
}
