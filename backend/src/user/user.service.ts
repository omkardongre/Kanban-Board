import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = createUserDto.password;
    return this.userRepository.save(user);
  }

  findUserByBoardId(boardId: number) {
    return this.userRepository.find({
      where: {
        boards: {
          id: boardId,
        },
      },
      relations: ['boards'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  isConnectedToBoard(id: number, boardId: number) {
    return this.userRepository.findOne({
      where: {
        id,
        boards: {
          id: boardId,
        },
      },
    });
  }

  update(userId: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(userId, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    });
  }

  remove(userId: number) {
    return this.userRepository.delete(userId);
  }
}
