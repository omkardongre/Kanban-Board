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
  Query,
} from '@nestjs/common';
import { SwimlaneService } from './swimlane.service';
import { CreateSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';
import { UpdateSwimlaneOrderDto } from './dto/update-swimlane-order.dto';

@Controller('swimlane')
export class SwimlaneController {
  constructor(private readonly swimlaneService: SwimlaneService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createSwimlaneDto: CreateSwimlaneDto,
    @Request() req: PayloadRequest,
  ) {
    return this.swimlaneService.create(createSwimlaneDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/board/:boardId')
  findAll(@Param('boardId') boardId: string, @Request() req: PayloadRequest) {
    return this.swimlaneService.findAllByBoardId(Number(boardId), req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('order')
  updateOrder(
    @Body() updateSwimlaneOrderDto: UpdateSwimlaneOrderDto[],
    @Request() req: PayloadRequest,
  ) {
    return this.swimlaneService.updateOrder(
      req.user.id,
      updateSwimlaneOrderDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSwimlaneDto: UpdateSwimlaneDto,
    @Request() req: PayloadRequest,
  ) {
    return this.swimlaneService.update(+id, req.user.id, updateSwimlaneDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('boardId') boardId: string,
    @Request() req: PayloadRequest,
  ) {
    const ret = this.swimlaneService.remove(+id, +boardId, req.user.id);
    return ret;
  }
}
