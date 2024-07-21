import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';
import { IUpdateCardOrder } from './dto/update-card-order.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCardDto: CreateCardDto, @Request() req: PayloadRequest) {
    return this.cardService.create(createCardDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('order')
  updateOrder(
    @Request() req: PayloadRequest,
    @Body() updateCardOrderDto: IUpdateCardOrder[],
  ) {
    return this.cardService.updateOrder(req.user.id, updateCardOrderDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':cardId/swimlane/:swimlaneId')
  moveToSwimlane(
    @Param('cardId') cardId: number,
    @Param('swimlaneId') swimlaneId: number,
    @Request() req: PayloadRequest,
  ) {
    return this.cardService.moveToSwimlane(cardId, swimlaneId, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: PayloadRequest,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.update(+id, req.user.id, updateCardDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.cardService.remove(+id, req.user.id);
  }
}
