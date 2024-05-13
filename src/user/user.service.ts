import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserData } from '../@types/express';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Action } from '../enums/action.enum';
import { PictureService } from '../util/picture/picture.service';
import { message } from '../constants/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
    private pictureService: PictureService,
  ) {}

  async getUserProfile(userID: string) {
    const user: User[] = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.review', 'review')
      .leftJoinAndSelect('user.purchase', 'purchase')
      .leftJoinAndSelect('purchase.recordID', 'recordID')
      .where({ id: userID })
      .select([
        'user.firstName',
        'user.lastName',
        'user.birthDate',
        'user.picture',
        'review',
        'purchase.amount',
        'recordID.recordID',
      ])
      .getMany();

    if (!user) {
      throw new HttpException(message.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user.map((u) => ({
      ...u,
      picture: this.pictureService.convertBufferToDataURL(u.picture),
    }));
  }

  async createUser(user: UserData) {
    const pictureBuffer: Buffer =
      await this.pictureService.convertDataURLToBuffer(user.picture);

    const newUser: {
      picture: Buffer;
      email: string;
      firstName: string;
      lastName: string;
    } & User = await this.usersRepository.save({
      ...user,
      picture: pictureBuffer,
    });

    this.eventEmitter.emit('createUserAction', {
      action: Action.CREATE,
      entity: 'user',
      entityID: newUser.id,
      details: 'create user',
    });

    return newUser;
  }

  async updateProfile(
    userID: string,
    dto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    this.eventEmitter.emit('createUserAction', {
      action: Action.UPDATE,
      entity: 'user',
      entityID: userID,
      details:
        'Update:' +
        `${dto.firstName ? 'firstName' : ''}` +
        `${dto.lastName ? 'lastName' : ''}` +
        `${dto.birthDate ? 'birthDate' : ''}` +
        `${dto.picture ? 'picture' : ''}`,
    });

    return this.usersRepository.update(userID, {
      ...dto,
      picture: file.buffer,
    });
  }
  async deleteProfile(userID: string) {
    await this.usersRepository.delete({ id: userID });
    this.eventEmitter.emit('createUserAction', {
      action: Action.DELETE,
      entity: 'user',
      entityID: userID,
      details: 'Delete profile',
    });
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email } });
  }
}
